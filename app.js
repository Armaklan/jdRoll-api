"use strict";

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

var connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'devdev',
  database: 'jdRoll'
});

app.get('/apiv2', function(req, res) {
  res.send('Ping !');
});

var chatProvider = new ChatProvider(connection);
var userProvider = new UserProvider(connection);

io.on('connection', function(socket) {
  new UserSocket(io, socket, chatProvider);
});

http.listen(5000, function() {
  console.log('listening on *:5000');
});


app.get('/apiv2/users/connected', function(req, res) {
    userProvider.connected(function(users) {
        res.send(users);
    });
});

app.get('/apiv2/users', function(req, res) {
    userProvider.all(function(users) {
        res.send(users);
    });
});

const NEW_MSG_EVENT = 'chat-new-message',
      INIT_MSG_EVENT = 'chat-init-message',
      USER_LOGON_EVENT = 'user-logon',
      DEL_MSG_EVENT = 'chat-delete-message';

function UserProvider(connection) {
    this.all = function(callback) {
        connection.query("SELECT user.* FROM user JOIN last_action ON last_action.user_id = user.id WHERE user.profil >= 0 AND time > DATE_SUB(now(), INTERVAL 1 MONTH) ORDER BY user.username ASC", [], function(err, rows) {
            if(!err) {
                callback(rows.map((r) => new User(r)));
            } else {
                callback([]);
            }
        });
    };

    this.connected = function(callback) {
        connection.query("SELECT user.* FROM last_action JOIN user ON last_action.user_id = user.id WHERE time > DATE_SUB(now(), INTERVAL 5 MINUTE) ORDER BY user.username ASC", [], function(err, rows) {
            if(!err) {
                callback(rows.map((r) => new User(r)));
            } else {
                callback([]);
            }
        });
    };
}

function ChatProvider(connection) {
  this.saveMessage = function(msg) {
      console.log(msg.to);
    connection.query("INSERT INTO chat (message, username, to_username) VALUES (?,?,?)", [msg.text, msg.from, msg.to]);
  };

  this.deleteMessage = function(msg) {
    connection.query("DELETE FROM chat WHERE ID = ?", [msg.id]);
  };

  this.getLastMessage = function(username, cb) {
    connection.query("SELECT * FROM chat WHERE to_username = '' OR to_username = ? OR username = ? ORDER BY time DESC LIMIT 0, 100", [username, username], function(err, rows) {
      if(err) {
        console.log("Impossible de récuperer les chats courant : " + err);
        cb([]);
      } else {
        rows.reverse();
        cb(rows.map((r) => new Message(r)));
      }
    });
  };

}

function User(data) {
    var that = this;

    _build(data);

    function _build(data) {
        that.id = data.id;
        that.username = data.username;
        that.profil = data.profil;
    }
}

function Message(message) {
    var that = this;

    that.isPrivate = function() {
        return that.to;
    };

    if(message && message.from) {
        fromEvent(message);
    } else {
        fromDb(message);
    }

    function fromEvent(message) {
        that.id = message.id;
        that.to = message.to;
        that.from = message.from;
        that.text = message.text;
        that.time = new Date();
        that.private = that.isPrivate();
        parseChatMsg(that);
    }

    function fromDb(data) {
        that.id = data.id;
        that.to = data.to_username;
        that.from = data.username;
        that.text = data.message;
        that.time = data.time;
        that.private = that.isPrivate();
    }
}

function UserSocket(io, socket, chatProvider) {
  socket.on(USER_LOGON_EVENT, logonEvent);
  socket.on(NEW_MSG_EVENT, messageEvent);
  socket.on(DEL_MSG_EVENT, deleteMessageEvent);

  function logonEvent(username) {
    socket.join(username);
    loadInitialMessage(username);
  }

  function loadInitialMessage(username) {
    chatProvider.getLastMessage(username, (messages) => {
      socket.emit(INIT_MSG_EVENT, messages);
    });
  }

  function messageEvent(data) {
    var message = new Message(data);
    if(message.isPrivate()) {
      sendPrivateMessage(message);
    } else {
      sendMessage(message);
    }
    saveMessage(message);
  }

  function deleteMessageEvent(message) {
    io.emit(DEL_MSG_EVENT, message);
    chatProvider.deleteMessage(message);
  }

  function sendPrivateMessage(message) {
      socket.to(message.to).emit(NEW_MSG_EVENT, message);
      socket.emit(NEW_MSG_EVENT, message);
  }

  function sendMessage(message) {
    io.emit(NEW_MSG_EVENT, message);
  }

  function saveMessage(message) {
    chatProvider.saveMessage(message);
  }
}

function parseChatMsg(message) {
    //On strip les tags HTML
    var cleanText = message.text.replace(/<\/?[^>]+(>|$)/g, "");

		//On remplace la forme HTML du '<' par son équivalent ascii
    cleanText = cleanText.replace(/&lt/g, "<");

    cleanText = urlLink(cleanText);
    cleanText = parseSmiley(cleanText);

    if(cleanText.search('/me') > -1) {
        cleanText = cleanText.replace("/me", message.from + " ");
				cleanText = `<span class="dialogue"><span style="font-size: 8.5pt; font-family: 'Verdana','sans-serif'; color: #4488cc;">${cleanText}</span></span>`;
        message.from = "";
    }

    message.text = cleanText;
}

function urlLink(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url.substring(0, 50) + '...</a>';
    });
}

function parseSmiley(cleanText) {
    const tinymce_emoticon = "../../../../vendor/tinymce/plugins/emoticons/img/";
    cleanText = cleanText.replace(":)", "<img src='" + tinymce_emoticon + "smiley-smile.gif' alt=''>");
    cleanText = cleanText.replace(";)", "<img src='" + tinymce_emoticon + "smiley-wink.gif' alt=''>");
    cleanText = cleanText.replace(":p", "<img src='" + tinymce_emoticon + "smiley-tongue-out.gif' alt=''>");
    cleanText = cleanText.replace(":X", "<img src='" + tinymce_emoticon + "smiley-sealed.gif' alt=''>");
    cleanText = cleanText.replace(":'(", "<img src='" + tinymce_emoticon + "smiley-cry.gif' alt=''>");
    cleanText = cleanText.replace("8-)", "<img src='" + tinymce_emoticon + "smiley-cool.gif' alt=''>");
    cleanText = cleanText.replace("o-)", "<img src='" + tinymce_emoticon + "smiley-innocent.gif' alt=''>");
    cleanText = cleanText.replace(":D", "<img src='" + tinymce_emoticon + "smiley-laughing.gif' alt=''>");
    cleanText = cleanText.replace(":mrgreen:", "<img src='../../../../img/smileys-mrgreen.gif' alt=''>");
    return cleanText;
}
