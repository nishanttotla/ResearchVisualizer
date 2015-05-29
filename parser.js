var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

var instream = fs.createReadStream('sample-data.txt');
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);

var currPub = {};
var citations = [];

rl.on('line', function(line) {
  // console.log(line);
  if(line[1] == '*') { // title
    currPub['title'] = line.substring(2);
  } else if(line[1] == '@') { // authors
    currPub['authors'] = line.substring(2);
  } else if(line[1] == 't') { // year
    currPub['year'] = parseInt(line.substring(2));
  } else if(line[1] == 'c') { // conference
    currPub['venue'] = line.substring(2);
  } else if(line[1] == 'i') { // id
    currPub['id'] = parseInt(line.substring(6));
  } else if(line[1] == '%' && line != '#%') { // citation
    citations.push(parseInt(line.substring(2)));
  } else if(line[1] == '!') {
    currPub['citations'] = citations;
    console.log(currPub);
    console.log("NOW ERASING!");
    currPub = {};
    citations = [];
  }
});

rl.on('close', function() {
  console.log("DONE!");
});