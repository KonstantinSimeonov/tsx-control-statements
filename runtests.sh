#!/usr/bin/env bash

mkdir -p test-output

npm run build

readonly supported_tsc_versions=(4.3 4.4 4.5 4.6 4.7 4.8 4.9)

exit_code=0
for v in ${supported_tsc_versions[*]}; do
    echo "================= TESTING VERSION $v ======================="
    git checkout ..
    npm i --save-dev typescript@$v
    ./node_modules/.bin/tsc --version
    npm run test:compile
    npm run test:run
    test_exit_code=$?
    [[ $test_exit_code != 0 ]] && exit_code=1

    echo "Build and tests for $v exited with code $test_exit_code"
done

exit $exit_code
