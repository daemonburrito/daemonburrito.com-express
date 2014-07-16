#!/usr/bin/env node

var repl = require('repl');

var repl_server = repl.start({
	prompt: 'daemonburrito.com > '
});

repl_server.context.util = require('./util');
repl_server.context.app = require('./app');
