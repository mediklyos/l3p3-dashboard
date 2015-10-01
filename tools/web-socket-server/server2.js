var http = require('http'),
    WebSocketServer = require('ws').Server;

var server = http.createServer();

var wss = new WebSocketServer({
    server: server,
    path: '/mysocket'
});
var wss2 = new WebSocketServer({
    server: server,
    path: '/mysocket2'
});

wss.on('connection', function (ws) {

    ws.send('echo server');

    ws.on('message', function (message) {
        ws.send(message);
    });

});
wss2.on('connection', function (ws) {

    ws.send('echo server2');

    ws.on('message', function (message) {
        ws.send(message);
    });

});

server.listen(1234);
