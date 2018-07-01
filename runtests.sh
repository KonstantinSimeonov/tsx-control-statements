#!/bin/bash

mkdir -p ./test-output

yarn && yarn build

exit_code=0
for v in {4..9}; do
	rm -rf ./node_modules/typescript
	echo "TESTING VERSION 2.$v.* ======================="
	yarn upgrade typescript@2.$v > /dev/null
	./-v | grep -i --color Version
	yarn test
	[[ $? != 0 ]] && exit_code=1
	echo "Build and tests for 2.$v.* exited with code $?"
done

exit exit_code

