import { promises as fs } from 'fs';

export async function turnOffScreen() {
  try {
    await fs.writeFile('/sys/class/backlight/backlight/brightness', "0");
  }
  catch (e) {
    console.error('Failed to turn off screen', e);
  }
}

export async function turnOnScreen() {
  try {
    await fs.writeFile('/sys/class/backlight/backlight/brightness', "1");
  }
  catch (e) {
    console.error('Failed to turn on screen', e);
  }
}
