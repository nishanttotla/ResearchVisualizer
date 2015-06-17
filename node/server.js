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

var findPublicationsByAuthor = function(db, author, callback) {
  db.collection('publications', function(err, collection) {
    collection.find({"authors":author}).toArray(callback);
  });
};

var findPublicationsGeneralQuery = function(db, query, callback) {
  db.collection('publications', function(err, collection) {
    collection.find(query).toArray(callback);
  });
};

function constructCleanQuery(query) {
  var cleanQuery = {};
  if(query.id != null && query.id != undefined) {
    cleanQuery['id'] = parseInt(query.id);
  }
  if(query.author != null && query.author != undefined) {
    cleanQuery['authors'] = query.author;
  }
  if(query.venue != null && query.venue != undefined) {
    cleanQuery['venue'] = query.venue;
  }
  return cleanQuery;
}

var server = http.createServer(function(request, response){
  // ignore the request for the favicon
  if(request.url != '/favicon.ico') {
    console.log('Request received!');

    var queryObject = url.parse(request.url, true).query;
    console.log(queryObject);
    console.log(request.url);
    var requestType = queryObject.type;
    console.log('Type: ' + requestType);

    async.series(
      [function(callback) { // connect to and query database
        MongoClient.connect(dbUrl, function(err, db) {
            assert.equal(null, err);
            console.log("Opened database connection!")

            ///////////////////////// QUERY PROCESSING CODE //////////////////////////////
            if(requestType == 'id') {
              var idRequested = parseInt(queryObject.id);
              findPublications(db, idRequested, function(err, ret) {
                console.log("Closing database connection!");
                db.close();
                retObjArray = ret;
                callback(null, null);
              });
            } else if(requestType == 'author') {
              var authorRequested = queryObject.author;
              findPublicationsByAuthor(db, authorRequested, function(err, ret) {
                console.log("Closing database connection!");
                db.close();
                retObjArray = ret;
                callback(null, null);
              });
            } else if(requestType == 'general') {
              var cleanQuery = constructCleanQuery(queryObject);
              findPublicationsGeneralQuery(db, cleanQuery, function(err, ret) {
                console.log("Closing database connection!");
                db.close();
                retObjArray = ret;
                callback(null, null);
              });
            }
            //////////////////////////////////////////////////////////////////////////////
        });
      },
      function(callback) { // process the obtained response
        // retObj = retObjArray[0];
        retObj = retObjArray;
        retObjArray = [];
        callback(null, null);
      }],
      function(err, results) {
        assert.equal(null, err);
        // send response if no error reported
        console.log("Database queried and response created");
            response.writeHead(200, {'Content-Type': 'application/json',
                                     'Access-Control-Allow-Origin' : '*'});
        if(retObj != null) {
          retObj = {'list': retObj};
          response.write(JSON.stringify(retObj));
        }
        response.end();
    });
  }
});

server.listen(PORT);

