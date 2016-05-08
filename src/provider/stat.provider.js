function StatProvider(connection) {
    this.byMonth = function() {
        return connection.query(`SELECT
            DATE_FORMAT(create_date, '%Y,%m,01') as dat,
            count(*) as cpt
            FROM posts
            WHERE posts.user_id IS NOT NULL
            GROUP BY dat;`);
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
}

module.exports = StatProvider;
