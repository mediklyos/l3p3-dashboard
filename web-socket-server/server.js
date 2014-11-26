#!/usr/bin/nodejs
var fs = require ('fs')
var WebSocketServer = require('ws').Server;
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/*PARAMETERS name*/
var PARAM_PORT = "port";
var PARAM_FILE_OUTPUT = "out"
var PARAM_OUTPUT_CONSOLE = "console"

/*Commands*/
var COMMAND_EXIT = "exit";
var COMMAND_WS = "ws";
var COMMAND_BACK = "b";
var COMMAND_ECHO = "e";
var COMMAND_SIM = "sim";
var COMMAND_DEBUG = "d"
var DEBUG_COMMAND = "/sim demo1.sim"
var SYSTEM_PREFIX_MSG_OUT = " -> "
var SYSTEM_PREFIX_MSG_IN = " <- "

var callbackMessage = undefined;

/*Prompt vars*/
var inputPrefix = []
var mode = 0;
inputPrefix[0] = "Command# "
inputPrefix[1] = "WS"
rl.setPrompt(inputPrefix[0],inputPrefix[0].length);
var outputFileName = undefined;
var outConsole = false;
var wsList = [];


var DEBUG = true;
var port = 10082
process.argv.forEach(function (val, index) {
    if (val == "debug") {
        DEBUG = true;
    } else {
        var values = val.split("=")
        switch (values[0]){
            case PARAM_PORT:
                if (values.length  == 2){
                    port = parseInt(values[1])
                }
                break;
            case PARAM_FILE_OUTPUT:
                if (values.length  == 2){
                    outputFileName = values[1];
//                    outputFile = fs.open(fileName,"a")
//                    outputFile.write("hola")

                }
                break;
            case PARAM_OUTPUT_CONSOLE:
                console.log("por consola")
                outConsole = true
                break;
        }
    }

});
var print = function (string){
    if (outputFileName !== undefined){
        printFile(string,true)
    }
    if (outputFileName === undefined || outConsole){
        readline.moveCursor(process.stdout,-(rl._prompt.length),0)
        readline.clearLine(process.stdout,0)
        console.log(SYSTEM_PREFIX_MSG_OUT+string);
        rl.prompt();
    }

}
var printFile = function (string,out){
    var cad
    if (out){
        cad = SYSTEM_PREFIX_MSG_OUT +string
    } else {
        cad = SYSTEM_PREFIX_MSG_IN +string
    }
    fs.appendFile(outputFileName,Date.now()+":"+cad+"\n");
}

/* options*/
var LIST_OPTION = "-l"
/*Modes*/
var NORMAL_MODE = 0;
var WS_MODE = 1;
var wss = new WebSocketServer({port: port});
console.log("Listen on port: "+port)
if (outConsole || outputFileName === undefined){
    console.log("Output console active")
}
if (outputFileName !== undefined) {
    console.log("File Output active. " + outputFileName)
}


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



function start(){
    /*Web-socket server init*/
    wss.on('connection', function (ws) {
        print('New connection incoming. It is the '+ wsList.length +' connection. ')
        wsList.push(ws);
        ws.isClosed = false;
        ws.on('message',function (message) {
            print("New message from " +wsList.indexOf(ws) +": "+message)
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
var cleanWhitespaces  = function (string) {
    return string.replace(/\s{2,}/g, ' ')
}

var executeCommand = function (input,callback){
    input = cleanWhitespaces(input)
    if (outputFileName !== undefined){
        printFile(input);
    }
//    inputList.add(input);
    if (input.trim().indexOf("/"+COMMAND_EXIT) == 0){
        endRoutine();
        print("Exiting...")
        return false;
    }
    /*Commands*/
    if ((input.charAt(0) == "/") && (input.charAt(1)) != "/") {
        var command = input.slice(1).split(" ");
        if (command[0] ==COMMAND_DEBUG){
            print ("Debug command="+DEBUG_COMMAND);
            return executeCommand(DEBUG_COMMAND,callback)
        }
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

                            if (wsList.length > parseInt(command[1])) {
                                wsActive = parseInt(command[1]);
                                print("Web Socket communication mode, Active to " + wsActive)
                                mode = WS_MODE;
                            } else {
                                print("There are only " + wsList.length + " web socket/s")
                            }

                        } else {
                            print("Unknown option")
                        }
                        break;
                    case COMMAND_SIM:
                        print("OK")
                        runSimulation(command)
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
                                if (wsList.length > parseInt(command[1])) {
                                    wsActive = parseInt(command[1]);
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


var START_SIM_COMMAND = "/start";
var END_SIM_COMMAND = "/end";
var SIM_COMMAND_WSS = "/wss"
var SIM_SPLIT_CHAR = " "
var SIM_COMMAND_SEND = "send"
var SIM_COMMAND_SEND_BROADCAST = "broadcast"
var SIM_TIMEOUT = 200;

var runSimulation = function (command) {
    fs.readFile(command[1], function (err, data) {
        if (err) throw err;
        var string = data.toString();
        var dataArray = string.split("\n");
        var nLine =0;
        while (dataArray[nLine].indexOf(START_SIM_COMMAND)!=0){
            var sLine = cleanWhitespaces(dataArray[nLine])
            print("config line ="+sLine)
            var command = sLine.split(" ")[0];

            switch (command) {
                case SIM_COMMAND_WSS:
                    var wssArray = sLine.substr(sLine.indexOf(" ")+1).split(" ")
                    var wssList = {};
                    wssArray.forEach(function (ws) {
                        var split = ws.split("=")
                        wssList[split[1]] = wsList[split[0]]
                        print(ws)

                    })
                    break;
            }

            nLine++
        }
        nLine++;
        print("Start Simulation, The simulation has "+(dataArray.length-nLine-2) +" instructions.");
        var realTime = 0;
        while (dataArray[nLine].indexOf(END_SIM_COMMAND) != 0) {
            var newLine = cleanWhitespaces(dataArray[nLine])
            var simTime = + newLine.split(SIM_SPLIT_CHAR,1)[0]
            realTime = simTime+SIM_TIMEOUT;
            newLine = newLine.substr(newLine.indexOf(SIM_SPLIT_CHAR)+1)
            var simCommand = newLine.split(SIM_SPLIT_CHAR,1)[0];
            newLine = newLine.substr(newLine.indexOf(SIM_SPLIT_CHAR)+1)
            switch (simCommand){
                case SIM_COMMAND_SEND:
                    var wsName = newLine.split(SIM_SPLIT_CHAR,1)[0]
                    var message =  newLine.substr(newLine.indexOf(SIM_SPLIT_CHAR)+1)
                    var ws = wssList[wsName];
                    var cad = "Time="+simTime+", WebSocket="+wsName+", Message="+message;
                    if (ws === undefined){
                        cad += " ,status=WebSocket is undefined"
                    } else {
                        cad += " ,status=OK"
                        setTimeout(function (ws,message){
                            ws.send(message)
                        }.bind(this,ws,message),realTime);
                    }
                    setTimeout(print.bind(this,cad),realTime);
                    break;
                case SIM_COMMAND_SEND_BROADCAST:
                    break;
            }
            nLine++;
        }
        print ("Simulation time= "+simTime+" ms")
        setTimeout(function () {
            print("End simulation");
        },+realTime+SIM_TIMEOUT)



    });}
start();
if (DEBUG){
//    executeCommand("/ws");
//    executeCommand("/e");

    readCommand();
    setTimeout(executeCommand.bind(this,"/sim demo1.sim"),3000);
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


