'use strict';

var vendor = require('./vendor.js');
require('fs');
require('constants');
require('stream');
var util = require('util');
require('assert');
require('path');
require('console');
require('os');
require('child_process');
require('events');
require('buffer');
require('http');
require('url');
require('https');
require('zlib');
require('net');
require('tls');

const isGithubCI = !!process.env.GITHUB_ACTIONS;
function requireEnvironment(name) {
    name = name.toUpperCase();
    return process.env[name] || die('missing required arguments: %s', name);
}
function getEnvironment(name) {
    name = name.toUpperCase();
    return process.env[name] || '';
}
function requireInput(name) {
    return vendor.core.getInput(name, { required: true });
}
function die(message, ...args) {
    const msg = util.format(message, ...args);
    console.error(msg);
    if (isGithubCI) {
        vendor.core.setFailed(msg);
    }
    process.exit(1);
}
function collapse(name, fn) {
    if (isGithubCI) {
        return vendor.core.group(name, fn);
    }
    else {
        return fn();
    }
}
function ciDebug(message, ...args) {
    if (isGithubCI) {
        const msg = util.format(message, ...args);
        vendor.core.debug(msg);
    }
}
function logError(message, ...args) {
    const msg = util.format(message, ...args);
    vendor.error_1(msg);
    if (isGithubCI) {
        vendor.core.error(msg);
    }
}
function logDebug(message, ...args) {
    const msg = util.format(message, ...args);
    vendor.info_1(msg);
}

async function deleteTag(name) {
    await runGit(['push', 'origin', ':refs/tags/' + name], false);
    await runGit(['tag', '-d', name], false);
}
async function testTagExists(name) {
    const r = await runGit(['tag', '-l', name], true);
    return r === name;
}
async function runGit(args, getOutput, die = true) {
    const oType = getOutput ? 'pipe' : 'inherit';
    logDebug(' + git %s', args.join(' '));
    const p = vendor.execa_1('git', args, {
        stdio: ['ignore', oType, oType],
        all: getOutput,
        stripFinalNewline: true,
        encoding: 'utf8',
        reject: false,
    });
    // console.log(p);
    const result = await p;
    let e;
    if (result instanceof Error) {
        e = result;
    }
    else if (result.signal) {
        e = new Error('command killed by signal ' + result.signal);
    }
    else if (result.exitCode !== 0) {
        e = new Error('command exit with code ' + result.exitCode);
    }
    if (e) {
        logError('Error run [%s]: %s', p.spawnargs.join(' '), e.message);
        if (die) {
            throw e;
        }
        else {
            return undefined;
        }
    }
    return result.all;
}

const api = new vendor.Octokit({
    auth: process.env.GITHUB_TOKEN || die('missing required arguments: GITHUB_TOKEN'),
    baseUrl: process.env.GITHUB_API_URL || undefined,
    log: { debug: ciDebug, info: vendor.info_1, warn: vendor.warn_1, error: vendor.error_1 },
});
const req = {
    owner: '',
    repo: '',
};
function setCurrentRepo(repoName) {
    const [owner, repo] = repoName.split('/');
    if (!owner || !repo) {
        die('invalid repo name: %s', repoName);
    }
    req.owner = owner;
    req.repo = repo;
}
async function getReleaseByLabel(label) {
    const result = await api.repos
        .getReleaseByTag({
        ...req,
        tag: label,
    })
        .catch((e) => e);
    if (result.status !== 200) {
        logDebug('getReleaseByLabel: http status %s', result.status);
        return undefined;
    }
    return result.data;
}
async function getReleaseByReleaseName(name) {
    const list = await api.repos
        .listReleases({
        ...req,
        page: 1,
        per_page: 99,
    })
        .catch((e) => e);
    if (list.status !== 200) {
        logDebug('getReleaseByReleaseName: http status %s', list.status);
        return undefined;
    }
    const found = list.data.find((item) => {
        return item.name === name;
    });
    return found;
}
async function deleteRelease(id) {
    await api.repos.deleteRelease({
        ...req,
        release_id: id,
    });
}

async function main() {
    const TAG_NAME = requireInput('tag_name');
    const RELEASE_NAME = requireInput('release_name');
    const GITHUB_REPOSITORY = requireEnvironment('github_repository');
    const GITHUB_WORKSPACE = getEnvironment('github_workspace');
    if (GITHUB_WORKSPACE && (await vendor.lib.pathExists(GITHUB_WORKSPACE + '/.git'))) {
        process.chdir(GITHUB_WORKSPACE);
    }
    else if (await vendor.lib.pathExists('.git')) ;
    else {
        die('.git did not exists in current and GITHUB_WORKSPACE directory');
    }
    logDebug('Working Directory: %s', process.cwd());
    setCurrentRepo(GITHUB_REPOSITORY);
    if (await testTagExists(TAG_NAME)) {
        logDebug('git tag "%s" exists.', TAG_NAME);
        await deleteTag(TAG_NAME);
    }
    else {
        logDebug('git tag "%s" did not exists.', TAG_NAME);
    }
    let targetRelease = await getReleaseByLabel(TAG_NAME);
    if (!targetRelease) {
        logDebug('No release with tag "%s". Try get by title "%s".', TAG_NAME, RELEASE_NAME);
        targetRelease = await getReleaseByReleaseName(RELEASE_NAME);
        if (!targetRelease) {
            logDebug('No release with title "%s". Nothing to do.', RELEASE_NAME);
            return;
        }
    }
    logDebug('Delete release with id "%s".', targetRelease.id);
    await deleteRelease(targetRelease.id);
}
collapse('Delete Release', main)
    .catch((e) => {
    die('Main Thrown: %s', e.stack || e.message || 'no message');
})
    .then(async () => {
    logDebug('Run github actions: create-release');
    return Promise.resolve().then(function () { return require('./vendor.js'); }).then(function (n) { return n.createRelease; });
})
    .then((run) => {
    return run.default();
})
    .catch((e) => {
    die('failed run create-release\n', e.stack || e.message);
});
