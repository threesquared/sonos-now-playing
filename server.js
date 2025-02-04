import express from 'express';
import expressWs from 'express-ws';
import path from 'path';
import { SonosManager, SonosEvents, SonosDevice } from '@svrooij/sonos'

import { turnOnScreen, turnOffScreen } from './util.js';

const app = expressWs(express()).app;
const manager = new SonosManager()

const PORT = process.env.PORT || 8080;
const deviceName = process.env.SONOS_DEVICE_NAME || 'Dining Room'

/**
 * Find a local Sonos speaker with the supplied name
 *
 * @returns {SonosDevice}
 */
async function initSonosSpeaker() {
  console.log('Discovering Sonos devices...')

  await manager.InitializeWithDiscovery(10);

  for (const device of manager.Devices) {
    if (device.Name === deviceName) {
      return device;
    }
  }

  console.error(`Could not find Sonos device with name "${deviceName}"`)

  process.exit(1)
}

const sonosSpeaker = await initSonosSpeaker();

app.ws('/ws', async (ws) => {
  console.log("Websocket client connected");

  ws.send(JSON.stringify(await sonosSpeaker.GetState()));

  const stateChangeListener = async (state) => {
    if (state == "PLAYING") {
      turnOnScreen();
    } else if (state == "STOPPED") {
      turnOffScreen();
    }
  }

  const trackChangeListener = async (trachUri) => {
    console.log('Track changed', trachUri);
    ws.send(JSON.stringify(await sonosSpeaker.GetState()));
  }

  sonosSpeaker.Events.on(SonosEvents.CurrentTrackUri, trackChangeListener)
  sonosSpeaker.Events.on(SonosEvents.CurrentTransportStateSimple, stateChangeListener)

  // Handle client message
  ws.on('message', async (msg) => {
    switch (msg) {
      case "next":
        sonosSpeaker.Next();
        break;

      case "previous":
        sonosSpeaker.Previous();
        break;

      case "playpause":
        sonosSpeaker.TogglePlayback();
        break;

      default:
        console.error('Unknown client message', msg);
        break;
    }
  });

  // Handle client disconnect
  ws.on('close', async () => {
    console.log('Websocket client disconnected');

    sonosSpeaker.Events.removeListener(SonosEvents.CurrentTrackUri, trackChangeListener);
    sonosSpeaker.Events.removeListener(SonosEvents.CurrentTransportStateSimple, trackChangeListener);
  });
});

app.get('/info', async (req, res) => {
  turnOnScreen();

  ws.getWss().clients.forEach(client => client.send({
    action: `info`,
    url: req.query.url,
    time: req.query.time || 10000
  }));

  res.send('Sent to all clients');
});

app.use('/', express.static(path.resolve(), {index: 'index.html'}));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

process.on('SIGINT', () => {
  console.log('Cancelling all subscriptions')
  sonosSpeaker.CancelEvents();

  setTimeout(() => {
    process.exit(0)
  }, 3000)
})
