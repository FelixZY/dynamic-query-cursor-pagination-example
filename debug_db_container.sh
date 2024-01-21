#!/bin/bash

set -e

docker build -f src/db.Dockerfile --tag "dynamic-query-cursor-pagination-example-test-db:debug" src/
exec docker run -it --rm dynamic-query-cursor-pagination-example-test-db:debug | tee debug.log
