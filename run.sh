#!/bin/bash

cd "$(dirname "$0")" || exit
SCRIPT_DIR="$(pwd)"

git pull
npm install

node "${SCRIPT_DIR}/server.js" &

chromium-browser --touch-events=enabled --pull-to-refresh=1 --no-memcheck --noerrdialogs --incognito --start-fullscreen "${SCRIPT_DIR}/index.html"
