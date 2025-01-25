#!/bin/bash

cd "$(dirname "$0")" || exit
SCRIPT_DIR="$(pwd)"

git pull
npm install

node "${SCRIPT_DIR}/server.js"

sleep 5

chromium-browser --noerrdialogs --no-memcheck --disable-session-crashed-bubble --disable-infobars --incognito --start-fullscreen --kiosk "${SCRIPT_DIR}/index.html"
