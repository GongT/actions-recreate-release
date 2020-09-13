import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { builtinModules } from 'module';
import { RollupOptions, Plugin } from 'rollup';

function setExternal(): Plugin {
	return {
		name: 'set external',
		resolveId(source) {
			if (builtinModules.includes(source)) {
				return { id: source, external: true };
			}
			return null;
		},
	};
}
export default <RollupOptions>{
	input: 'lib/index.js',
	output: {
		dir: 'dist',
		format: 'cjs',
		manualChunks(id) {
			if (id.includes('node_modules')) {
				return 'vendor';
			}
			return undefined;
		},
		chunkFileNames: '[name].js',
	},
	preserveEntrySignatures: false,
	plugins: [setExternal(), resolve(), commonjs(), json()],
};
