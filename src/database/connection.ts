export default class DatabaseConnection {
  mysqlConnection: any;

  constructor(mysqlConnection: any) {
    this.mysqlConnection = mysqlConnection;
  }

  query(query: string, options: any) {
    var promise = new Promise((resolve: any, reject: any) => {
      this.mysqlConnection.query(query, options, (err: any, rows: any) => {
        if (!err) resolve(rows);
        else reject(err);
      });
    });
    return promise;
  }
};
