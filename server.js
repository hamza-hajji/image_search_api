 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();
var axios = require('axios');

const API_KEY = '702db5e5b4454d1d89ca11d8768b0858';
const ENDPOINT = 'https://api.cognitive.microsoft.com/bing/v5.0/images/search';

var searchTerms = [];

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });

app.route('/')
  .get(function(req, res) {
	  res.sendFile(process.cwd() + '/views/index.html');
  });

app.route('/search/:term')
  .get(function (req, res) {
    axios({
      method: 'get',
      url: `${ENDPOINT}?q=${req.params.term}&count=10&offset=${req.query.offset || 0}`,
      headers: {'Ocp-Apim-Subscription-Key': API_KEY}
    }).then(function (result) {
      searchTerms.push(req.params.term);
      res.json({
        results: result.data.value.map(function (image) {
          return {
            alt: image.name,
            imageUrl: image.contentUrl,
            pageUrl: image.hostPageUrl
          }
        })
      });
    }).catch(function (e) {
      res.status(400).send(e);
    });
  });

app.route('/latest')
  .get(function (req, res) {
    res.send({
      "latest-search-terms": searchTerms
    });
  });

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
