#!/usr/bin/nodejs
/*  Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

/*Commands*/
var COMMAND_EXIT = "exit";
var COMMAND_CONNECT = "c";
var COMMAND_BROADCAST = "b";
var COMMAND_DISCONNECT = "d";
var COMMAND_LIST = "l";
var COMMAND_ECHO = "e";
var COMMAND_HELP = "help";

var helpMessage = "List of parameters: \n" +
    " - /c <ws_addr>, connect to a web socket, The addr format can contain the ws:// prefix or not"

/*Requires*/
var readline = require('readline');
var WebSocket = require('ws')
var listWS = [];
var activeClient = undefined;

var port = 10000;
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var prompt = "# "
rl.setPrompt(prompt,prompt.length);

process.argv.forEach(function (val, index) {

    if (index == 2) {
        port = val;
    }

});


var print = function (string,prompt){
    console.log("\n"+string);
    if (prompt=== undefined || prompt ){
        rl.prompt();
    }
}

var newClient = function (addr,port) {
    var direction;
    if (port === undefined){
        direction = addr;
    } else {
        direction = addr+":"+port;
    }
    
    if (direction.indexOf("ws://") != 0){
        direction = "ws://"+direction;
        
    }
    var ws = new WebSocket(direction);
    activeClient = listWS.length;
    listWS.push(ws);

    ws.on('open', function () {
        print("Connection stabilized")

    });
    ws.on('message', function (message) {
        print("Received in client " + listWS.indexOf(ws) + ": "+message)
        if (ws.callback !== undefined){
            ws.callback(message)
        }
    });
    ws.on('close',function () {
        if (activeClient ==listWS.indexOf(ws)){
            activeClient = undefined;
            prompt = "# ";
        } else if (activeClient > listWS.indexOf(ws)){
            activeClient --;
            prompt = activeClient+") ";
        }
        print("Connection closed")
        listWS.splice(listWS.indexOf(ws));
    })
    ws.on('error',function (message){
//        listWS.slice(listWS.indexOf(ws),1)
//        activeClient = undefined;
//        prompt = "# ";
        print ("Error in the websocket")
    })
    return true;
}


var readCommand = function (){
    rl.prompt()
    rl.on('line',function(answer) {
        if (!executeCommand(answer)){
            endRoutine()
        } else {
            rl.setPrompt(prompt,prompt.length);
            rl.prompt();
        }

    });
    rl.on('close', function() {
        console.log('Have a great day!');
        process.exit(0);
    });
}

var executeCommand = function (input){
    if (input.trim().indexOf("/"+COMMAND_EXIT) == 0){
        endRoutine();
        print("Exiting...")
        return false;
    }
    if ((input.charAt(0) == "/") && (input.charAt(1)) != "/") {
        var command = input.slice(1).split(" ");
        switch (command[0]) {
			case COMMAND_HELP : 
				print(helpMessage)
				break;
            case COMMAND_CONNECT :
                switch (command.length) {
                    case 2:
                        if (newClient(command[1])) {
                            prompt = activeClient + ") "
                        }
                        break;
                    case 3:
                        if (newClient(command[1],command[2])) {
                            prompt = activeClient + ") "
                        }
                        break;
                    default :
                        print("Incorrect number of parameters")


                }
                break;
            case COMMAND_ECHO:
                if (activeClient !== undefined) {
                    listWS[activeClient].callback = (function (message){
                        wsSend(this,input)
                    }).bind(listWS[activeClient])
                } else {
                    for (var key in listWS) {
                        listWS[key].callback = (function (message){
                            wsSend(this,input)
                        }).bind(listWS[key])
                    }
                }
                print("Echo function defined")
                break;
            case COMMAND_BROADCAST:
                activeClient = undefined;
                prompt = "# ";
                print("Mode broadcast active")
                break;
            case COMMAND_DISCONNECT:
                if (activeClient === undefined){
                    for (var key in listWS){
                        listWS[key].terminate();
                    }
                } else {
                    listWS[activeClient].terminate();
                }
                activeClient = undefined;
                prompt = "# "
                break;
            case COMMAND_LIST:
                var cad = "There are " + listWS.length+ " clients connected\n";
                for (var key in listWS){
                    if (key == activeClient){
                        cad += "*"
                    }
                    cad += key + ") " +listWS[key].url+ "\n";
                }
                print (cad)
                break;
            default :
                if (command[0].indexOf(COMMAND_CONNECT) == 0){
                    command[0] = command[0].slice(COMMAND_CONNECT.length);
                    var iClient = parseInt(command[0])
                    if (iClient !== NaN && iClient < listWS.length && iClient >= 0){
                        activeClient = iClient
                        print ("Changing client to "+iClient+"= "+listWS[iClient].url)
                        prompt = activeClient + ") "

                    } else if (iClient === NaN ){
                        print ("The client "+iClient+" does not exist")
                    } else {
                        print("Unknown command")
                    }
                } else {
                    print("Unknown command")
                }
        }
    } else {
        if ((input.charAt(0) == "/") && (input.charAt(1)) == "/") {
            input = input.slice(1);

        }
        if (input !== ""){
            if (activeClient === undefined){
                for (var key in listWS){
                    wsSend(listWS[key],input)
                }
            } else {
                wsSend(listWS[activeClient],input)
            }
        }

    }
    return true;
}

var endRoutine = function (){
    rl.close();
};

var wsSend = function (ws,message){
    try { ws.send(message); }
    catch (e) {
        print("There are some problem sending a message")
    }
    
}
readCommand();
