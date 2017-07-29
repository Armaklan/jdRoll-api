"use strict";

import Character from '../model/character.model';

export default class CharacterProvider {

  sqlBuilder: any;
  connection: any;
  
  constructor(service) {
    this.sqlBuilder = service.sqlBuilder;
    this.connection = service.connection;
  }

  nameWith(campagneId: number, searchText: string, publicOnly: boolean) {
    var query = this.baseSql()
      .where("personnages.campagne_id = ?", campagneId)
      .where("UPPER(personnages.name) like ?", "%" + searchText.toUpperCase() + "%");

    if (publicOnly) {
      query = query.where("statut = ?", 0)
    }

    var sql = query.limit(5).toString();

    return this.connection
      .query(sql)
      .then(rowsMapper);
  }

  baseSql() {
    return this.sqlBuilder
      .select("personnages.*")
      .from("personnages");
  }

}

function rowsMapper(rows) {
  return rows.map(rowMapper);
}

function rowMapper(row) {
  return new Character(row);
}
