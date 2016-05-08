function User(data) {
    var that = this;

    _build(data);

    function _build(data) {
        that.id = data.id;
        that.username = data.username;
        that.profil = data.profil;
    }
}

module.exports = User;
