# tsx-control-statements

Typescript compiler plugin - kind of a port of https://www.npmjs.com/package/babel-plugin-jsx-control-statements for typescript. Intended to allow migrating from babel to TSC without the need to migrate away from control statements.

## Do `.tsx` files compile successfuly?
- Yup, control statements transpile to type correct typescript before type checking
- Note: editors like visual studio code cannot infer that some additional transpilation will occur and will complain
    - You can check out a workaround [here](./test/tsx-cases/for.tsx)
- Test it: `yarn && yarn build && cd test && yarn && yarn build && yarn test`
    - This monstroys command will compile and run the tests, some of which will compile the files in `tests/tsx-cases`, which are typescript files with jsx control statements used in them.
- Typings: `index.ts`

## What typescript/javascript code is emitted?

### If
- Transpiles to ternary operators

```tsx
const SongRelatedThingy = ({ songList }: { songList: string[] }) => (
    <p>
        <If condition={songList.includes(`Gery-Nikol - I'm the Queen`)}>
            good taste in music
        </If>
    </p>
)

// will transpile to
const SongRelatedThingy = ({ songList }) => React.createElement(
    'p',
    null,
    songList.includes(`Gery-Nikol - I'm the Queen`) ? 'good taste in music' : null
)
```

### With
- Transpiles to immediately invoked function expression

```tsx
const Sum = () => (
    <p>
        <With a={3} b={5} c={6}>
            {a + b + c}
        </With>
    </p>
)

// becomes
const Sum = () => React.createElement(
    'p',
    null,
    ((a, b, c) => a + b + c)(3, 5, 6)
)
```

### For
- Generates `[].map` calls
```tsx
const Names = ({ names }: { names: string[] }) => (
    <ol>
        <For each="name" of={names} index="i">
            <li key={name}>{i}<strong>{name}</strong></li>
        </For>
    </ol>
)

// Will become

const Names = ({ names }) => React.createElement(
    'ol',
    null,
    names.map(
        (name, i) => React.createElement(
            'li',
            { key: name },
            i,
            React.createElement('strong', null, name)
        )
    )
)
```

### Choose/When/Otherwise
- Provides If/Else like conditional control. Currently transpiles to array of elements, the first of which will be renderd.
    - Note: this will be changed to nested ternary operators in the future.

```tsx
const RandomStuff = ({ str }: { str: string }) => (
    <article>
        <Choose>
            <When condition={str === 'ivan'}>
                ivancho
                </When>
            <When condition={str === 'sarmi'}>
                <h1>yum!</h1>
            </When>
            <Otherwise>
                im the queen da da da da
            </Otherwise>
        </Choose>
    </article>
)

// transpiles to
const RandomStuff = ({ str }) => React.createElement(
    'article',
    null,
    [
        str === 'ivan' ? 'ivancho' : null,
        str === 'sarmi' ? React.createElement('h1', null, 'yum!') : null,
        'im the queen da da da da'
    ].find(Boolean)
)
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
