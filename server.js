import express from 'express';
import expressWs from 'express-ws';
import path from 'path';
import { SonosManager, SonosEvents, SonosDevice } from '@svrooij/sonos'

const app = expressWs(express()).app;
const manager = new SonosManager()

const PORT = process.env.PORT || 8080;
const deviceName = process.env.SONOS_DEVICE_NAME || 'Dining Room'

/** @type {SonosDevice} */
let sonosSpeaker;

console.log('Discovering sonos devices...')

await manager.InitializeWithDiscovery(10);

manager.Devices.forEach(device => {
  if (device.Name === deviceName) {
    sonosSpeaker = device
  }
})

if (!sonosSpeaker) {
  console.error('No Sonos device found with name %s', deviceName)
  process.exit(1)
}

sonosSpeaker.Events.on(SonosEvents.Error, (err) => {
  console.error('Error subscribing to speaker events', err);
});

app.ws('/ws', async function(ws, req) {
  console.log("Websocket client connected");

  ws.send(JSON.stringify(await sonosSpeaker.GetState()));

  const trackChangeListener = async (trachUri) => {
    console.log('Track changed', trachUri);
    ws.send(JSON.stringify(await sonosSpeaker.GetState()));
  }

  sonosSpeaker.Events.on(SonosEvents.CurrentTrackUri, trackChangeListener)

  ws.on('message', async function(msg) {
    console.log('Received message', msg);
  });

  ws.on('close', function() {
    console.log('Websocket client disconnected');

    sonosSpeaker.Events.removeListener(SonosEvents.CurrentTrackUri, trackChangeListener)
  });
});

app.use(express.static(path.join(path.resolve(), '../app')));

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
