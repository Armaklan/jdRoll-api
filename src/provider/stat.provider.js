function StatProvider(connection) {
    this.byMonth = function() {
        return connection.query(`SELECT
            DATE_FORMAT(create_date, '%Y,%m,01') as dat,
            count(*) as cpt
            FROM posts
            WHERE posts.user_id IS NOT NULL
            GROUP BY dat;`);
    };

    this.byMonthFor = function(campagneId) {
        return connection.query(`SELECT
            DATE_FORMAT(create_date, '%Y,%m,01') as dat,
            count(*) as cpt
            FROM posts
            LEFT JOIN topics
                ON topics.id = posts.topic_id
            LEFT JOIN sections
                ON sections.id = topics.section_id
            LEFT JOIN campagne
                ON campagne.id = sections.campagne_id
            WHERE posts.user_id IS NOT NULL
            AND campagne.id = ?
            GROUP BY dat;`, [campagneId]);
    };

    this.byGame = function() {
        return connection.query(`SELECT
            campagne.name as game,
            count(*) as cpt
            FROM posts
            LEFT JOIN topics
                ON topics.id = posts.topic_id
            LEFT JOIN sections
                ON sections.id = topics.section_id
            LEFT JOIN campagne
                ON campagne.id = sections.campagne_id
            WHERE posts.user_id IS NOT NULL
            AND campagne.statut = 0
            OR campagne.statut IS NULL
            GROUP BY game;`);
    };

    this.byUserAndGame = function(userId) {
        return connection.query(`SELECT
            campagne.name as game,
            count(*) as cpt
            FROM posts
            LEFT JOIN topics
                ON topics.id = posts.topic_id
            LEFT JOIN sections
                ON sections.id = topics.section_id
            LEFT JOIN campagne
                ON campagne.id = sections.campagne_id
            WHERE posts.user_id = ?
            GROUP BY game;`, [userId]);
    };

    this.byUser = function(userId) {
        return connection.query(`SELECT
            DATE_FORMAT(create_date, '%Y-%m-%d') as dat,
            count(*) as cpt
            FROM posts
            WHERE user_id = ?
            GROUP BY dat`, [userId]);
    };
}

module.exports = StatProvider;
