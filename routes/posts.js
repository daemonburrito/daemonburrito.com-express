var express = require('express'),
	router = express.Router(),
	fs = require('fs'),
	merge = require('merge'),
	marked = require('marked'),
	
	// for the moment, one hard-wired post
	esformatter_post_id = 'es_formatter';

router.param('post_id', function (req, res, next, post_id) {
	if (post_id === esformatter_post_id) {
		req.post_id = post_id
	}
	else {
		req.post_id = false;
	}

	next();
});

router.get('/:post_id', function (req, res, next) {
	if (req.post_id) {
		var md_text,
			context = merge(req.config, req);

		fs.readFile('md/esformatter.mkd', function (err, data) {
			md_text = data.toString();
			marked.setOptions({
				highlight: function (text) {
					return require('highlight.js').highlightAuto(text).value;
				}
			});
			marked(md_text, function (o, text) {
				context.post = text;
				res.render('index', context);
			});
		});
	}
	else {
		res.status(404);
		next();
	}
});

module.exports = router;
