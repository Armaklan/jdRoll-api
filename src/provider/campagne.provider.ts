"use strict";

import Campagne from '../model/campagne.model';

export default class CampagneProvider {

  sqlBuilder: any;
  connection: any;

  constructor(service) {
    this.sqlBuilder = service.sqlBuilder;
    this.connection = service.connection;
  }

  get(id) {
    var sql = this.sqlBuilder
      .select('campagne.*')
      .from("campagne")
      .where("campagne.id = ?", id)
      .toString();

    return this.connection
      .query(sql)
      .then(rowMapper);

  }


};

function rowMapper(rows) {
  if (rows) {
    return new Campagne(rows[0]);
  }
  return undefined;
}
