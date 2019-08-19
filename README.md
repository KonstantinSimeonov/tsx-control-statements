# tsx-control-statements

[![Build Status](https://travis-ci.org/KonstantinSimeonov/tsx-control-statements.svg?branch=master)](https://travis-ci.org/KonstantinSimeonov/tsx-control-statements) [![Coverage Status](https://coveralls.io/repos/github/KonstantinSimeonov/tsx-control-statements/badge.svg?branch=master)](https://coveralls.io/github/KonstantinSimeonov/tsx-control-statements?branch=master) [![Gitter chat](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/tsx-control-statements/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![NPM](https://nodei.co/npm/tsx-control-statements.png)](https://npmjs.org/package/tsx-control-statements)

Basically [jsx-control-statements](https://www.npmjs.com/package/babel-plugin-jsx-control-statements), but for the typescript compiler toolchain. **Works for both javascript and typescript.**

| Typescript version | Build status           |
|:------------------:|:-----------------------|
| 2.4.x              | tests _passing_        |
| 2.5.x              | tests _passing_        |
| 2.6.x              | tests _passing_        |
| 2.7.x              | tests _passing_        |
| 2.8.x              | tests _passing_        |
| 2.9.x              | tests _passing_        |
| 3.0.x              | tests _passing_        |
| 3.1.x              | tests _passing_        |
| 3.2.x              | tests _passing_        |
| 3.3.x              | tests _passing_        |
| 3.4.x              | tests _passing_        |
| 3.5.x              | tests _passing_        |
| next               | tests _passing_        |

## It compiles `tsx`
- Control statements transpile to type correct typescript before type checking
  - Static linting tools cannot infer that some additional transpilation will occur and might complain (more on that [here](./test/tsx-cases/for.tsx))
- Test it: `yarn && yarn build && yarn test`
  - **Tests include behaviour compatibility tests with `jsx-control-statements` and tests whether tsx control statements render the same elements as components using plain ts in tsx.**

## It compiles javascript `jsx`
- Setting `"allowJs"` to `true` in `tsconfig.json` should do the trick.

## No dependence on any frontend framework
- The transformer works solely on the typescript ast and has nothing to do with React, React Native, Vue and so on. It just transforms jsx.

## Known limitations:
- **[js, ts]** I haven't found any way of integrating this into `create-react-app` scaffold project without ejecting the scripts and modifying them
- **[js, ts]** Various CLIs (`tsc`, `ts-register`, `ts-node`) feature no flag (that I know of) that allows for addition of custom transformers
- ~~**[ts]** The `isolatedModules` flag currently causes build errors for typescript files, since the typings currently live in a namespace~~
  - `isolatedModules` is supported since the module `tsx-control-statements/components` contains stub definitions which can be imported `import { For, If } from 'tsx-control-statements/components'`
- **[ts]** Cannot work with various "smart" plugins that instead of invoking the typescript compiler rather strip the types and handle the code as javascript. This includes tools like:
  - `@babel/preset-typescript`
  - `@babel/plugin-transform-typescript`

## What code is emitted?

### If - Ternary operators

```tsx
const SongRelatedThingy = ({ songList }: { songList: string[] }) => (
    <p>
        <If condition={songList.includes('Gery-Nikol - Im the Queen')}>
            good taste in music
        </If>
    </p>
)

// will transpile to
const SongRelatedThingy = ({ songList }: { songList: string[] }) => (
    <p>
        {
            songList.includes('Gery-Nikol - Im the Queen')
                ? 'good taste in music'
                : null
        }
    </p>
)
```

### With - Immediately invoked function expression

```tsx
const Sum = () => <p>
    <With a={3} b={5} c={6}>
        {a + b + c}
    </With>
</p>

// becomes
const Sum = () => <p>
    {((a, b, c) => a + b + c))()}
</p>
```

### For - `Array.from` calls
- Since `Array.from` can be provided with an iterator or an array-like as it's first parameter, it is much more flexible than `[].map`.
```tsx
const Names = ({ names }: { names: string[] }) => <ol>
    <For each="name" of={names} index="i">
        <li key={name}>
            {i}<strong>{name}</strong>
        </li>
    </For>
</ol>

// Will become
const Names = ({ names }: { names: string[] }) => <ol>
    {
        Array.from(names, (name, i) => (
            <li key={name}>
                {i}<strong>{name}</strong>
            </li>
        )
    }
</ol>
```

### Choose/When/Otherwise - Nested ternary operators.

```tsx
const RandomStuff = ({ str }: { str: string }) => <article>
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

// transpiles to
const RandomStuff = ({ str }: { str: string }) => <article>
    {
        str === 'ivan'
            ? 'ivancho'
            : (str === 'sarmi'
                ? React.createElement('h1', null, 'yum!')
                : 'im the queen da da da da')
    }
</article>
```

- `Otherwise` tag at the end is optional - if not provided, whenever no `When`'s condition did match, nothing will be rendered.

## Cookbook

- **[fuse-box](./examples/fuse-box)**
  - The unit test cases for this project are bundled with `fuse-box` ([link](./test/fuse.js)).
- **[webpack](./examples/webpack)**
- **[create-react-app](./examples/my-app)**

## Is it a drop-in replacement of `jsx-control-statements`?
- For javascript, yes.
- This should be the case for typescript too, but I haven't tested it too much.

- Importing the transformer in your build configs:
```ts
// commonjs
const transformer = require('tsx-control-statements').default();

// ts
import transformer from 'tsx-control-statements';
```

- Importing type definitions:

```ts
import { For, If, With, Choose, When, Otherwise } from 'tsx-control-statements/components';
```

## Reasons to not use any control statements for jsx:
- Hard to statically type
- Not part of the standard
- Not ordinary jsx elements
- Requires extra dependencies to use
- Many typescript tools do not support custom transformers in a convenient way
