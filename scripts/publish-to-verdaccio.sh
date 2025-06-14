#!/bin/bash

# Move into the project root
dir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
cd "$dir"

# A shell script which publishes all packages to a local Verdaccio registry for testing / local dev purposes

if [[ -z "${VERDACCIO_URL}" ]]; then
  VERDACCIO=http://localhost:4873/
else
  VERDACCIO="${VERDACCIO_URL}"
fi

echo "Publishing to Verdaccio @ $VERDACCIO"

cd ../packages/bridge && npm publish -reg $VERDACCIO &&\
cd ../demo && npm publish -reg $VERDACCIO
