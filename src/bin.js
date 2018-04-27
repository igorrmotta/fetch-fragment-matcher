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

function createOutput(processArgs) {
    if (!processArgs['output'] && !processArgs['output-file']) {
        throw `Please, specify --output or --output-file`;
    }

    const OUTPUT_FILE = path.resolve(
        processArgs['output-file']
            ? processArgs['output-file']
            : `${processArgs['output']}/fragmentTypes.json`
    );
    createDirRecursively(path.dirname(OUTPUT_FILE));
}

yargs
    .command(
        'fetch-fragment-matcher',
        'fetch fragment matcher from /graphql server endpoint',
        {},
        (argv) => {
            createOutput(argv);

            if (!argv.endpoint) {
                throw `Please, specify --endpoint or --e`;
            }

            // using endpoint
            const ENDPOINT_URL = argv.endpoint;
            fetchFragmentMatcherData(ENDPOINT_URL, OUTPUT_FILE)
                .then(() => { console.log('Fragment types successfully extracted!'); })
                .catch((err) => { console.error('Error writing fragmentTypes file', err); });
        }
    )
    .command(
        'get-fragment-matcher',
        'get fragment matcher from local graphql type definitions',
        {},
        (argv) => {
            createOutput(argv);

            if (!argv.directory) {
                throw `Please, specify --directory or --d`;
            }

            // using endpoint
            const DIRECTORY = processArgs.directory;
            getFragmentMatcherData(DIRECTORY, OUTPUT_FILE)
                .then(() => { console.log('Fragment types successfully extracted!'); })
                .catch((err) => { console.error('Error writing fragmentTypes file', err); });
        }
    )
    .options(argsOptions)
    .help()
    .version()
    .strict()
    .argv;