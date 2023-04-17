#!/bin/bash

env $(cat .env.prod | xargs) yarn run react-scripts-ts build
