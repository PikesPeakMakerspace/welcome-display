#!/bin/bash
url="https://pikespeakmakerspace.github.io/welcome-display/"

init() {
    cd /home/pi/Desktop/welcome-display
    git pull
    #TODO start web app `npm run &` or `node index.js &`
}

main() {
    # chromium-browser --kiosk --start-fullscreen "$url"
    #chromium-browser --kiosk "$url"
    chromium-browser --incognito --kiosk file:///home/pi/Desktop/welcome-display/index.html

init
main
