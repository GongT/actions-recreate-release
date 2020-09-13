import execa from 'execa';
import { logDebug, logError } from './fn';

export async function deleteTag(name: string) {
	await runGit(['push', 'origin', ':refs/tags/' + name], false);
	await runGit(['tag', '-d', name], false);
}
export async function testTagExists(name: string) {
	const r = await runGit(['tag', '-l', name], true);
	return r === name;
}

async function runGit(args: string[], getOutput: boolean, die: boolean = true): Promise<string | undefined> {
	const oType = getOutput ? 'pipe' : 'inherit';
	logDebug(' + git %s', args.join(' '));

	const p = execa('git', args, {
		stdio: ['ignore', oType, oType],
		all: getOutput,
		stripFinalNewline: true,
		encoding: 'utf8',
		reject: false,
	});
	// console.log(p);

	const result: execa.ExecaReturnValue<string> | Error = await p;

	let e: Error | undefined;
	if (result instanceof Error) {
		e = result;
	} else if (result.signal) {
		e = new Error('command killed by signal ' + result.signal);
	} else if (result.exitCode !== 0) {
		e = new Error('command exit with code ' + result.exitCode);
	}
	if (e) {
		logError('Error run [%s]: %s', p.spawnargs.join(' '), e.message);
		if (die) {
			throw e;
		} else {
			return undefined;
		}
	}

	return result.all!;
}
