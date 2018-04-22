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
			// only those lines are relevant
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
