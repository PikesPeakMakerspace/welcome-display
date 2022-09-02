# Pikes Peak Makerspace Welcome Display

This Raspberry Pi and Teensy/Arduino powered display welcomes Pikes Peak Makerspace visitors, showcasing a map tour of PPM and its equipment. The display is targeted towards new guests and visitors of a traveling booth. It uses an XBox game controller for navigation for added fun.

On boot, the latest version of the app is pulled into the Pi from GitHub if online, followed by launching the app. It also runs offline when traveling. The app UI is able to send signals to the included Node server via socket.io, instructing the server to send pin signals to the Teensy/Arduino board. This adds an additional light show outside of the screen.

Vanilla JavaScript controls most of the app and server. The intention was to make it accessible for new contributors (contributions always welcome!)

## A Fun Volunteer Project

Before:

![donated mall map display frame looking for volunteer time](https://github.com/PikesPeakMakerspace/welcome-display/blob/main/public/img/docs/before.jpg)

After:

![welcome kiosk after contributions from several amazing people](https://github.com/PikesPeakMakerspace/welcome-display/blob/main/public/img/docs/after.jpg)

Thanks to all those who donated time, code, hardware, design, sound, testing and more at PPM! This came together quickly thanks to you.

### Contributors

- Ben S
- Chris M
- Chris S
- Drew J
- Greg B
- Joey C
- John N
- Les F
- Lisa M
- Marvin H
- Mathew P
- Nate R
- Pavan D
- Ross H
- Trevor B
- Warren J

## Install Raspberry Pi Desktop

https://www.raspberrypi.com/software/raspberry-pi-desktop/

### Hide Cursor

Quickly hide cursor after not moving (can't remove from browser alone per (this) [https://stackoverflow.com/a/46868282])

```
sudo apt-get install unclutter
mkdir -p ~/.config/lxsession/LXDE/
touch ~/.config/lxsession/LXDE/autostart
nano ~/.config/lxsession/LXDE/autostart
# Add this line and save:
@unclutter -idle 0.1
```

### Rotate Raspberry Pi screen

Add the following command to /boot/config.txt to rotate 90 degs CW:

```
display_hdmi_rotate=1
```
https://pimylifeup.com/raspberry-pi-rotate-screen/

### Launch App After Loading Desktop

TODO

## Additional Tools

Here are the tools and additional software that we're currently using:

- balenaEtcher
- CodePen, Raspian, BASH, ssh
- node.js, socket.io
- Geany, Chrome Developer tools
- Adobe Illustrator and Photoshop
- https://jsoneditoronline.org/
- Visual Studio Code, Arduino IDE
- git, GitHub, Git Bash, Markdown
- Trello, and especially Slack
