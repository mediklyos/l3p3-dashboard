
var http = require('http');
var fs = require ('fs')

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

    var rdStream= fs.createReadStream("../dashboard/data/random-data/100/csv0.csv");
    rdStream.pipe(cltSocket);
});

proxy.listen(1337)