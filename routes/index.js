var express = require('express'),
	router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	var context = req.config;
	res.render('index', context);
});

module.exports = router;
