const yargs = require('yargs');

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

const yargsUsage = yargs.usage('$0 <cmd> [args]')
    .options(argsOptions)
    .help();

if (process.env.NODE_ENV !== 'test') {
    yargsUsage.strict();
}

module.exports = yargsUsage.argv;