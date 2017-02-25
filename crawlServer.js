/*
https://www.google.co.kr/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=nodejs+%ED%81%AC%EB%A1%A4%EB%A7%81
https://dobest.io/nodejs-web-crawling-with-cheerio/
http://creativeworks.tistory.com/entry/PYTHON-3-Tutorials-24-%EC%9B%B9-%ED%81%AC%EB%A1%A4%EB%9F%AClike-Google-%EB%A7%8C%EB%93%A4%EA%B8%B0-1-How-to-build-a-web-crawler
http://mititch.tistory.com/36

Crawling, Scraping, Parsing
	Scraping - http, https, request
	Parsing - JSDOM, cheerio

$ npm install request
$ npm install cheerio

https://www.npmjs.com/package/google-scraper
$ npm install google-scraper --save
$ npm install urlencode --save

https://www.npmjs.com/package/google-images-scraper
$ npm install google-images-scraper --save

*/
var express = require('express');
var GoogleScraper = require('google-scraper');
var urlencode = require('urlencode');

var app = express();
app.listen('3003', function(){
	console.log('3003 connected...')
})

app.get('/scrape', function(req,res){
	var keyword = urlencode('avcc');
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
	})
})

/*var request = require('request');
var tidy = require('htmltidy').tidy;
var url = 'https://maps.google.co.kr/maps?q=%EC%84%B1%EC%A0%95%EB%8F%99+%EB%A7%9B%EC%A7%91&ion=1&espv=2&bav=on.2,or.r_cp.&bvm=bv.146094739,d.dGo&biw=1280&bih=670&dpr=1&um=1&ie=UTF-8&sa=X&ved=0ahUKEwicyo3Z7PfRAhUDUZQKHQPbCRIQ_AUIBigB';
request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	console.log('########################\n\n\n\n');
	tidy(body, function(err, html) {
	    console.log(html);
	});
  }
})*/