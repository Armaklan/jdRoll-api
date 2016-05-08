var User = require('../model/user.model.js');

function UserProvider(connection) {
    this.all = function() {
        return connection.query("SELECT user.* FROM user JOIN last_action ON last_action.user_id = user.id WHERE user.profil >= 0 AND time > DATE_SUB(now(), INTERVAL 1 MONTH) ORDER BY user.username ASC", []).then(rowsMapper);
    };

    this.connected = function() {
        return connection.query("SELECT user.* FROM last_action JOIN user ON last_action.user_id = user.id WHERE time > DATE_SUB(now(), INTERVAL 5 MINUTE) ORDER BY user.username ASC", []).then(rowsMapper);
    };

    function rowsMapper(rows) {
        return rows.map(rowMapper);
    }

    function rowMapper(row) {
        return new User(row);
    }
}

module.exports = UserProvider;
