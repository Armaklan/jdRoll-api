import PHPUnserialize = require('php-unserialize');

export default class SessionProvider {
  connection: any;
  sqlBuilder: any;

  constructor(dependencies) {
    this.connection = dependencies.connection;
    this.sqlBuilder = dependencies.sqlBuilder;
  }

  get(sessionId) {
    var sql = this.baseSql().where("session_id = ?", sessionId).toString();
    return this.connection.query(sql).then(parsePhpSession);
  }

  baseSql() {
    return this.sqlBuilder.select()
      .from('session');
  }

};


function parsePhpSession(rows) {
  if (!rows || rows.length === 0) return undefined;

  var data = rows[0].session_value;
  data = PHPUnserialize.unserializeSession(data);
  return data._sf2_attributes.user;
}


