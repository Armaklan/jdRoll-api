function StatHandler(app, statProvider) {
    app.get('/apiv2/stats/bymonth', function(req, res) {
        statProvider.byMonth().then((rows) => {
            res.send(rows);
        });
    });

    app.get('/apiv2/stats/bygame', function(req, res) {
        statProvider.byGame().then((rows) => {
            res.send(rows);
        });
    });
}

module.exports = StatHandler;
