const tsNodeOpts = require('../tsconfig.json');

require('ts-node').register(tsNodeOpts);

const { FuseBox, QuantumPlugin } = require('fuse-box');
const statements = require('../transformer.ts').default;
const { readdirSync } = require('fs');

for (const [homeDir, output] of [
    ['./compatibility-cases', 'tsc/$name.js'],
    ['./tsx-cases', `tsc/tsx-$name.js`]
]) {
    readdirSync(homeDir)
        .forEach(caseFile => {
            const [bundle] = caseFile.split('.');
            const fuse = FuseBox.init({
                homeDir,
                output,
                transformers: {
                    before: [statements()]
                },
                useTypescriptCompiler: true,
                cache: false,
                target: 'npm',
                globals: { default: '*' },
                plugins: [
                    QuantumPlugin({
                        bakeApiIntoBundle: bundle
                    })
                ]
            });
            fuse.bundle(bundle).instructions(`> [${caseFile}]`);
            fuse.run();
        });
}

