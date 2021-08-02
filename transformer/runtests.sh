#!/usr/bin/env bash

mkdir -p test-output

lerna bootstrap
yarn build

readonly supported_tsc_versions=(3.4 3.5 3.6 3.7 3.8 3.9 4.0 4.1 4.2 4.3 latest)

exit_code=0
for v in ${supported_tsc_versions[*]}; do
    echo "================= TESTING VERSION $v ======================="
    git checkout ..
    yarn add typescript@$v
    yarn tsc --version
    yarn test:compile
    yarn test:run
    test_exit_code=$?
    [[ $test_exit_code != 0 ]] && exit_code=1

    echo "Build and tests for $v exited with code $test_exit_code"
done

exit $exit_code
