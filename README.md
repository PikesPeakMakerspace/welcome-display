# Pikes Peak Makerspace Welcome Display <img src= "https://media.tenor.com/images/2adfe94e69139f3e22623b61d375a7a7/tenor.gif" width= "30" height= "30">

Designed for a vertical screen mounted in a "mall map" frame, this display welcomes visitors and showcases PPM's equipment. The display is targeted towards new guests and visitors of a traveling booth.

## A "Simple" Web App

No one knows if the developer(s) will get hit by a bus. For that reason, this app is intended as a no-frills, easy-ish to edit, static web app served from Git Hub. In the event this app blows up (gets heavily used, hopefully no sparks flying), do feel free to refactor and add TypeScript, React and other nifty tools. 😃 

### Here are the tools and additional software that we're currently using:

balenaEtcher <br>
CodePen, Raspian, BASH, ssh <br>
Adobe Illustrator and Photoshop <br>
https://jsoneditoronline.org/ <br>
node.js, socket.io <br>
Visual Studio Code, Arduino IDE <br>
git, GitHub, Git Bash, Markdown <br>
Trello, and especially Slack <br>

## Install Raspberry Pi Desktop

https://www.raspberrypi.com/software/raspberry-pi-desktop/

## Additional Install Notes

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

## Install Game Controller Support

TODO

More updates soon™️.

-----
