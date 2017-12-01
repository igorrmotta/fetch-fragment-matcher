#!/usr/bin/env node

const processArgs = require('./processArgs');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

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

fetch(`${ENDPOINT_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        query: `
        {
          __schema {
            types {
              kind
              name
              possibleTypes {
                name
              }
            }
          }
        }
      `,
    }),
}).then(result => result.json()).then(result => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter(
        type => type.possibleTypes !== null
    );

    result.data.__schema.types = filteredData;

    fs.writeFile(
        `${OUTPUT_FOLDER}/fragmentTypes.json`,
        JSON.stringify(result.data),
        (err) => {
            if (err) {
                console.error('Error writing fragmentTypes file', err);
            } else {
                console.log('Fragment types successfully extracted!');
            }
        });
});
