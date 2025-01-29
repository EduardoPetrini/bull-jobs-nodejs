import dotenv from "dotenv";
dotenv.config();

import { smoothShutdown } from "../utils/utils";
import { Queues } from "../app/Queues";
import { BullQueueFactory } from "../app/BullQueueProvider";
import { Job } from "../app/interfaces/interfaces";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379");

const start = async () => {
  const queueName = process.argv[2] || "my-queue";
  const jobName = process.argv[3] || "my-job";

  console.log("Starting worker...", queueName, jobName, process.pid);

  const queueFactory = new BullQueueFactory();
  const queueInstance = new Queues({ REDIS_HOST, REDIS_PORT }, queueFactory);
  const queue = await queueInstance.createQueue(queueName);

  if (!queue) {
    throw new Error("Error to create the queue: " + queueName);
  }

  console.log(`Processing the queue ${queueName} - ${jobName}`);
  const done = await new Promise((resolve) => {

    queue.process(jobName, 1, async (job: Job, done: () => void) => {
      console.log(`Processing the job: ${job.id}`);
      setTimeout(async () => {
        console.log(`Processing the job data ${job.id} - ${job.data}`);
        const isQueueEmpty = await queueInstance.isQueueEmpty(queueName);

        resolve(1);
      }, 1_000);
    });

    console.log("Queue process ready for", queueName, jobName);
  });

  console.log("job is done", done);
  smoothShutdown();
};

start().then(() => {
  // console.log('Done');
});
