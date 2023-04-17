#!/bin/bash

env $(cat .env.staging | xargs) yarn run react-scripts-ts build
