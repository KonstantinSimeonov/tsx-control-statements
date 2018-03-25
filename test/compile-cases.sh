rm -rf ./babel ./tsc
./node_modules/.bin/babel ./cases --presets=es2015,react --plugins="jsx-control-statements" --out-dir=babel
node fuse.js