# Usage with webpack

I was not able to successfully hook the transformer without `transpilerOnly: true` flag.

```js
const webpack = require('webpack');

const path = require('path');
const statements = require('tsx-control-statements').default;

module.exports = {
	devtool: 'source-map',
	entry: './index.tsx',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'example.js'
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
					getCustomTransformers: () => ({ before: [statements()] })
				}
			}
		]
	}
};
```

## Running the example:

```shell
yarn build
```

Next open `index.html` and try inputting some space-separated words or clearing the input.
