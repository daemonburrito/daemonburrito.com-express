"use strict";

var util = require('../util'),
	db = util.db,
	marked = require('marked');

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

var posts = {
	default_fields: ['posts_id', 'body', 'title', 'published_date'],

	get_latest: function (fn, err, count) {
		// Fetch the latest (published) post(s)
		var count = count || 1,
			query = {
				text: 'SELECT {0} FROM posts ORDER BY published_date DESC LIMIT $1'.format(
					[this.default_fields.join(',')]),
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
	}
};

module.exports = posts;
