import { Octokit } from '@octokit/rest';
import { OctokitResponse, ReposListReleasesResponseData, ReposGetReleaseByTagResponseData } from '@octokit/types';
import { error, info, warn } from 'fancy-log';
import { ciDebug, die, logDebug } from './fn';

const api = new Octokit({
	auth: process.env.GITHUB_TOKEN || die('missing required arguments: GITHUB_TOKEN'),
	baseUrl: process.env.GITHUB_API_URL || undefined,
	log: { debug: ciDebug, info, warn, error },
});

const req = {
	owner: '',
	repo: '',
};

export function setCurrentRepo(repoName: string) {
	const [owner, repo] = repoName.split('/');
	if (!owner || !repo) {
		die('invalid repo name: %s', repoName);
	}
	req.owner = owner;
	req.repo = repo;
}

export async function getReleaseByLabel(label: string): Promise<ReposGetReleaseByTagResponseData | undefined> {
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

export async function getReleaseByReleaseName(name: string) {
	const list: OctokitResponse<ReposListReleasesResponseData> = await api.repos
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

export async function deleteRelease(id: number) {
	await api.repos.deleteRelease({
		...req,
		release_id: id,
	});
}
