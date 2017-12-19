#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');

module.exports.fetchFragmentMatcherData = (url, file) => {
    return fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
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
    })
    .then(result => result.json())
    .then(result => {
        // here we're filtering out any type information unrelated to unions or interfaces
        const filteredData = result.data.__schema.types.filter(
            type => type.possibleTypes !== null
        );

        result.data.__schema.types = filteredData;

        fs.writeFile(
            file,
            JSON.stringify(result.data),
            (err) => { if (err) throw err; }
        );
    });
};
