var express = require('express');
var GoogleScraper = require('google-scraper');
var urlencode = require('urlencode');
var request = require('request');
var tidy = require('htmltidy').tidy;
var cheerio = require('cheerio');
var jade = require('jade');

var app = express();
app.set('view engine', 'jade');
app.set('views', './');
app.listen('3003', function(){
	console.log('3003 connected...')
})

var urlRequest = function (param, i, result) {
	return new Promise(function (resolve, reject) {
		
		console.log('url :::', param[i])
		if(param[i]){
			request(param[i], function (error, response, body) {
				if (error) reject('Unexpected Error :::');
				var $ = cheerio.load(body);
				var postElements = $("img");
				postElements.each(function(i, obj) {
					var src = obj.attribs.src;
					if(src){
			  			if(src.indexOf('http://') != -1){
			  				result.push(src);
			  			}
					}
				});
				
				urlRequest(param, i+1, result)
				.then(function (r) {
					resolve(r);
				}, function (error) {
					res.send('Error'+error);
				});
			})
		}else resolve(result);
	});
};


app.get('/scrape', function(req,res){
	
	var keyword = urlencode('하하호호');
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
			res.render('main', {
				srcs: result
			});
		}, function (error) {
			res.send('url request Call Erro :::\n'+error);
		});
	}).catch(function(e) {
		console.log('GOOGLE SEARCH ERROR :::');
		res.send(e);
	})

})

