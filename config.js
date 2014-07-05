var path = require('path');

module.exports = {
	title: "Scott Drake's Blog",
	byline: "The adventures of a Developer Philosopher",
	post_paths: [path.join(__dirname, 'md')],
	post: false
};

console.log(module.exports.posts_path);
