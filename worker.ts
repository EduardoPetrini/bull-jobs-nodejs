import { Queue } from 'bull';
import { setTimeout } from 'timers/promises';

export const startWorker = async (myQueue: Queue) => {
  myQueue.process(async (job, done) => {
    console.log('Starting the worker with the job', job.id);

    await setTimeout(3000);

    done(null, { result: 1 })
  })
}
