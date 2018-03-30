# tsx-control-statements

Typescript compiler plugin - kind of a port of https://www.npmjs.com/package/babel-plugin-jsx-control-statements for typescript. Intended to allow migrating from babel to TSC without the need to migrate away from control statements.

## Implemented stuff
- `With` - generates iifes
- `For` - generates `.map` calls
- `If` - generates ternary jsx expressions
- `Choose`/`When`/`Otherwise` - generates switchs-case-like thingies

## Do `.tsx` files compile successfuly?
- Yup, control statements transpile to type correct typescript before type checking
- Note: editors like visual studio code cannot infer that some additional transpilation will occur and will complain
    - You can check out a workaround [here](./test/tsx-cases/for.tsx)
- Test it: `yarn && yarn build && cd test && yarn && yarn build && yarn test`
    - This monstroys command will compile and run the tests, some of which will compile the files in `tests/tsx-cases`, which are typescript files with jsx control statements used in them.
- Typings: `index.ts`

## What typescript/javascript code is emitted?
```shell
 # build the transformer
yarn && yarn build
 # build the test cases
cd test && yarn && yarn build

# see input jsx and output javascript for the "For" statement
cat compatibility-cases/for.jsx
cat tsc/for.js

# see input tsx and output js for the "If" statement
cat tsx-cases/if.tsx
cat tsc/tsx-if.js
```

## Usage with [fuse-box](https://github.com/fuse-box/fuse-box)

```js
const FuseBox = require('fuse-box');
const jsxControlStatements = require('./transformer');
const fuse = FuseBox.init({
    transformers: {
        before: [jsxControlStatements()]
    },
    ...otherOptions
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

## Can I switch from `babel` + `jsx-control-statements` to `tsc` + `tsx-control-statements`?
- Should be a drop-in replacement, will try it for a bigger project in a few days.

## What if I want to use this right nao?
- This package is still not on npm, but it will probably be in a short while.

## What if I want to use this right nao real much?
- I seriously doubt that.
```shell
man git submodule # optional
git submodule add git@github.com:KonstantinSimeonov/tsx-control-statements.git
```
