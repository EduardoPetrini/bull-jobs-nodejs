import dotenv from 'dotenv';
dotenv.config();
import readline from 'readline';

import Queue from 'bull';
import { listen } from './events';
import { startWorker } from './worker';

const start = async () => {
  const mode = process.argv[2] || 'main';
  console.log('Starting...')
  const HOST = process.env.REDIS_HOST || 'localhost';
  const PORT = parseInt(process.env.REDIS_PORT || '6379');

  console.table([{ HOST, PORT }])
  const myQueue = new Queue('my-queue', `redis://${HOST}:${PORT}`);

  listen(myQueue);

  if (mode === 'worker') {
    return startWorker(myQueue);
  }

  setTimeout(() => {
    console.log('Adding a job')
    myQueue.add({ title: 'hey ho' })
  }, 3000)
}

start().then(() => {
  console.log('Done')
})

readline.emitKeypressEvents(process.stdin);
let keyPressed = [];

process.stdin.on('keypress', (ch, key) => {
  keyPressed.push(key.name);
  keyPressed.splice(0, keyPressed.length - 2);
  if (keyPressed[0] === 'q' && keyPressed[1] === 'return') {
    console.log('Bye!');
    process.exit(0)
  }
})
