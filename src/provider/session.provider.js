var PHPUnserialize = require('php-unserialize');

function SessionProvider(connection) {
    this.get = function(sessionId) {
        return connection.query("SELECT * FROM session WHERE session_id = ?", [sessionId]).then((rows) => {
            if(rows && rows.length > 0) {
                var data = rows[0].session_value;
                data = PHPUnserialize.unserializeSession(data);
                return data._sf2_attributes.user;
            }
            return undefined;
        });
    };
}

module.exports = SessionProvider;
