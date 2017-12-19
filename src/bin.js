#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');
const path = require('path');
const process = require('process');
const { fetchFragmentMatcherData } = require('./index');

const argsOptions = {
    endpoint: {
        description: 'Specify the /graphql endpoint that should be used',
        type: 'string',
        alias: 'e'
    },
    output: {
        description: 'Specify the output dir where the schema fragmentTypes.json file will be created',
        type: 'string',
        alias: 'o'
    },
    'output-file': {
        description: 'Specify the output path where the schema will be created',
        type: 'string',
        alias: 'of'
    }
};

const yargsUsage = yargs
    .usage('$0 <cmd> [args]')
    .options(argsOptions)
    .help();

if (process.env.NODE_ENV !== 'test') {
    yargsUsage.strict();
}

const processArgs = yargsUsage.argv;

if (!processArgs.endpoint) {
    throw `Please, specify --endpoint or --e`;
}

if (!processArgs.output) {
    throw `Please, specify --output or --output-file`;
}

const ENDPOINT_URL = processArgs.endpoint;
const OUTPUT_FILE = path.resolve(
    processArgs['output-file']
        ? processArgs['output-file']
        : `${processArgs['output']}/fragmentTypes.json`
);

createDirRecursively(path.dirname(OUTPUT_FILE));

fetchFragmentMatcherData(ENDPOINT_URL, OUTPUT_FILE)
    .then(() => { console.log('Fragment types successfully extracted!'); })
    .catch((err) => { console.error('Error writing fragmentTypes file', err); });

function createDirRecursively(dir) {
    dir
        .split(path.sep)
        .reduce((currentPath, folder) => {
            currentPath += folder + path.sep;
            if (!fs.existsSync(currentPath)){
                fs.mkdirSync(currentPath);
            }
            return currentPath;
        }, '');
}
