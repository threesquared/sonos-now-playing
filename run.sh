#!/bin/bash

cd "$(dirname "$0")" || exit
SCRIPT_DIR="$(pwd)"

git pull
npm install

node "${SCRIPT_DIR}/server.js" &

chromium-browser --touch-events --pull-to-refresh=1 --noerrdialogs --incognito --start-fullscreen --kiosk "${SCRIPT_DIR}/index.html"
