var express = require('express'),
	router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', {
		title: req.config.title,
		byline: req.config.byline
	});
});

module.exports = router;
