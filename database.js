var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'sqluser',
    password: 'password',
    database: 'mysql',
    port : 3306
});

con.connect(function(err){
    if(err) throw err;
    console.log('database connected..')
});

module.exports = con;