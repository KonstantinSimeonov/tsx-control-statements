// use plain js, because this code won't get transpiled
const tsNode = require('ts-node');
const statements = require('tsx-control-statements').default;

const tsNodeOpts = {
    ...require('../tsconfig.json'),
    transformers: {
        before: [
            statements()
        ]
    }
};

tsNode.register(tsNodeOpts)
