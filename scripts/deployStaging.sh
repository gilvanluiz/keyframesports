#!/bin/bash -e

yarn run build:staging
yarn run surge ./build app.keyframesports.com

