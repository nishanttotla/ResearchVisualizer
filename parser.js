// modules for database connection
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

var insertedCount = 0;

// function to insert a single document into the database
function insertDocument(dbHandle, doc, callback) {
    dbHandle.collection('publications').insertOne(doc, function(err, result) {
    assert.equal(err, null);
    insertedCount++;
    console.log("Publications inserted: " + insertedCount);
    callback();
  });
};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Opened database connection!");

  // modules for reading the file
  var fs = require('fs');
  var readline = require('readline');
  var stream = require('stream');

  // interfaces for file streams
  var instream = fs.createReadStream('soft-eng-data.txt');
  var outstream = new stream;
  var rl = readline.createInterface(instream, outstream);

  var currPub = {};
  var citations = [];
  rl.on('line', function(line) {
    if(line[1] == '*') { // title
      currPub['title'] = line.substring(2);
    } else if(line[1] == '@') { // authors
      currPub['authors'] = line.substring(2).split(',');
    } else if(line[1] == 't') { // year
      currPub['year'] = parseInt(line.substring(2));
    } else if(line[1] == 'c') { // conference
      currPub['venue'] = line.substring(2);
    } else if(line[1] == 'i') { // id
      currPub['id'] = parseInt(line.substring(6));
    } else if(line[1] == '%' && line != '#%') { // citation
      citations.push(parseInt(line.substring(2)));
    } else if(line[1] == '!') {
      currPub['citations'] = citations; // record all citations

      // add record to database
      insertDocument(db, currPub, function() {
        console.log("Insert document callback executing!");
      });
      currPub = {};
      citations = [];
    }
  });

  rl.on('close', function() {
    console.log("DONE!");
    db.close();
  });
});