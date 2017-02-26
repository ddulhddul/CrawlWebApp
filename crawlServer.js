var express = require('express');
var GoogleScraper = require('google-scraper');
var urlencode = require('urlencode');
var request = require('request');
var tidy = require('htmltidy').tidy;
var cheerio = require('cheerio');
var jade = require('jade');
var bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'jade');
app.set('views', './');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen('3003', function(){
	console.log('3003 connected...')
})

function validate(src){
	if(src.indexOf('http://') == -1) return false;
	else if(src.indexOf('.ico') != -1) return false;
	else if(src.indexOf('.png') != -1) return false;
	else if(src.indexOf('.gif') != -1) return false;
	return true;
}

var urlRequest = function (param, i, result) {
	return new Promise(function (resolve, reject) {
		var url = param[i];
		console.log('url :::', url)
		if(url){
			request(url, function (error, response, body) {
				try {
					if (error) reject('Unexpected Error :::');
					
					var $ = cheerio.load(body);
					var title = 'Title :::';
					if($("title")) title = $("title").text();

					var postElements = $("img");
					postElements.each(function(i, obj) {
						var src = obj.attribs.src;
						if(src) if(result[src]==undefined) if(validate(src)) result.push({
							src: src,
							url: url,
							title: title
						});
					});
					
					urlRequest(param, i+1, result)
					.then(function (r) {
						resolve(r);
					}, function (error) {
						res.send('Error'+error);
					});
				} catch(e) {
					resolve(result);
					console.log('request Error :::', e);
				}
			})
		}else resolve(result);
	});
};

app.get('/main', function(req,res){
	res.render('main');
})

app.post('/main', function(req,res){
	console.log('req :::n\n', req)
	var keyword = urlencode(req.body.name);
	var scrape = new GoogleScraper({
	  keyword: keyword,
	  language: "kr",
	  tld:"com",
	  results: 10
	}); 
	scrape.getGoogleLinks.then(function(value) {
		console.log('GOOGLE SEARCH SUCCESS :::');
		urlRequest(value, 0, [])
		.then(function (result) {
			console.log('result ::: \n', result);
			res.render('resultView', {
				results: result
			});
		}, function (error) {
			res.send('url request Call Erro :::\n'+error);
		});
	}).catch(function(e) {
		console.log('GOOGLE SEARCH ERROR :::');
		res.send(e);
	})

})

