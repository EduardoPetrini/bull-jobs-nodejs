import { Queue } from 'bull';
import { setTimeout } from 'timers/promises';
import { logInfo } from '../utils/utils';
import { Queues } from '../app/Queues';
import { startWorkerProcess } from '../process/workerProcess';

export const startWorker = async (myQueue: Queue) => {
  myQueue.process(async (job, done) => {
    logInfo('Starting the worker with the job', job.id);

    await setTimeout(10_000);

    done(null, { result: 1 })
  })
}

export const checkWorkers = async (queue: Queues, name: string) => {
  const workers = await queue.isThereWorkForQueue(name);
  if (workers) {
    logInfo(`There are ${workers} workers for the queue ${name}`);
    return;
  }

  logInfo(`No workers found for the queue ${name}, instantiating a new one`);

  startWorkerProcess('process', [name]);
}
