# sonos-now-playing

> Display current playing artwork from Sonos on a Raspberry Pi screen

## Features

- Displays the current playing artwork and track title from Sonos
- Animated transitions between tracks
- Turns the screen off when music is not playing
- Automatically starts on boot and reconnects to Sonos
- Touch screen controls to play/pause and skip tracks
- Info endpoint to temporarily show an external URL on the screen (f.ex doorbell camera)

## Installation

Install dependencies and check out this repository:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

sudo apt-get install -y nodejs git chromium-browser

git clone https://github.com/threesquared/sonos-now-playing.git
cd sonos-now-playing

npm install
```

## Autostart

Create a file at `~/.config/labwc/autostart` with the following content:

```bash
/home/user/sonos-now-playing/run.sh
```

## Hardware

The hardware I used in my build:

- [Raspberry Pi Zero 2 W](https://www.raspberrypi.com/products/raspberry-pi-zero-2-w/)
- [HyperPixel 4.0 Square Touch](https://shop.pimoroni.com/products/hyperpixel-4-square?variant=30138251444307)
- [Desktop Case for HyperPixel 4.0 Square](https://cults3d.com/en/3d-model/gadget/desktop-case-screw-mount-for-pimoroni-hyperpixel-4-0-square-touch-and-raspberry-pi)
