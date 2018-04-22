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
				loader: 'awesome-typescript-loader',
				// loader: 'ts-loader',
				options: {
					getCustomTransformers: () => ({ before: [statements()] })
				}
			}
		]
	}
};
