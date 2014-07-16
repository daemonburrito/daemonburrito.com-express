"use strict";

var util = require('../util'),
	db = util.db;

var posts = {
	default_fields: ['posts_id', 'body', 'title', 'published_date'],

	get_latest: function (fn) {
		// Fetch the latest (published) post
		var query = {
			text: 'SELECT {0} FROM posts ORDER BY published_date DESC LIMIT 1'.format(
				[this.default_fields.join(',')]),
			name: 'latest-post'
		};

		db(function (err, client, done) {
			client.query(query, function (err, result) {
				done();
				if (!err) {
					fn(result.rows[0]);
				}
				else {
					console.error(err);
				}
			});
		});
	}
};

module.exports = posts;
