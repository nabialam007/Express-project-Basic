var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'sqluser',
    password: 'password',
    database: 'mysql'
});

con.connect(function(err){
    if(err) throw err;
    var sql = 'select * from Worker';
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        console.log(result);
    });
});