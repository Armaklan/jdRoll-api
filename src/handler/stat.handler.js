function StatHandler(app, statProvider) {
    app.get('/apiv2/stats/bymonth', function(req, res) {
        statProvider.byMonth().then((rows) => {
            res.send(rows);
        });
    });

    app.get('/apiv2/stats/bymonth/:id', function(req, res) {
        statProvider.byMonthFor(req.params.id).then((rows) => {
            res.send(rows);
        });
    });

    app.get('/apiv2/stats/bygame', function(req, res) {
        statProvider.byGame().then((rows) => {
            res.send(rows);
        });
    });

    app.get('/apiv2/stats/my/byday', function(req, res) {
        if(!req.phpSession) {
            return res.send([]);
        } else {
            statProvider.byUser(req.phpSession.id).then((rows) => {
                res.send(rows);
            });
        }
    });

    app.get('/apiv2/stats/my/bygame', function(req, res) {
        if(!req.phpSession) {
            return res.send([]);
        } else {
            statProvider.byUserAndGame(req.phpSession.id).then((rows) => {
                res.send(rows);
            });
        }
    });
}

module.exports = StatHandler;
