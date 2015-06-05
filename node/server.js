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
  db.collection('publications', function(err, collection) {
    collection.find({"id":id}).toArray(callback);
  });
};

var server = http.createServer(function(request, response){
  // ignore the request for the favicon
  if(request.url != '/favicon.ico') {
    console.log('Request received!');

    var queryObject = url.parse(request.url, true).query;
    console.log(queryObject);
    console.log(request.url);
    var idRequested = parseInt(queryObject.id);

    async.series(
      [function(callback) { // connect to and query database
        MongoClient.connect(dbUrl, function(err, db) {
            assert.equal(null, err);
            console.log("Opened database connection!")
            findPublications(db, idRequested, function(err, ret) {
              console.log("Query done!");
              console.log("Closing database connection!");
              db.close();
              retObjArray = ret;
              callback(null, null);
            });
        });
      },
      function(callback) { // process the obtained response
        retObj = retObjArray[0];
        retObjArray = [];
        callback(null, null);
      }],
      function(err, results) {
        // send response if no error reported
        console.log("Database queried and response created");
            response.writeHead(200, {'Content-Type': 'application/json',
                                     'Access-Control-Allow-Origin' : '*'});
        if(retObj != null) {
          response.write(JSON.stringify(retObj));
        }
        response.end();
    });
  }
});

server.listen(PORT);

