var express = require('express'),
	router = express.Router(),
	posts = require('../models/posts');

router.get('/:post_id', function (req, res, next) {
	var context = req.config;

	if (req.params.post_id) {
		posts.get(req.params.post_id, function (posts) {
			context.posts = posts;
			res.render('index', context);
		});
	}
	else {
		res.status(404);
		next();
	}
});

module.exports = router;
