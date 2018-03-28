# tsx-control-statements

Typescript compiler plugin - kind of a port of https://www.npmjs.com/package/babel-plugin-jsx-control-statements for typescript. Intended to allow migrating from babel to TSC without the need to migrate away from control statements.

## Somewhat implemented components:
- If
- For
- Choose/When/Otherwise

## Usage with [fuse-box](https://github.com/fuse-box/fuse-box)

```js
const FuseBox = require('fuse-box');
const jsxControlStatements = require('./transformer');
const fuse = FuseBox.init({
    transformers: {
        before: [jsxControlStatements()]
    }
});
```

## Usage with typescript compiler cli
```shell
$ ./node_modules/.bin/tsc --all | grep plugins
--plugins                                          List of language service plugins.
```
Looks like `tsc` cli has `--plugins` option. Might work, haven't tried.

## Usage with webpack
Typescript loaders should have some kind of option for this, haven't researched.
