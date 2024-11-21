import dotenv from 'dotenv';
dotenv.config();

import { listen } from './events';
import { logInfo, smoothShutdown } from './utils/utils';
import { Queues } from './Queues';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

const start = async () => {
  const queueName = process.argv[2] || 'my-queue';

  logInfo('Starting worker...');

  const myQueue = new Queues(REDIS_HOST, REDIS_PORT);

  const queue = myQueue.createQueue(queueName);

  if (!queue) {
    throw new Error('Error to create the queue: ' + queueName);
  }

  listen(queue);

  logInfo(`Processing the queue ${queueName}`);

  queue.process(async (job, done) => {
    logInfo(`Processing the job: ${job.id}`);
    setTimeout(async () => {
      logInfo(`Processing the job data ${job.id} - ${job.data}`);
      const isQueueEmpty = await myQueue.isQueueEmpty(queueName);
      done(null, { done: true });

      if (isQueueEmpty) {
        smoothShutdown();
      }
    }, 5_000)
  });
}

start().then(() => {
  logInfo('Done')
})
