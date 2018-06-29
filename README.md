# tsx-control-statements

[![Build Status](https://travis-ci.org/KonstantinSimeonov/tsx-control-statements.svg?branch=master)](https://travis-ci.org/KonstantinSimeonov/tsx-control-statements) [![Coverage Status](https://coveralls.io/repos/github/KonstantinSimeonov/tsx-control-statements/badge.svg?branch=master)](https://coveralls.io/github/KonstantinSimeonov/tsx-control-statements?branch=master) [![Gitter chat](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/tsx-control-statements/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Typescript compiler plugin - kind of a port of [jsx-control-statements](https://www.npmjs.com/package/babel-plugin-jsx-control-statements) for typescript. Intended to allow migrating from babel to TSC without the need to migrate away from control statements.

## Feedback appreciated!
- Got a problem getting things rolling or having a suggestion? You're welcome! Reach me at [gitter chat](https://gitter.im/tsx-control-statements/Lobby).

## Do `.tsx` files compile successfuly?
- Yup, control statements transpile to type correct typescript before type checking
- Note: editors like visual studio code cannot infer that some additional transpilation will occur and will complain
    - You can check out a workaround [here](./test/tsx-cases/for.tsx)
- Test it: `yarn build && yarn test`
    - This command will compile and run the tests, some of which will compile the files in `tests/tsx-cases`, which are typescript files with jsx control statements used in them.
    - **Tests include behaviour compatibility tests with `jsx-control-statements` and tests whether tsx control statements render the same elements as components using plain ts in tsx.**
- Typings: `index.d.tsx`

## Can it compile `.js` or `.jsx` files?
- Yup, just add `"allowJs": true` to the compiler options in your `tsconfig.json`.

## I see the tests are writen with React, can I use this with something else (Vue for example)?
- The transformer itself has no dependency on React, Vue or other frontend frameworks. It can be used to transform jsx for whatever purposes.

## What typescript/javascript code is emitted?

### If
- Transpiles to ternary operators

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
        {songList.includes('Gery-Nikol - Im the Queen') ? 'good taste in music' : null}
    </p>
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
const Sum = () => (
    <p>
        {((a, b, c) => a + b + c))()}
    </p>
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
const Names = ({ names }: { names: string[] }) => (
    <ol>
        {names.map((name, i) => <li key={name}>{i}<strong>{name}</strong></li>}
    </ol>
)
```

### Choose/When/Otherwise
- Provides If/Else like conditional control. Transpiles to nested ternary operators.

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
const RandomStuff = ({ str }: { str: string }) => (
    <article>
	{str === 'ivan' ? 'ivancho' : str === 'sarmi' ? React.createElement('h1', null, 'yum!') : 'im the queen da da da da'}
    </article>
)
```

- `Otherwise` tag at the end is optional - if not provided, whenever no `When`'s condition did match, nothing will be rendered.

## Cookbook (example setups incoming)

- [fuse-box](./examples/fuse-box)
    - The unit test cases for this project are bundled with `fuse-box` ([link](./test/fuse.js)) which could serve as an example.

- [webpack (ts-loader/awesome-typescript-loader)](./examples/webpack)

## Can I switch from `babel` + `jsx-control-statements` to `tsc` + `tsx-control-statements`?
- Should be a drop-in replacement, will try it for a bigger project in a few days.

## What if I want to use this right nao?
```shell
# npm
npm i tsx-control-statements
# or yarn
yarn add tsx-control-statements
```

- In your code:
```js
const transformer = require('tsx-control-statements').default();
```

## Do I think control statements are a good idea?
- Nah. They might make jsx look a lot more feng shui, but in my experience they tend to get in the way of correct static typing and use of language features like destructuring in function parameters. Also (at least to me) they seem to kind of promote dumping out huger chunks of jsx, which could be broken down into smaller parts for testability and other stuff and whatnot. Why am I developing this then? I've a project written with `jsx-control-statements` that I want to migrate to typescript/fuse-box.
