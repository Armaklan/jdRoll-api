"use strict";

export default class User {

  id: string;
  username: string;
  profil: string;

  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.profil = data.profil;
  }
};
