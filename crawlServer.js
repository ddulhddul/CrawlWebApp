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

var urlRequest = function (param) {
	return new Promise(function (resolve, reject) {
		var result = [];
		request(url, function (error, response, body) {
			if (error) throw error;
			var $ = cheerio.load(body);
			var postElements = $("img");
			postElements.each(function(i, obj) {
				var src = obj.attribs.src;
	  			if(src.indexOf('http://') != -1){
	  				result.push(src);
	  			}
			});
			resolve(result);
		})
	});
};


app.get('/scrape', function(req,res){
	url = 'http://bikamp.tistory.com/75';
	urlRequest(url)
	.then(function (result) {
		res.render('main', {
			srcs: result
		});
	}, function (error) {
		res.send('Error'+error);
	});

	/*var keyword = urlencode('avcc');
	var scrape = new GoogleScraper({
	  keyword: keyword,
	  language: "kr",
	  tld:"com",
	  results: 100
	}); 
	scrape.getGoogleLinks.then(function(value) {
		console.log(111);
		res.send(value);
	}).catch(function(e) {
		console.log(222);
		res.send(e);
	})*/

})

