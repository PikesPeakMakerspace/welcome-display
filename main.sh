#!/bin/bash
url="file:///home/pi/Desktop/welcome-display/index.html"

init() {
    cd /home/pi/Desktop/welcome-display
    git pull
    #TODO start web app `npm run &` or `node index.js &`
}

main() {
    # chromium-browser --kiosk --start-fullscreen "$url"
    chromium-browser --kiosk --incognito "$url"
}

init
main