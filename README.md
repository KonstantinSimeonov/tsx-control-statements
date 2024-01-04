# tsx-control-statements

[![CI](https://github.com/KonstantinSimeonov/tsx-control-statements/actions/workflows/ci.yml/badge.svg)](https://github.com/KonstantinSimeonov/tsx-control-statements/actions/workflows/ci.yml) [![Coverage Status](https://coveralls.io/repos/github/KonstantinSimeonov/tsx-control-statements/badge.svg?branch=master)](https://coveralls.io/github/KonstantinSimeonov/tsx-control-statements?branch=master)

[![NPM](https://nodei.co/npm/tsx-control-statements.png)](https://npmjs.org/package/tsx-control-statements)

Basically [jsx-control-statements](https://www.npmjs.com/package/babel-plugin-jsx-control-statements), but for the typescript compiler toolchain. **Works for both javascript and typescript.**

| Typescript version range | `tsx-control-statements` version           |
|:------------------------:|:-------------------------------------------|
| `2.4.x` - `3.3.x`        | `v3.3.x`                                   |
| `3.4.x` - `4.6.x`        | `v4.x`                                     |
| `4.9`                    | `v5.0`                                     |
| `5.x`                    | `>= v5.1`                                  |

## Drop-in replacement for jsx control statements
- No need to rewrite anything
- Compile control statements in typescript `.tsx` files
  - Control statements transpile to type-correct typescript before type checking
- Compile control statements in javascript `.js` and `.jsx` files
  - `"allowJs"` should be set to `true` in your typescript configuration
- Run the test suite: `npm i && npm run build && npm run test`. It includes:
  - Compatibility tests with `jsx-control-statements` (i.e. both produce the same output html)
  - Tests for correct transpilation
  - Tests for typechecking

## Zero dependencies apart from typescript
- Pick any typescript version equal to or above `2.4.x`
- Can be used with Vue, React or just plain jsx/tsx

## Known limitations:
- **[js, ts]** I haven't found any way of integrating this into `create-react-app` scaffold project without ejecting the scripts and modifying them
- **[js, ts]** Various CLIs (`tsc`, `ts-register`, `ts-node`) feature no flag (that I know of) that allows for addition of custom transformers
- ~~**[ts]** The `isolatedModules` flag currently causes build errors for typescript files, since the typings currently live in a namespace~~
  - `isolatedModules` is supported since the module `tsx-control-statements/components` contains stub definitions which can be imported `import { For, If } from 'tsx-control-statements/components'`
- **[ts]** Cannot work with various "smart" plugins that instead of invoking the typescript compiler rather strip the types and handle the code as javascript. This includes tools like:
  - `@babel/preset-typescript`
  - `@babel/plugin-transform-typescript`

## What are the control statements transpiled to?

### If - Ternary operators

```tsx
import { If } from 'tsx-control-statements/components';

const SongRelatedThingy = ({ songList }: { songList: string[] }) => (
  <p>
    <If condition={songList.includes('Gery-Nikol - Im the Queen')}>
      good taste in music
    </If>
  </p>
);

// will transpile to
const SongRelatedThingy = ({ songList }) => (
  <p>
    {songList.includes('Gery-Nikol - Im the Queen')
      ? 'good taste in music'
      : null}
  </p>
);
```

### With - Immediately invoked function expression

```tsx
import { With } from 'tsx-control-statements/components';

const Sum = () => (
  <p>
    <With a={3} b={5} c={6}>
      {a + b + c}
    </With>
  </p>
);

// becomes
const Sum = () => <p>{((a, b, c) => a + b + c)(3, 5, 6)}</p>;
```

### For - `Array.from` calls
More flexible than `[].map`, since it can be provided with an iterator or an array-like as it's first parameter. For non-legacy code, prefer the more type-safe alternative.
```tsx
import { For } from 'tsx-control-statements/components';

// more type-safe for, the typechecker knows
// the types of the "name" and "i" bindings
const Names = ({ names }: { names: string[] }) => (
  <ol>
    <For
      of={names}
      body={(name, i) => (
        <li key={name}>
          {i}
          <strong>{name}</strong>
        </li>
      )}
    />
  </ol>
);

// jsx-control-statements compatible
const Names = ({ names }: { names: string[] }) => (
  <ol>
    <For each="name" of={names} index="i">
      <li key={name}>
        {i}
        <strong>{name}</strong>
      </li>
    </For>
  </ol>
);

// both of the above will transpile to:
const Names = ({ names }) => (
  <ol>
    {Array.from(names, (name, i) => (
      <li key={name}>
        {i}
        <strong>{name}</strong>
      </li>
    ))}
  </ol>
);
```

### Choose/When/Otherwise - nested ternary operators, emulates switch/case.

```tsx
import {
  Choose,
  When,
  Otherwise
} from 'tsx-control-statements/components';

const RandomStuff = ({ str }: { str: string }) => (
  <article>
    <Choose>
      <When condition={str === 'ivan'}>ivancho</When>
      <When condition={str === 'sarmi'}>
        <h1>yum!</h1>
      </When>
      {/* Otherwise tag is optional,
        * if not provided, null will be rendered */}
      <Otherwise>im the queen da da da da</Otherwise>
    </Choose>
  </article>
);

// transpiles to
const RandomStuff = ({ str }) => (
  <article>
    {str === 'ivan'
      ? 'ivancho'
      : str === 'sarmi'
        ? React.createElement('h1', null, 'yum!')
        : 'im the queen da da da da'}
  </article>
);
```

## Cookbook

#### Bundlers and scaffolding tools
- `webpack` with [`ts-loader`](https://github.com/TypeStrong/ts-loader#getcustomtransformers)
- `rollup` with [typescript plugin](https://github.com/rollup/plugins/tree/master/packages/typescript#transformers)
- `parcel` - [this](https://github.com/coreoz/parcel-transformer-ttypescript) might work but don't count on it

#### Testing
- `ava`, `mocha` or anything other that can use `ts-node` - `ts-node` supports [programatically adding custom transformers](https://github.com/TypeStrong/ts-node#programmatic-only-options) so it can be used to run test suites.
- `jest` using `ts-jest` like [that](https://kulshekhar.github.io/ts-jest/docs/getting-started/options/astTransformers)

#### Importing the transformer in your build configs:
```ts
// commonjs
const transformer = require('tsx-control-statements').default;

// ts
import transformer from 'tsx-control-statements';
```

#### Importing type definitions:

```ts
import {
    For,
    If,
    With,
    Choose,
    When,
    Otherwise
} from 'tsx-control-statements/components';
```

## Reasons to not use any control statements for jsx:
- ~~Hard to statically type~~
  - Has been somewhat adressed, with the exception of `With`
- Not part of the standard
- Not ordinary jsx elements
- Requires extra dependencies to use
- Many typescript tools do not support custom transformers in a convenient way
