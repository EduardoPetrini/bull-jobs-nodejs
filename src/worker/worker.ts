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

export const newWorker = async (queueName: string, jobName: string) => {
  await startWorkerProcess('process', [queueName, jobName]);
}

export const checkWorkers = async (queue: Queues, queueName: string, jobName: string) => {
  const workers = await queue.isThereWorkForQueue(queueName);
  if (workers) {
    logInfo(`There are workers for the queue `);
    return true;
  }

  logInfo(`No workers found for the queue `);
  await newWorker(queueName, jobName)
  return false;
}
