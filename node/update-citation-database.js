// modules for database connection
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

var insertedCount = 0;

// function to insert a single document into the database
function insertDocument(db, doc, callback) {
    db.collection('citations').insertOne(doc, function(err, result) {
    assert.equal(err, null);
    insertedCount++;
    console.log("Papers analyzed: " + insertedCount);
    callback();
  });
};

var findPublications = function(db, callback) {
   var cursor = db.collection('publications').find();
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         var docId = doc.id;
         var docCitations = doc.citations;
         for(var i=0; i<docCitations.length; i++) {
           var insertDoc = {"source": docCitations[i], "target": docId};
           insertDocument(db, insertDoc, function() {
             // do nothing here
           })
         }
      } else {
          console.log("Closing database connection!")
          db.close();
      }
   });
};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Opened database connection!")
  findPublications(db, function() {
      // console.log("Closing database connection!");
      // db.close();
  });
});