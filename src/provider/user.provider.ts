"use strict";

import User from '../model/user.model';

export default class UserProvider {
  sqlBuilder: any;
  connection: any;

  constructor(service) {
    this.sqlBuilder = service.sqlBuilder;
    this.connection = service.connection;
  }




  all() {
    var sql = this.baseSql()
      .where("user.profil >= ?", 0)
      .where("time > DATE_SUB(now(), INTERVAL 1 MONTH)")
      .order("user.username")
      .toString();
    return this.connection.query(sql).then(rowsMapper);
  }

  connected() {
    var sql = this.baseSql()
      .where("time > DATE_SUB(now(), INTERVAL 5 MINUTE)")
      .order("user.profil", false)
      .order("user.username")
      .toString();
    return this.connection.query(sql).then(rowsMapper);
  }

  baseSql() {
    return this.sqlBuilder
      .select("user.*")
      .from("user")
      .join("last_action", null, "last_action.user_id = user.id");
  }
};

function rowsMapper(rows) {
  return rows.map(rowMapper);
}

function rowMapper(row) {
  return new User(row);
}
