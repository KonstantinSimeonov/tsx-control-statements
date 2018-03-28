const { FuseBox } = require('fuse-box');
const statements = require('./transformer').default;

const fuse = FuseBox.init({
    transformers: {
        before: [statements()]
    },
    homeDir: '.',
    output: 'dist/$name.js',
    useTypescriptCompiler: true,
    cache: false
});

fuse.bundle('test').instructions('> [Test.tsx]');

fuse.run();