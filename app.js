const express = require('express');
var app = express();
var bodyParser = require('body-parser')


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }))

var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'admin'
});

var username
con.connect();

app.get('/', (req, res) => {
    res.render('first_page');
})
app.get('/admin', (req, res) => {
    res.render('login');
})
app.get('/header', (req, res) => {
    res.render('header');
})
app.get('/user', (req, res) => {
    res.render('login_1');
})
app.get('/add_task', (req, res) => {
    res.render('admin_task');
})

app.get('/user_signup', (req, res) => {
    res.render('add_user');
})
app.get('/show_task', (req, res) => {
    res.render('show_task');
})

app.get('/signup', (req, res) => {
    res.render('add_admin');
})

// Add admin 

app.post('/add_admin', (req, res) => {

    var query = "INSERT INTO admin_signup(name, email, password)values('" + req.body.name + "', '" + req.body.email + "', '" + req.body.password + "')";

    con.query(query, function (error, result) {
        if (error) throw error;
        res.redirect('/admin');
    });
})

// add user
app.post('/add_user', (req, res) => {
    var query = "INSERT INTO user_signup(name, email, password,city,phoneno)values('" + req.body.name + "', '" + req.body.email + "', '" + req.body.password + "','" + req.body.city + "','" + req.body.phoneno + "')";

    con.query(query, function (error, result) {
        if (error) throw error;
        res.redirect('/header');
    });
});

// login page for admin
app.post('/admin', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    var query = "SELECT * FROM admin_signup WHERE email = ? AND password = ?";

    con.query(query, [email, password], (err, result) => {
        if (err) throw err;
        res.redirect('/header');
    });
});


// login page for user
app.post('/user', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var query = "SELECT * FROM user_signup WHERE email = ? AND password = ?";

    con.query(query, [email, password], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            username = result[0].name;
            res.redirect('/totaltask');
        } else {
            res.send("Invalid email or password!");
        }
    });
});

// add task

app.post('/add_task', (req, res) => {
    var name = req.body.name;
    var task = req.body.task;

    var query = "INSERT INTO task_user (name,task) VALUES (?,?)";

    con.query(query, [name, task], (err, result) => {
        if (err) throw err;
        res.redirect('/add_task');
    });
});

// view user 

app.get('/viewuser', function (req, res) {
    var select = "select * from user_signup"
    con.query(select, function (error, result) {
        if (error) throw error;
        res.render('view_user', { result })
    })
})

// view task

app.get('/viewtask', function (req, res) {
    var select = "select * from task_user"
    con.query(select, function (error, result) {
        if (error) throw error;
        res.render('view_task', { result })
    })
})


// total task

// app.get('/totaltask', function (req, res) {
//     var select = "select * from task_user";
//     con.query(select, function (error, result) {
//         if (error) throw error;
//         res.render('totaltask', { result });
//     });
// })

app.get('/totaltask', (req, res) => {
    var name = username; 
    var query = "SELECT * FROM task_user WHERE name = ?";

    con.query(query, [name], (err, result) => {
        if (err) throw err;
        res.render('totaltask', { result }); 
    });
});


app.get('/pending', function (req, res) {
    var name = username; 
    var select = "select * from task_user where status=0 and name=?";
    con.query(select,[name], function (error, result) {
        if (error) throw error;
        res.render('pendingtask', { result });
    });
})

app.get('/pending/:id', function (req, res) {
    var id = req.params.id;
    var sel = "select * from task_user where id=" + id;
    con.query(sel, function (error, result) {
        if (error) throw error;
        res.render('pendingtask', { result })
    })
})

app.post('/pending/:id', function (req, res) {
    var id = req.params.id;
    var status = req.body.status;

    var update_query = "update task_user set status = '" + status + "' where id=" + id;
    con.query(update_query, function (error, result) {
        if (error) throw error;
        res.redirect('/pending');
    });

})


app.get('/running', function (req, res) {
    var name = username; 
    var select = "select * from task_user where status=1 and name=?";
    con.query(select,[name], function (error, result) {
        if (error) throw error;
        res.render('running', { result });
    });
})

app.get('/running/:id', function (req, res) {
    var id = req.params.id;
    var sel = "select * from task_user where id=" + id;
    con.query(sel, function (error, result) {
        if (error) throw error;
        res.render('running', { result })
    })
})

app.post('/running/:id', function (req, res) {
    var id = req.params.id;
    var status = req.body.status;

    var update_query = "update task_user set status = '" + status + "' where id=" + id;
    con.query(update_query, function (error, result) {
        if (error) throw error;
        res.redirect('/running');
    });
})

app.get('/complete', function (req, res) {
    var name = username; 
    var select = "select * from task_user where status=2 and name=?";
    con.query(select,[name], function (error, result) {
        if (error) throw error;
        res.render('complete', { result });
    });
})

app.get('/complete/:id', function (req, res) {
    var id = req.params.id;
    var sel = "select * from task_user where id=" + id;
    con.query(sel, function (error, result) {
        if (error) throw error;
        res.render('complete', { result })
    })
})

app.post('/complete/:id', function (req, res) {
    var id = req.params.id;
    var status = req.body.status;

    var update_query = "update task_user set status = '" + status + "' where id=" + id;
    con.query(update_query, function (error, result) {
        if (error) throw error;
        res.redirect('/complete');
    });
})
// Decline
app.get('/Decline', function (req, res) {
    var name = username; 
    var select = "select * from task_user where status=3 and name=?";
    con.query(select,[name], function (error, result) {
        if (error) throw error;
        res.render('Decline', { result });
    });
})

app.get('/Decline/:id', function (req, res) {
    var id = req.params.id;
    var sel = "select * from task_user where id=" + id;
    con.query(sel, function (error, result) {
        if (error) throw error;
        res.render('Decline', { result })
    })
})

app.post('/Decline/:id', function (req, res) {
    var id = req.params.id;
    var status = req.body.status;

    var update_query = "update task_user set status = '" + status + "' where id=" + id;
    con.query(update_query, function (error, result) {
        if (error) throw error;
        res.redirect('/Decline');
    });
})

app.listen(3001)