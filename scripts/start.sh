#!/bin/bash

env $(cat .env.dev | xargs) yarn run react-scripts-ts start
