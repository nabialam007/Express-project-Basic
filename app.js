const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('./database');
const hbs = require('hbs');
const port = 8080;
const app = express();

hbs.registerHelper('checked', function (value, test) {
    return value == test ? 'checked' : '';
});

hbs.registerHelper('selected', function(value, test) {
    //for mutiple value select
    for(var i in value){
        if(value[i] == test){
            return 'selected'
        }
    };
    //for single value select
    return value == test ? 'selected' : '';
});

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.render('home');
});

app.get('/addStudent', function(req, res){
    mysql.query(`select sequence from Student order by sequence desc limit 1`, function(err, result){
        if(err) throw err;
        if(result.length == 0){
            res.render('addStudent', {
                rollno : 'ABC001'
            });
        }else{
            res.render('addStudent',{
                rollno: 'ABC00'+Number(result[0].sequence+1)
            });
        };
    });
});

app.post('/add', function(req, res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var age = req.body.age;
    var gender = req.body.gender;
    var mathmark = req.body.mathmark;
    var englishmark = req.body.englmark;
    var computermark = req.body.compmark;
    var favsubject = JSON.stringify(req.body.selected);
    mysql.query('select sequence from Student order by sequence desc limit 1', function(err, result){
        var seq;
        if(result.length == 0){
            seq = 1;
        }else{
            seq = result[0].sequence+1;
        }
        var sql = 'INSERT INTO Student(sequence, rollno, fname, lname, age, gender, mathmark, englishmark, computermark, favsubject) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        mysql.query(sql, [seq, 'ABC00'+seq, fname, lname, age, gender, mathmark, englishmark, computermark, favsubject], function(err, results){
            if(err) throw err;
            res.redirect('/addStudent');
        });
    });
});

app.get('/displayAllStudent', function(req, res){
    var query = `select fname, lname, age, rollno, gender from Student`;
    mysql.query(query, function(err, result){
        if(err) throw err;
        if(result.length > 0){
            res.render('displayAllStudent', { msg1 : false, msg2 : true, data : result, Total : result.length});
        }else{
            res.render('displayAllStudent', { msg1 : true, msg2 : false, Total : result.length});
        }
    });
});

app.get('/displayStudent', function(req, res){
    var query = `select * from Student where rollno = ?`;
    mysql.query(query ,[req.query.RollNo], function(err, result){
        if(err) throw err;
        res.render('displayStudent',{
            data : result,
            favsub : JSON.parse(result[0].favsubject)
        });
    });
});

app.get('/editStudent', function(req, res){
    var query = `select * from Student where rollno = ?`
    mysql.query(query, [req.query.RollNo], function(err, result){
        if(err) throw err;
        res.render('editStudent', {
           data : result,
           favsub : JSON.parse(result[0].favsubject)
        });
    });
});

app.post('/update', function(req, res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var age = req.body.age;
    var gender = req.body.gender;
    var mathmark = req.body.mathmark;
    var englishmark = req.body.englmark;
    var computermark = req.body.compmark;
    var favsubject = JSON.stringify(req.body.selected);

    var query = `update Student set fname = ?, lname = ?, age = ?, gender = ?, mathmark = ?, englishmark = ?, computermark = ?, favsubject = ? where rollno = ?`    
    mysql.query(query, [fname, lname, age, gender, mathmark, englishmark, computermark, favsubject, req.query.RollNo], function(err, result){
        if(err) throw err;
        res.redirect('/displayAllStudent');
    })
})

app.get('/deleteStudent', function(req, res){
    var query = `select * from Student where rollno = ?`;
    mysql.query(query ,[req.query.RollNo], function(err, result){
        if(err) throw err;
        res.render('deleteStudent',{
            data : result,
            favsub : JSON.parse(result[0].favsubject),
            RollNo : result[0].rollno
        });
    });
});

app.get('/confirmDelele', function(req, res){
    var query = `delete from Student where rollno = ?`;
    mysql.query(query ,[req.query.RollNo], function(err, result){
        if(err) throw err;
        res.redirect('/displayAllStudent')
    });
})

app.post('/search', function(req, res){
    var query = `select * from Student where concat(fname, ' ', lname) = ? or rollno = ? or fname = ?`
    mysql.query(query, [req.body.search, req.body.search, req.body.search], function(err, result){
        if(err) throw err;
        if(result.length > 0){
            res.render('displayAllStudent', { msg1 : false, msg2 : true, data : result, Total : result.length});
        }else{
            res.render('displayAllStudent', { msg1 : true, msg2 : false, Total : result.length});
        }
    })
})

app.get('/reset', function(req, res){
    var query = `truncate table Student`;
    mysql.query(query, function(err, result){
        if(err) throw err;
        res.redirect('/');
    })
})

app.listen(port, function(err){
    if(err) throw err;
    console.log('server listen at port no ' + port);
});