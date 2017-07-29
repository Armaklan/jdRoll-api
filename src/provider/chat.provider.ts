import Message from '../model/message.model';

export default class ChatProvider {
  connection: any;

  constructor(connection) {
    this.connection = connection;
  }

  saveMessage(msg) {
    return this.connection.query("INSERT INTO chat (message, username, to_username) VALUES (?,?,?)", [msg.text, msg.from, msg.to]).then((result) => result.insertId);
  }

  deleteMessage(msg) {
    return this.connection.query("DELETE FROM chat WHERE ID = ?", [msg.id]);
  }

  getLastMessage(username) {
    return this.connection.query("SELECT * FROM chat WHERE to_username = '' OR to_username = ? OR username = ? ORDER BY time DESC LIMIT 0, 100", [username, username]).then((rows) => {
      rows.reverse();
      return rows.map((r) => new Message(r));
    });
  }

};
