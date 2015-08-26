PATH=$PATH:/usr/local/bin
cd "$(dirname "$0")"
./node_modules/.bin/babel-node ./src/rtfToHtml.js $*
