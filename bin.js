#!/usr/bin/env node


if (process.env.CI) {
	require('./dist/index.js');
} else {
	require('./lib/index.js');
}
