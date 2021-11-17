module.exports = {
    server_port: 3000,
    db_url: 'mongodb://127.0.0.1:27017/jcp',
    db_schemas: [{file:'./member_schema', collection:'study', schemaName:'StudySchema', modelName: 'StudyModel'}],
    kakao: {}
}