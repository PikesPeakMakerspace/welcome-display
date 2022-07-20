#!/bin/bash
url="http://thesecatsdonotexist.com"

init() {
    cd /home/pi/Desktop/welcome-display
    git pull
    #TODO start web app `npm run &` or `node index.js &`
}

main() {
    chromium-browser --kiosk --start-fullscreen "$url"
}

init
main
