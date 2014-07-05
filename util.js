var format_regex = /{(\d)}/g;

String.prototype.format = function (vals) {
	return this.replace(format_regex, function (match, p) {
		return vals[p];
	});
};

var make_pg_constring = function (user, pass, host, db) {
	return 'postgres://{0}:{1}@{2}/{3}'.format(arguments);
}

module.exports = {
	make_pg_constring: make_pg_constring
}
