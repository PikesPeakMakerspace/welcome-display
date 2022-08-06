# Pikes Peak Makerspace Welcome Display

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

## Install Game Controller Support

TODO