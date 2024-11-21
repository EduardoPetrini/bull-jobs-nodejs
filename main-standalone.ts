import dotenv from 'dotenv';
dotenv.config();
import readline from 'readline';

import Queue from 'bull';
import { listen } from './events';
import { startWorker } from './worker';
import { logInfo } from './utils/utils';

const start = async () => {
  const mode = process.argv[2] || 'main';
  logInfo('Starting...')
  const HOST = process.env.REDIS_HOST || 'localhost';
  const PORT = parseInt(process.env.REDIS_PORT || '6379');

  console.table([{ HOST, PORT }])
  const myQueue = new Queue('my-queue', `redis://${HOST}:${PORT}`);

  listen(myQueue);

  if (mode === 'worker') {
    return startWorker(myQueue);
  }

  setInterval(async () => {
    logInfo('count', await myQueue.count());
    logInfo('workers', (await myQueue.getWorkers()).length);
  }, 1000)
}

start().then(() => {
  logInfo('Done')
})
