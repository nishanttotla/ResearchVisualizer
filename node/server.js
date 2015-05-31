var http = require('http');
var url = require('url');
var async = require('async');

// modules for database connection
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var dbUrl = 'mongodb://localhost:27017/test';

const PORT = 8001;

var retObjArray = [];

var findPublications = function(db, id, callback) {
   var cursor = db.collection('publications').find({"id":id});
   console.log("query done!")
   var ret = cursor.toArray();
   callback(ret);
};

var server = http.createServer(function(request, response){
  // ignore the request for the favicon
  if(request.url != '/favicon.ico') {
    console.log('Request received!');

    var queryObject = url.parse(request.url, true).query;
    console.log(queryObject);
    console.log(request.url);
    var idRequested = parseInt(queryObject.id);

    MongoClient.connect(dbUrl, function(err, db) {
      assert.equal(null, err);
      console.log("Opened database connection!")
      findPublications(db, idRequested, function(ret) {
          console.log("Closing database connection!");
          db.close();
          retObjArray = ret;
      });
    });

    // create response
    retObj = retObjArray[0];

    retObjArray = [];

    response.writeHead(200, {'Content-Type': 'application/json'});
    if(retObj != null) {
      response.write(JSON.stringify(retObj));
    }
    response.end();
  }
});

server.listen(PORT);

