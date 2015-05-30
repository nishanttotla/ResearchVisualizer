var http = require('http');
var url = require('url');

const PORT = 8001;

var server = http.createServer(function(request, response){
  // ignore the request for the favicon
  if(request.url != '/favicon.ico') {
    console.log('Request received!');

    var queryObject = url.parse(request.url, true).query;
    console.log(queryObject);
    console.log(request.url);

    // create response
    retObj = {"id":0,"title":"Scala","authors":["Jack","Mike"],"abstract":"","keywords":[],"type":0,"venue":"POPL","year":2013}
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(retObj));
    response.end();
  }
});

server.listen(PORT);

