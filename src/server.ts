import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import { logInfo } from './utils/utils';
import { checkWorkers } from './worker/worker';
import { Queues } from './app/Queues';

const app = express();

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

app.use(express.json());
app.use(cors());

const queueInstance = new Queues(REDIS_HOST, REDIS_PORT)

app.post('/job', async (req: Request, res: Response) => {
  const body = req.body;

  const queueName = body.queueName;
  const jobData = body.data

  if (!queueName || !jobData) {
    throw new Error('Missing body parameters')
  }

  const queue = queueInstance.getQueue(queueName);

  if (!queue) {
    res.status(502).json({ message: 'Queue not found: ' + queueName })
    return;
  }

  queue.add(jobData);

  await checkWorkers(queueInstance, queueName);
  res.send({ status: 0, message: 'Job added to the queue: ' + queueName })
});

const PORT = process.env.PORT || '3000';

app.listen(PORT, () => {
  logInfo('Server on', PORT)
})
