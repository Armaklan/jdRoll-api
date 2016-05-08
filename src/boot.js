var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var Message = require('./model/message.model.js');
var cookieParser = require('cookie-parser');
var phpSessionMiddleware = require('./middleware/phpsession.middleware.js');


var connection, userProvider, chatProvider, sessionProvider, statProvider;

function runApp() {
    connectDb();
    declareProvider();
    declareMiddleware();
    declareHandler();
    http.listen(5000, function() {
        console.log('listening on *:5000');
    });
}

function connectDb() {
    var mysqlConnection = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'devdev',
        database: 'jdRoll'
    });
    connection = new (require('./database/connection.js'))(mysqlConnection);
}

function declareProvider() {
    chatProvider = new (require('./provider/chat.provider.js'))(connection);
    userProvider = new (require('./provider/user.provider'))(connection);
    sessionProvider = new (require('./provider/session.provider'))(connection);
    statProvider = new (require('./provider/stat.provider.js'))(connection);
}

function declareHandler() {
    require('./handler/user.handler.js')(app, userProvider);
    require('./handler/socket.handler.js')(io, chatProvider);
    require('./handler/stat.handler.js')(app, statProvider);
}

function declareMiddleware() {
    app.use(cookieParser());
    app.use(phpSessionMiddleware(sessionProvider));
}

module.exports = runApp;
