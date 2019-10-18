# Usage with webpack

This setup should be identical for `ts-loader` and `awesome-typescript-loader`. This example does not work for `typescript < 2.7`.

## Running the example:

```shell
yarn build
```

Next open `index.html` and try inputting some space-separated words or clearing the input.

## Running the tests

```
yarn test
```

The testing is set up with mocha and ts-node. ts-node is used to transpile typescript files with the tsx-control-statements transformer plugged in.
