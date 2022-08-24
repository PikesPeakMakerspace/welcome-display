# Pikes Peak Makerspace Welcome Display <img src= "https://media.tenor.com/images/2adfe94e69139f3e22623b61d375a7a7/tenor.gif" width= "30" height= "30">

Designed for a vertical screen mounted in a "mall map" frame, this display welcomes visitors and showcases PPM's equipment. The display is targeted towards new guests and visitors of a traveling booth.

## A "Simple" Web App

No one knows if the developer(s) will get hit by a bus. For that reason, this app is intended as a no-frills, easy-ish to edit, static web app served from github. In the event this app blows up (gets heavily used, hopefully no sparks flying), do feel free to refactor and add TypeScript, React and other nifty tools. :D

More updates soon™️.

## Install Raspberry Pi Desktop

TODO

## Additional Install Notes

### Hide Cursor

Quickly hide cursor after not moving (can't remove from browser alone per (this)[https://stackoverflow.com/a/46868282])

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

##  

### Here are some of the tools that we are currently using:

CodePen Raspian BASH ssh

![](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

![](https://img.shields.io/badge/VSCode-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
![](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white")
![](https://img.shields.io/badge/Git-bf2c15?style=for-the-badge&logo=git&logoColor=white)
![](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)
