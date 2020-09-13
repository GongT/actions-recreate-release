import { error, info } from 'fancy-log';
import { format } from 'util';
import * as ci from '@actions/core';

const isGithubCI = !!process.env.GITHUB_ACTIONS;

export function requireEnvironment(name: string): string {
	name = name.toUpperCase();
	return process.env[name] || die('missing required arguments: %s', name);
}
export function getEnvironment(name: string): string {
	name = name.toUpperCase();
	return process.env[name] || '';
}

export function requireInput(name: string): string {
	return ci.getInput(name, { required: true });
}

export function die(message: string, ...args: any[]): never {
	const msg = format(message, ...args);
	console.error(msg);
	if (isGithubCI) {
		ci.setFailed(msg);
	}
	process.exit(1);
}

export function collapse<T>(name: string, fn: () => Promise<T>): Promise<T> {
	if (isGithubCI) {
		return ci.group(name, fn);
	} else {
		return fn();
	}
}

export function ciDebug(message: string, ...args: any[]) {
	if (isGithubCI) {
		const msg = format(message, ...args);
		ci.debug(msg);
	}
}
export function logError(message: string, ...args: any[]) {
	const msg = format(message, ...args);
	error(msg);
	if (isGithubCI) {
		ci.error(msg);
	}
}

export function logDebug(message: string, ...args: any[]) {
	const msg = format(message, ...args);
	info(msg);
}
