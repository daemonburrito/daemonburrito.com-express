// daemonburrito.com utils
"use strict";

// Convenient, traditional String.format(). Takes an Array instead of using
// arguments (faster).
var format_regex = /{(\d)}/g;
String.prototype.format = function (vals) {
	return this.replace(format_regex, function (match, p) {
		return vals[p];
	});
};


// Make the connect string for pg. pg also uses this string as a key in its
// table of connections.
var make_pg_constring = function (user, pass, host, db) {
	return 'postgres://{0}:{1}@{2}/{3}'.format(arguments);
}

// Make a string suitable for an IN query.
var make_placeholder_string = function (arr) {
	 return arr.map(function (v, i) {
		return '$' + (i + 1);
	}).join(',');
};

// db connection
var db = function (fn) {
	var pg = require('pg'),
	pg_user = process.env.BLOG_PG_USER,
	pg_pass = process.env.BLOG_PG_PASS,
	pg_host = process.env.BLOG_PG_HOST || 'localhost',
	pg_db = process.env.BLOG_PG_DB,

	constring = make_pg_constring(pg_user, pg_pass, pg_host, pg_db);

	pg.connect(constring, fn);
};

var title_regex = /^#\s([^\n]+)/
var insert_post_file = function (s, filename) {
	var r = title_regex.exec(s),
		title = r[1];

	db(function (err, client, done) {
		var query = 'INSERT INTO posts (title, body, path) VALUES ($1, $2, $3);';
		client.query(query, [title, s, filename], function (err, result) {
			done();
			if (err) {
				console.log(err);
			}
		});
	});
};


// Refresh posts
//
// Look in the md directory and create or update posts in the db.
var refresh_posts = function () {
	// get a list of md files in the configured path
	var fs = require('fs'),
		_path = require('path'),
		fs = require('fs'),
		paths = Object.create(require('./config').post_paths),
		all_files = [];

	var compare_posts = function () {
		var query = 'SELECT title, body, path FROM posts ' +
					'WHERE path IN (' + make_placeholder_string(all_files) + ');'

		db(function (err, client, done) {
			// query for posts.path IN all_files
			client.query(query, all_files, function (err, result) {
				done();
				if (err) {
					console.log(err);
				}

				if (result.rows.length === 0) {
					// all are new
					all_files.forEach(function (filename) {
						fs.readFile(filename, {encoding: 'utf-8'}, function (err, data) {
							insert_post_file(data, filename);
						});
					});
				}
			});
		});

	};

	paths.forEach(function (path) {
		var files_in_path = [];

		fs.readdir(path, function (err, files) {
			if (err) {
				console.log(err);
			}

			if (files) {
				files_in_path = files
			}

			files_in_path.forEach(function (file) {
				all_files.push(_path.join(path, file));
			});

			paths.pop();

			if (paths.length === 0) {
				compare_posts();
			}
		});
	});
};


module.exports = {
	make_pg_constring: make_pg_constring,
	refresh_posts: refresh_posts
}
