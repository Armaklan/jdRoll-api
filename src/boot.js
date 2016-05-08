var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var Message = require('./model/message.model.js');


var connection, dConnection, userProvider, chatProvider;

function runApp() {
    connectDb();
    declareProvider();
    declareHandler();
    http.listen(5000, function() {
        console.log('listening on *:5000');
    });
}

function connectDb() {
    connection = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'devdev',
        database: 'jdRoll'
    });
    dConnection = new (require('./database/connection.js'))(connection);
}

function declareProvider() {
    chatProvider = new (require('./provider/chat.provider.js'))(connection);
    userProvider = new (require('./provider/user.provider'))(dConnection);
}

function declareHandler() {
    require('./handler/user.handler.js')(app, userProvider);
    require('./handler/socket.handler.js')(io, chatProvider);
}

module.exports = runApp;
