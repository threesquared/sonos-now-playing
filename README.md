# sonos-now-playing

> Display current playing artwork on a Raspberry pi screen

## Installation

Install chromium and check out this repository:

```bash
sudo apt-get install chromium

git clone https://github.com/threesquared/sonos-now-playing.git
cd sonos-now-playing
npm install
```

Create this file at `~/.config/lxsession/LXDE-pi/autostart`:

```bash
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
@xset s off
@xset s noblank
@xset -dpms
@/home/user/sonos-now-playing/bin/run.sh
@chromium-browser --kiosk --incognito http://localhost:8080/index.html
```

## Hardware

My hardware:

- Raspberry PI Zero 2 W
- HyperPixel 4.0 Square Touch
- Pimoroni Desktop Case
