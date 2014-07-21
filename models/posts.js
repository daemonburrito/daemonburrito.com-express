"use strict";

var util = require('../util'),
	db = util.db,
	marked = require('marked'),
	_ = require('underscore');

var md_to_html = function (md_text, fn, err) {
	marked(md_text, function (o, text) {
		fn(text);
	});
};

var posts_to_html = function (posts, fn, err) {
	var html_posts = [];

	posts.forEach(function (post) {
		html_posts.push(post);
		md_to_html(post.body, function (html) {
			post.body = html;
		});
		md_to_html(post.title, function (html) {
			post.title = html;
		});
	});

	fn(html_posts);
};

var default_fields = ['posts_id', 'body', 'title', 'published_date'];

var posts = {
	default_fields_str: _.memoize(function () {
		return default_fields.join(',');
	}),

	get_latest: function (fn, err, count) {
		// Fetch the latest (published) post(s)
		var count = Number(count) || 1,
			query = {
				text: 'SELECT {0} FROM posts ORDER BY published_date DESC LIMIT $1'.format(
					[this.default_fields_str()]),
				name: 'latest-post',
				values: [count]
			};

		db(function (err, client, done) {
			client.query(query, function (err, result) {
				done();
				if (!err) {
					posts_to_html(result.rows, function (posts) {
						fn(posts);
					})
				}
				else {
					console.error(err);
					fn(false, err);
				}
			});
		});
	},

	get: function (id, fn, err) {
		// Fetch one post by id
		var id = Number(id) || false,
			query = {
				text: 'SELECT {0} FROM posts WHERE posts_id=$1'.format(
					[this.default_fields_str()]),
				name: 'get-post',
				values: [id]
			};

		if (!id) {
			var err = 'Missing or invalid id.'
			console.error(err);
			fn(false, err);
			return
		}

		db(function (err, client, done) {
			client.query(query, function (err, result) {
				done();
				if (!err) {
					posts_to_html(result.rows, function (posts) {
						fn(posts);
					});
				}
				else {
					console.error(err);
					fn(false, err);
				}
			});
		});
	}
};

module.exports = posts;
