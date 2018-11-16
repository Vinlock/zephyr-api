#!/usr/bin/env bash

sleep 20

if [[ $(curl -X GET --write-out "%{http_code}\n" --silent --output /dev/null "http://localhost:4000/test") != 200 ]]; then
    echo "Test Failed" 1>&2
    exit 1
fi