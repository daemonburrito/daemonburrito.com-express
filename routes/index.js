var express = require('express'),
	router = express.Router(),
	posts = require('../models/posts');

/* GET home page. */
router.get('/', function (req, res) {
	var context = req.config,
		latest_posts = [];

	posts.get_latest(function (posts) {
		context.posts = posts;
		res.render('index', context);
	});
});

module.exports = router;
