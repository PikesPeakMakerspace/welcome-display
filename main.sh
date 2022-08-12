#!/bin/bash
url="http://127.0.0.1"

init() {
    cd /home/pi/Desktop/welcome-display
    git pull
    node server.js &&
}

main() {
    chromium-browser --kiosk --incognito "$url"
}

init
main