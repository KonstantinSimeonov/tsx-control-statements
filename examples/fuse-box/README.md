# Usage with `fuse-box`

Tell `fuse-box` to use the typescript compiler and add the transformer to the config.

```js
const { FuseBox } = require('fuse-box');
const statements = require('tsx-control-statements').default;

const fuse = FuseBox.init({
	transformers: {
		before: [statements()]
	},
	useTypescriptCompiler: true,
	...otherOptions
});
```

## Running the example

```shell
yarn build
```

Then open `index.html` and input several words separated by space or clear the input.
