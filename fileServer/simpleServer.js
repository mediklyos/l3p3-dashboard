var http = require('http');
var fs = require ('fs')

var socket;

// Create an HTTP tunneling proxy
var proxy = http.createServer(function (req, res) {
    console.log("creating server function")
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('okay');
});
proxy.on('connect', function(req, cltSocket, head) {
    console.log("connect function")
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
        'Proxy-agent: Node-Proxy\r\n' +
        '\r\n');

//    var rdStream= fs.createReadStream("../dashboard/data/random-data/100/csv0.csv");
//    rdStream.pipe(cltSocket);
});

proxy.on('request',function (request, response){
    console.log('request function');
//    var rdStream= fs.createReadStream("../dashboard/data/random-data/100/csv0.csv");
//    rdStream.pipe(socket);

})

proxy.on('connection', function(cltSocket) {
    console.log("connection")
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
        'Proxy-agent: Node-Proxy\r\n' +
        'Access-Control-Allow-Origin: *\r\n' +
        '\r\n');
    socket = cltSocket;
    var rdStream= fs.createReadStream("../dashboard/data/random-data/100/csv0.csv");
//    var rdStream= fs.createReadStream("../dashboard/data/random-data/10M/csv0.csv");
    rdStream.pipe(cltSocket);
});

proxy.listen(1337)
