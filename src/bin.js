#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');
const path = require('path');
const { fetchFragmentMatcherData } = require('./index');

const argsOptions = {
    endpoint: {
        description: 'Specify the /graphql endpoint that should be used',
        type: 'string',
        alias: 'e'
    },
    output: {
        description: 'Specify the output path where the schema will be created',
        type: 'string',
        alias: 'o'
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
    throw `Please, specify --output or --o`;
}

const OUTPUT_FOLDER = path.resolve(processArgs.output);
const ENDPOINT_URL = processArgs.endpoint;

if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER);
}

fetchFragmentMatcherData(ENDPOINT_URL, `${OUTPUT_FOLDER}/fragmentTypes.json`)
