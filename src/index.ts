import 'source-map-support/register';
import { pathExists } from 'fs-extra';
import { collapse, die, getEnvironment, logDebug, requireEnvironment, requireInput } from './inc/fn';
import { deleteTag, testTagExists } from './inc/git';
import { deleteRelease, getReleaseByLabel, getReleaseByReleaseName, setCurrentRepo } from './inc/request';
import execa from 'execa';

async function main() {
	const TAG_NAME = requireInput('tag_name');
	const RELEASE_NAME = requireInput('release_name');
	const GITHUB_REPOSITORY = requireEnvironment('github_repository');

	const GITHUB_WORKSPACE = getEnvironment('github_workspace');
	if (GITHUB_WORKSPACE && (await pathExists(GITHUB_WORKSPACE + '/.git'))) {
		process.chdir(GITHUB_WORKSPACE);
	} else if (await pathExists('.git')) {
		// pass
	} else {
		logDebug('cwd=%s', process.cwd());
		logDebug('GITHUB_WORKSPACE=%s', GITHUB_WORKSPACE);
		execa.sync('ls', ['-lAh'], { stdio: 'inherit' });
		die('.git did not exists in current and GITHUB_WORKSPACE directory');
	}
	logDebug('Working Directory: %s', process.cwd());

	setCurrentRepo(GITHUB_REPOSITORY);

	if (await testTagExists(TAG_NAME)) {
		logDebug('git tag "%s" exists.', TAG_NAME);
		await deleteTag(TAG_NAME);
	} else {
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
		return import('create-release/src/create-release.js');
	})
	.then((run) => {
		return run.default();
	})
	.catch((e) => {
		die('failed run create-release\n', e.stack || e.message);
	});
