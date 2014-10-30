var DEBUG = false;
process.argv.forEach(function (val, index) {
    if (val == "debug") {
        DEBUG = true;
    }

});
var print = function (string,prompt){
    console.log("\n"+string);
    if (prompt) {
        rl.prompt();
    }
}

/*Commands*/
var COMMAND_EXIT = "exit";
var COMMAND_WS = "ws";
var COMMAND_BACK = "b";
var COMMAND_ECHO = "e";
var callbackMessage = undefined;

/* options*/
var LIST_OPTION = "-l"
/*Modes*/
var NORMAL_MODE = 0;
var WS_MODE = 1;

var WebSocketServer = require('ws').Server;
var port = 10082;
var wss = new WebSocketServer({port: port});
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
/*ws mode vars*/
var wsActive = undefined
/*
var keypress = require('keypress');

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
//    rl.write(ch)
//    rl.write(key);
//    console.log('got "keypress"', key);
//    if (key && key.ctrl && key.name == 'c') {
//        process.stdin.pause();

//    }
});
*/
var inputPrefix = []
var mode = 0;
inputPrefix[0] = "Command# "
inputPrefix[1] = "WS"
rl.setPrompt(inputPrefix[0],inputPrefix[0].length);

var wsList = [];



function start(){
    /*Web-socket server init*/
    wss.on('connection', function (ws) {
        print('\nNew connection incoming. It is the '+ wsList.length +' connection. ',true)
        wsList.push(ws);
        ws.isClosed = false;
        ws.on('message',function (message) {
            print("New message from " +wsList.indexOf(ws) +": "+message, true)
            if (ws.callback !== undefined){
                ws.callback(message)
            }
        })
        ws.on('close',function (message){
            print("Connection "+ wsList.indexOf(ws)+" closed");
            ws.isClosed = true;
            wsList.splice(wsList.indexOf(ws));
        })
    })

    // Reading commands



}


var readCommand = function (){
    rl.prompt()
    rl.on('line',function(answer) {
        // TODO: Log the answer in a database
//        console.log("Thank you for your valuable feedback:", answer);
//        rl.close();
        if (!executeCommand(answer)){
            endRoutine()
        } else {
            var newPrompt = inputPrefix[mode];
            if (mode == WS_MODE){
                if(wsActive == undefined){
                    newPrompt += "-all# "
                } else {
                    newPrompt += "-"+wsActive+"# "
                }
            }
            rl.setPrompt(newPrompt)
            rl.prompt();
        }

    });
    rl.on('close', function() {
        console.log('Have a great day!');
        process.exit(0)
    });
}

var executeCommand = function (input,callback){
//    inputList.add(input);
    if (input.trim().indexOf("/"+COMMAND_EXIT) == 0){
        endRoutine();
        print("Exiting...")
        return false;
    }
    /*Commands*/
    if ((input.charAt(0) == "/") && (input.charAt(1)) != "/") {
        var command = input.slice(1).split(" ");
        switch (mode) {
            default :
            case NORMAL_MODE:
                switch (command[0]) {
                    case COMMAND_BACK:
                        mode(1);

                        print("This command is not allow here")
                        break;
                    case COMMAND_WS:
                        if (command.length == 1) {
                            print("Web Socket communication mode. Broadcast to all")
                            wsActive = undefined;
                            mode = WS_MODE;
                        } else if (command [1] === LIST_OPTION) {
                            print("#ws=" + wsList.length);//+". The list of open sockets: ")

                        } else if (parseInt(command[1]) !== NaN) {
                            wsActive = parseInt(command[1]);
                            if (wsList.length > wsActive) {
                                print("Web Socket communication mode, Active to " + wsActive)
                                mode = WS_MODE;
                            } else {
                                print("There are only " + wsList.length + " web socket/s")
                            }

                        } else {
                            print("Unknown option")
                        }
                        break;
                    default :
                        print("Unknown command")
                }
                break;
            case WS_MODE :
                if ((input.charAt(0) == "/") && (input.charAt(1)) != "/") {
                    var command = input.slice(1).split(" ");
                    switch (command[0]) {
                        case COMMAND_BACK:
                            print("Back to normal model")
                            mode = NORMAL_MODE;
                            break;
                        case COMMAND_ECHO:
                            if (wsActive !== undefined) {
                                wsList[wsActive].callback = (function (message){
                                    this.send(message);
                                }).bind(wsList[wsActive])
                            } else {
                                for (var key in wsList) {
                                    wsList[key].callback = (function (message){
                                        this.send(message);
                                    }).bind(wsList[key])
                                }
                            }
                            print("Echo function defined")
                            break;
                        case COMMAND_WS:
                            if (command.length == 1) {
                                print("Web Socket communication mode. Broadcast to all")
                                wsActive = undefined;
                                mode = WS_MODE;
                            } else if (command [1] === LIST_OPTION) {
                                print("#ws=" + wsList.length);//+". The list of open sockets: ")

                            } else if (parseInt(command[1]) !== NaN) {
                                wsActive = parseInt(command[1]);
                                if (wsList.length > wsActive) {
                                    print("Web Socket communication mode, Active to " + wsActive)
                                    mode = WS_MODE;
                                } else {
                                    print("There are only " + wsList.length + " web socket/s")
                                }

                            } else {
                                print("Unknown option")
                            }
                            break;
                        default :
                            print("Unknown command")


                    }
                }
                break;

        }

    } else {
        if ((input.charAt(0) == "/") && (input.charAt(1)) == "/"){
            input = input.slice(1);
        }
        switch (mode) {
            default :
            case NORMAL_MODE :
                print ("Write: "+input);
                break;
            case WS_MODE :
                if (input !== ""){
                    if (wsActive !== undefined) {
                        wsList[wsActive].send(input)
                    } else {
                        for (var ws in wsList) {
                            wsList[ws].send(input);
                        }
                    }
                }
                break;
        }
    }
    if (callback !== undefined){
        return callback();
    }
    return true;

}

var endRoutine = function (){
    for(var ws in wsList){
//        ws.close();
    }
    wss.close();
    rl.close();
}
start();
if (DEBUG){
    executeCommand("/ws");
    executeCommand("/e");
    readCommand();
    return;
    /*Client*/

    var WebSocketClient = require('ws')
    var clientWs = new WebSocketClient('ws://localhost:'+port);
    clientWs.on('open', function() {
//        ws.send('something');
//        print(clientWs.url)
        executeCommand("/ws -l");
        executeCommand("/ws");

        executeCommand("hola");
    });
    clientWs.on('message', function(message) {
        print('CLIENT: received:'+ message);

    });
//    executeCommand("/exit")
//    executeCommand("/exit")


} else {
    readCommand();
}


