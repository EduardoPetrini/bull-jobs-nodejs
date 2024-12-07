import dotenv from 'dotenv';
dotenv.config();

import { smoothShutdown } from '../utils/utils';
import { Queues } from '../app/Queues';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

const start = async () => {
  const queueName = process.argv[2] || 'my-queue';
  const jobName = process.argv[3] || 'my-job';

  console.log('Starting worker...', queueName, jobName);

  const myQueue = new Queues(REDIS_HOST, REDIS_PORT);

  const queue = myQueue.createQueue(queueName);

  if (!queue) {
    throw new Error('Error to create the queue: ' + queueName);
  }

  // listen(queue);

  console.log(`Processing the queue ${queueName} - ${jobName}`);

  queue.process(jobName, async (job, done) => {
    console.log(`Processing the job: ${job.id}`);
    setTimeout(async () => {
      console.log(`Processing the job data ${job.id} - ${job.data}`);
      const isQueueEmpty = await myQueue.isQueueEmpty(queueName);
      done(null, { done: true });

      if (isQueueEmpty) {
        smoothShutdown();
      }
    }, 10_000)
  });
}

start().then(() => {
  // console.log('Done');
})
