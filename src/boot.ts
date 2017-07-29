import express = require('express');
import http = require('http');
import socketIo = require('socket.io');
const mysql: any = require('mysql');
const squel: any = require('squel');
import cookieParser  = require('cookie-parser');
import phpSessionMiddleware from './middleware/phpsession.middleware';

import dbConnection from './database/connection';

import userHandler from './handler/user.handler';
import socketHandler from './handler/socket.handler';
import statHandler from './handler/stat.handler';
import characterHandler from './handler/character.handler';
import notifHandler from './handler/notif.handler';


import MailService from './mail/mail.service';
import ChatProvider from './provider/chat.provider';
import UserProvider from './provider/user.provider';
import SessionProvider from './provider/session.provider';
import StatProvider from './provider/stat.provider';
import CharacterProvider from './provider/character.provider';
import CampagneProvider from './provider/campagne.provider';

var app = express();
var serverHttp = http.createServer(app);
var io = socketIo(serverHttp);
squel.useFlavour('mysql');

export default function runApp(config: any) {
    var connection = connectDb(config.database);
    var services = declareProvider(connection);
    declareMiddleware(app, services);
    declareHandler(app, io, services);
    serverHttp.listen(5000, function() {
        console.log('listening on *:5000');
    });
}

function connectDb(dbConfig: any) {
    var mysqlConnection = mysql.createPool(dbConfig);
    return new dbConnection(mysqlConnection);
}

function declareProvider(connection: any) {
    var providerDependencies = {
        connection: connection,
        sqlBuilder: squel
    };
    var services = {
      mailService: new MailService(),
      chatProvider: new ChatProvider(connection),
      userProvider: new UserProvider(providerDependencies),
      sessionProvider: new SessionProvider(providerDependencies),
      statProvider: new StatProvider(providerDependencies),
      characterProvider: new CharacterProvider(providerDependencies),
      campagneProvider: new CampagneProvider(providerDependencies)
    }
    return services;
}

function declareHandler(app: any, io: any, services: any) {
    userHandler(app, services.userProvider);
    socketHandler(io, services.chatProvider);
    statHandler(app, services.statProvider);
    characterHandler(app, services.characterProvider, services.campagneProvider);
    notifHandler(app, services.mailService);
}

function declareMiddleware(app: any, services: any) {
    app.use(cookieParser());
    app.use(phpSessionMiddleware(services.sessionProvider));
}
