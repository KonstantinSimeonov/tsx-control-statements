#!/usr/bin/env bash

mkdir -p test-output

lerna bootstrap
yarn build

readonly supported_tsc_versions=(latest)

exit_code=0
for v in ${supported_tsc_versions[*]}; do
    echo "================= TESTING VERSION $v ======================="
    yarn add --dev --network-concurrency 8 typescript@$v
    yarn tsc --version
    yarn test:compile
    yarn test:run
    test_exit_code=$?
    [[ $test_exit_code != 0 ]] && exit_code=1

    echo "Build and tests for $v exited with code $test_exit_code"
done

exit $exit_code
