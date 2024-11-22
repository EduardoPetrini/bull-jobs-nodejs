import { spawn } from 'child_process';
import { Queue } from 'bull';
import { setTimeout } from 'timers/promises';
import { logInfo } from '../utils/utils';
import { Queues } from '../app/Queues';

export const startWorker = async (myQueue: Queue) => {
  myQueue.process(async (job, done) => {
    logInfo('Starting the worker with the job', job.id);

    await setTimeout(3000);

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

  spawnWorker(name);
}

export const spawnWorker = async (queueName: string) => {
  const worker = spawn('npx', ['ts-node', 'worker-standalone.ts', queueName], { cwd: process.cwd(), env: process.env });

  worker.stdout.on('data', data => logInfo(`Worker ${worker.pid} output: ${data}`))
  worker.stderr.on('data', data => logInfo(`Worker ${worker.pid} error: ${data}`))
  worker.on('close', code => logInfo(`Worker ${worker.pid} exited with the code: ${code}`))
}
