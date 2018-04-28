#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');
const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { klawSync, writeFile } = require('./utils');

const introspectionQuery = `
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
`;

module.exports.fetchFragmentMatcherData = (url, file) => {
    console.info(`fetching ${url} and output ${file}`);
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: introspectionQuery
        }),
    })
        .then(result => result.json())
        .then(result => writeFile(result.data, file));
};

module.exports.getFragmentMatcherData = (path, file) => {
    console.info(`fetching ${path} and output ${file}`);
    return new Promise((resolve, reject) => {
        try {
            const files = klawSync(path, /\.(graphql|gql)$/);
            const typeDefs = files.map(filePath => fs.readFileSync(filePath, 'utf-8')).join('\n');
            const schema = makeExecutableSchema({ typeDefs });
            graphql({ schema: schema, source: introspectionQuery })
                .then(({ data, errors }) => {
                    writeFile(data, file);
                    resolve();
                })
                .catch((err) => { throw err; });
        } catch (err) {
            reject(err);
        }
    })
};