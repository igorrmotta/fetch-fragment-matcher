#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');
const path = require('path');
const process = require('process');
const { fetchFragmentMatcherData, getFragmentMatcherData } = require('./index');
const { createDirRecursively } = require('./utils');

const argsOptions = {
    endpoint: {
        description: 'Specify the /graphql endpoint that should be used',
        type: 'string',
        alias: 'e'
    },
    directory: {
        description: 'Specify the directory of type definitions',
        type: 'string',
        alias: 'd'
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

if (!processArgs.endpoint && !processArgs.directory) {
    throw `Please, specify --endpoint or --e or --directory or --d`;
}

if (!!processArgs.endpoint && !!processArgs.directory) {
    throw `Please, specify either endpoint or directory`;
}

if (!processArgs['output'] && !processArgs['output-file']) {
    throw `Please, specify --output or --output-file`;
}

const OUTPUT_FILE = path.resolve(
    processArgs['output-file']
        ? processArgs['output-file']
        : `${processArgs['output']}/fragmentTypes.json`
);
createDirRecursively(path.dirname(OUTPUT_FILE));

if (!!processArgs.endpoint) {
    // using endpoint
    const ENDPOINT_URL = processArgs.endpoint;
    fetchFragmentMatcherData(ENDPOINT_URL, OUTPUT_FILE)
        .then(() => { console.log('Fragment types successfully extracted!'); })
        .catch((err) => { console.error('Error writing fragmentTypes file', err); });
}

if (!!processArgs.directory) {
    const DIRECTORY = processArgs.directory;
    getFragmentMatcherData(DIRECTORY, OUTPUT_FILE)
        .then(() => { console.log('Fragment types successfully extracted!'); })
        .catch((err) => { console.error('Error writing fragmentTypes file', err); });
}