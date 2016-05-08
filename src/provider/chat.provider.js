var Message = require('../model/message.model.js');

function ChatProvider(connection) {
    this.saveMessage = function(msg) {
        connection.query("INSERT INTO chat (message, username, to_username) VALUES (?,?,?)", [msg.text, msg.from, msg.to]);
    };

    this.deleteMessage = function(msg) {
        connection.query("DELETE FROM chat WHERE ID = ?", [msg.id]);
    };

    this.getLastMessage = function(username, cb) {
        connection.query("SELECT * FROM chat WHERE to_username = '' OR to_username = ? OR username = ? ORDER BY time DESC LIMIT 0, 100", [username, username], function(err, rows) {
            if(err) {
                cb([]);
            } else {
                rows.reverse();
                cb(rows.map((r) => new Message(r)));
            }
        });
    };

}

module.exports = ChatProvider;
