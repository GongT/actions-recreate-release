const { parse, stringify } = require('yaml');
const { resolve } = require('path');
const { readJsonSync, readFileSync, writeFileSync } = require('fs-extra');

const template = readJsonSync(resolve(__dirname, 'src/action.json'));
const srcData = parse(readFileSync(resolve(__dirname, 'node_modules/create-release/action.yml'), 'utf8'));

template.inputs = srcData.inputs;
template.outputs = srcData.outputs;

writeFileSync(resolve(__dirname, 'action.yaml'), stringify(template, { indent: 2 }));
