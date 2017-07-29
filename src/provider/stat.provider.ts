export default class StatProvider {

    sqlBuilder: any;
    connection: any;

    constructor(service: any) {
      this.sqlBuilder = service.sqlBuilder;
      this.connection = service.connection;
    }

    byMonth () {
        return this.connection.query(`SELECT
            DATE_FORMAT(create_date, '%Y,%m,01') as dat,
            count(*) as cpt
            FROM posts
            WHERE posts.user_id IS NOT NULL
            GROUP BY dat;`);
    }

    byMonthFor (campagneId) {
        var sql = this.baseQueryStat()
            .where('posts.user_id IS NOT NULL')
            .where('campagne.id = ?', campagneId)
            .group('dat')
            .toString();

        return this.connection.query(sql);
    }

    byGame () {
        var sql = this.baseQueryGameStat()
            .where('posts.user_id IS NOT NULL')
            .where(
                this.sqlBuilder.expr()
                    .and('campagne.statut = 0')
                    .or('campagne.statut IS NULL')
            )
            .group('game')
            .toString();

        return this.connection.query(sql);
    }

    byUserAndGame (userId, beginDate) {
        var query = this.baseQueryGameStat()
            .where('posts.user_id = ?', userId);
        query = beginDate ? query.where('create_date > ?', beginDate) : query;
        query = query.group('game');
        return this.connection.query(query.toString());
    }

    byUser (userId, beginDate) {
        var query = this.sqlBuilder.select()
            .field('DATE_FORMAT(create_date, \'%Y-%m-%d\')', 'dat')
            .field('count(*)', 'cpt')
            .from('posts')
            .where('user_id = ?', userId);
        query = beginDate ? query.where('create_date > ?', beginDate) : query;
        query = query.group('dat');
        return this.connection.query(query.toString());
    }

    baseQueryStat () {
        return this.addFromClause(this.sqlBuilder
                             .select()
                             .field('DATE_FORMAT(create_date, \'%Y,%m,01\')', 'dat')
                             .field('count(*)', 'cpt'));
    }

    baseQueryGameStat() {
        return this.addFromClause(this.sqlBuilder.select()
                             .field('campagne.name', 'game')
                             .field('count(*)', 'cpt'));
    }

    addFromClause(query) {
        return query
            .from('posts')
            .left_join('topics', null, "topics.id = posts.topic_id")
            .left_join('sections', null, "sections.id = topics.section_id")
            .left_join('campagne', null, "campagne.id = sections.campagne_id");
    }
};
