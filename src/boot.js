var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var Message = require('./model/message.model.js');
var cookieParser = require('cookie-parser');
var phpSessionMiddleware = require('./middleware/phpsession.middleware.js');

function runApp(config) {
    var connection = connectDb(config.database);
    var services = declareProvider(connection);
    declareMiddleware(app, services);
    declareHandler(app, io, services);
    http.listen(5000, function() {
        console.log('listening on *:5000');
    });
}

function connectDb(dbConfig) {
    var mysqlConnection = mysql.createPool(dbConfig);
    return new (require('./database/connection.js'))(mysqlConnection);
}

function declareProvider(connection) {
    var services = {};
    services.chatProvider = importProvider('./provider/chat.provider.js', connection);
    services.userProvider = importProvider('./provider/user.provider', connection);
    services.sessionProvider = importProvider('./provider/session.provider', connection);
    services.statProvider = importProvider('./provider/stat.provider.js', connection);
    return services;
}

function declareHandler(app, io, services) {
    require('./handler/user.handler.js')(app, services.userProvider);
    require('./handler/socket.handler.js')(io, services.chatProvider);
    require('./handler/stat.handler.js')(app, services.statProvider);
}

function declareMiddleware(app, services) {
    app.use(cookieParser());
    app.use(phpSessionMiddleware(services.sessionProvider));
}

function importProvider(path, connection) {
    var Provider = require(path);
    return new Provider(connection);
}

module.exports = runApp;
