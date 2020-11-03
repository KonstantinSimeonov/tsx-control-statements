yarn babel test/compatibility-cases --presets=es2015,react --plugins="jsx-control-statements" --out-dir=test/babel
yarn ttsc -P test/tsconfig-compat.json
yarn ttsc -P test/tsconfig-tsx.json
