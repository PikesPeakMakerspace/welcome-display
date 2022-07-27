#!/bin/bash
url="https://pikespeakmakerspace.github.io/welcome-display/"

init() {
    cd /home/pi/Desktop/welcome-display
    git pull
    #TODO start web app `npm run &` or `node index.js &`
}

main() {
    # chromium-browser --kiosk --start-fullscreen "$url"
    chromium-browser "$url"
}

init
main
