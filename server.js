var http = require('http');
var url = require('url');

var server = http.createServer(function(request, response){
  console.log('Connection');
  var queryObject = url.parse(request.url, true).query;
  console.log(queryObject);
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write('hello! you hit the server from ' + request.url);
  response.end();
});

server.listen(8001);

