#!/usr/bin/env bash

# exit when any command fails
set -e

# Reset the state of the git
git stash push

# make sure the current branch has npm install
npm ci

# Upgrade babel
npx babel-upgrade --write --install

# Modifications required before running grunt default:
sed -i '2,7d' src/javascript/index.js
sed -i 's/babel-polyfill/@babel\/polyfill/g' build/mochaTest.js
sed -i 's/babel-register/@babel\/register/g' build/mochaTest.js
sed -i 's/transform-decorators-legacy/@babel\/plugin-proposal-decorators/g' build/webpack/config_common.js

# Install jest
npm i --save-dev jest regenerator-runtime

# Run default to compile binary assets
npx grunt default

