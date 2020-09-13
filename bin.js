#!/usr/bin/env node

require('source-map-support/register');

if (process.env.CI) {
	require('./dist.js');
} else {
	require('./lib/index.js');
}
