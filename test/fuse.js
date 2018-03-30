const { FuseBox, QuantumPlugin } = require('fuse-box');
const statements = require('../transformer').default;
const { readdirSync } = require('fs');

readdirSync('./compatibility-cases')
    .forEach(caseFile => {
        const [bundle] = caseFile.split('.');
        const fuse = FuseBox.init({
            transformers: {
                before: [statements()]
            },
            homeDir: './compatibility-cases',
            output: 'tsc/$name.js',
            useTypescriptCompiler: true,
            cache: false,
            target: 'npm',
            globals: { default: '*' },
            plugins: [
                QuantumPlugin({
                    containedAPI: true,
                    bakeApiIntoBundle: bundle
                })
            ]
        });
        fuse.bundle(bundle).instructions(`> [${caseFile}]`);
        fuse.run();
    });

readdirSync('./tsx-cases')
    .forEach(caseFile => {
        const [bundle] = caseFile.split('.');
        const fuse = FuseBox.init({
            transformers: {
                before: [statements()]
            },
            homeDir: './tsx-cases',
            output: `tsc/tsx-$name.js`,
            useTypescriptCompiler: true,
            cache: false,
            target: 'npm',
            globals: { default: '*' },
            plugins: [
                QuantumPlugin({
                    containedAPI: true,
                    bakeApiIntoBundle: bundle
                })
            ]
        });
        fuse.bundle(bundle).instructions(`> [${caseFile}]`);
        fuse.run();
    });