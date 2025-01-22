'use strict';

const express = require('express');
const path = require('path');
const { Sonos, AsyncDeviceDiscovery } = require('sonos');
const app = express();

const deviceName = process.env.SONOS_DEVICE_NAME || 'Living Room'

async function main() {
  const discovery = new AsyncDeviceDiscovery()

  console.log('Discovering sonos devices...')

  // const devices = await discovery.discoverMultiple({ timeout: 5000 })

  // devices.forEach(device => {
  //   if (device.name === deviceName) {
  //     sonosSpeaker = new Sonos(device.host)
  //   }
  // })

  const sonosSpeaker = new Sonos('192.168.0.172'); // TODO: Remove me

  if (!sonosSpeaker) {
    console.error('No Sonos device found with name %s', deviceName)
    process.exit(1)
  }

  app.get('/status', async (req, res) => {
    const track = await sonosSpeaker.currentTrack();

    res.writeHead(200, {
      'Content-Type': 'application/json'
    })

    res.end(JSON.stringify(track));
  });

  app.use(express.static(path.join(__dirname, '../app')));

  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
      console.log('Press Ctrl+C to quit.');
  });
}

main();
