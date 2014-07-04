var express = require('express'),
	path = require('path'),
	favicon = require('static-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),

	// routes
	routes = require('./routes/index'),
	users = require('./routes/users'),
	posts = require('./routes/posts'),

	// postgres
	pg = require('pg'),
	pg_user = process.env.BLOG_PG_USER,
	pg_pass = process.env.BLOG_PG_PASS,
	pg_host = process.env.BLOG_PG_HOST || 'localhost',
	pg_db = process.env.BLOG_PG_DB,

	blog_util = require('./util.js'),
	app = express();

var constring = blog_util.make_pg_constring(pg_user, pg_pass, pg_host, pg_db);

pg.connect(constring, function (err, client, done) {
	if (err) {
		console.log(err);
	}

	client.query('select * from posts', function (err, result) {
		console.log(result);
		done();

		if (err) {
			console.log(err);
		}
	});
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// config
app.use(function (req, res, next) {
	req.config = require('./config');
	next();
});

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/posts', posts);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
