var express = require('express');
var router = express.Router();

router.param('post_id', function (req, res, next, post_id) {
	req.post_id = post_id;
	next();
});

router.get('/:post_id', function (req, res) {
	res.render('post', {
		title: "Scott's blog",
		id: req.post_id
	});
});

module.exports = router;
