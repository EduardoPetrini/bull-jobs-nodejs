import dotenv from 'dotenv';
dotenv.config();

import { setTimeout as setTimeoutPromise } from 'timers/promises';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { logInfo, quitKeyInput } from './utils/utils';
import { checkWorkers, newWorker } from './worker/worker';
import { Queues } from './app/Queues';
import { JobOptions } from 'bull';

const app = express();

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

app.use(express.json());
app.use(cors());

const queueInstance = new Queues(REDIS_HOST, REDIS_PORT);

app.post('/job', async (req: Request, res: Response) => {
  const body = req.body;

  const queueName = body.queueName;
  const jobName = body.jobName;
  const jobData = body.data

  if (!queueName || !jobName || !jobData) {
    throw new Error('Missing body parameters')
  }

  logInfo(`Checking and getting the queue instance ${queueName}`);
  const queue = queueInstance.createQueue(queueName);

  if (!queue) {
    res.status(502).json({ message: 'Queue not found'})
    return;
  }


  // logInfo('Starting the worker...');
  // await newWorker(queueName, jobName);

  // await new Promise(resolve => setTimeout(() => resolve(1), 5_000));
  // logInfo('Worker is ready, adding the job');

  const jobOptions: JobOptions = {
    priority: 1,
    removeOnComplete: true,
    removeOnFail: true,
  };
  const job = await queue.add(jobName, jobData, jobOptions);
  logInfo('Job added to the queue ', jobName, ' - jobId: ', job.id)

  res.send({ status: 0, message: 'Job added to the queue' })
});

const PORT = process.env.PORT || '3000';

app.listen(PORT, () => {
  logInfo('Server on', PORT);
  
  queueInstance.getQueue('jobs');
  queueInstance.setupDefaultHandler('jobs');
})

quitKeyInput();
