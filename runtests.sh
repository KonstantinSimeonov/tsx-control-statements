#!/usr/bin/env bash

mkdir -p test-output

readonly supported_tsc_versions=(5.0 5.1 5.2 5.3)

exit_code=0
for v in ${supported_tsc_versions[*]}; do
    echo "================= TESTING VERSION $v ======================="
    git checkout ..
    npm i --save-dev typescript@$v
    ./node_modules/.bin/tsc --version
    npm run link:self
    npm run test:compile
    npm run test:run
    test_exit_code=$?
    [[ $test_exit_code != 0 ]] && exit_code=1

    echo "Build and tests for $v exited with code $test_exit_code"
done

exit $exit_code
