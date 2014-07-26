// daemonburrito.com utils
"use strict";
var _ = require('underscore');

// Convenient, traditional String.format(). Takes an Array instead of using
// arguments (faster).
var format_regex = /{(\d)}/g;
String.prototype.format = function (vals) {
	return this.replace(format_regex, function (match, p) {
		return vals[p];
	});
};

// For a friendly message that we forgot to set env vars.
function DBEnvNotSet () {
	this.message = 'Database not configured.';
	this.name = 'DBEnvNotSet';
}

// Make the connect string for pg. pg also uses this string as a key in its
// table of connections.
var make_pg_constring = _.memoize(function (user, pass, host, db) {
	return 'postgres://{0}:{1}@{2}/{3}'.format(arguments);
});

// Make a string suitable for an IN query.
// Note: the underscore docs disagree with the source. `_memoize` uses the whole `arguments`
// pseudo-array to make keys, not just the first one.
var make_placeholder_string = _.memoize(function (arr) {
	return arr.map(function (v, i) {
		return '$' + (i + 1);
	}).join(',');
});

// db connection
var db = function (fn) {
	var pg = require('pg'),
	pg_user = process.env.BLOG_PG_USER || false,
	pg_pass = process.env.BLOG_PG_PASS || false,
	pg_host = process.env.BLOG_PG_HOST || 'localhost',
	pg_db = process.env.BLOG_PG_DB || false;

	if (!pg_user || !pg_pass || !pg_db) {
		throw new DBEnvNotSet();
	}

	pg.connect(make_pg_constring(pg_user, pg_pass, pg_host, pg_db), fn);
};

var title_regex = /^#\s([^\n\r]+)/
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
		md_regex = /(md|mkd)$/,
		all_files = [],
		new_paths = [];

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
						console.log('New file: ' + filename);
						fs.readFile(filename, {encoding: 'utf-8'}, function (err, data) {
							insert_post_file(data, filename);
						});
					});
				}
				else {
					// we have to compare
					new_paths = [];
					result.rows.forEach(function (post) {
						//console.log('row.path: ' + post.path);
						if (all_files.indexOf(post.path) === -1) {
							new_paths.push(post.path);
						}
					});
					//console.log(existing_paths);

					new_paths.forEach(function (fp) {
						console.log('New file: ' + fp);
						fs.readFile(fp, {encoding: 'utf-8'}, function (err, data) {
							insert_post_file(data, fp);
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
				if (md_regex.test(file)){
					all_files.push(_path.join(path, file));
				}
			});

			paths.pop();

			if (paths.length === 0) {
				compare_posts();
			}
		});
	});
};


module.exports = {
	db: db,
	make_pg_constring: make_pg_constring,
	refresh_posts: refresh_posts
}
