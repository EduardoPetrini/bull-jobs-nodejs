import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import { logInfo, quitKeyInput } from "./utils/utils";
import { Queues } from "./app/Queues";
import { BullQueueFactory } from "./app/BullQueueProvider";
import { JOptions } from "./app/interfaces/interfaces";

const app = express();

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379");

app.use(express.json());
app.use(cors());

const queueFactory = new BullQueueFactory();
const queueInstance = new Queues({ REDIS_HOST, REDIS_PORT }, queueFactory);

app.post("/job", async (req: Request, res: Response) => {
  const body = req.body;

  const queueName = body.queueName;
  const jobName = body.jobName;
  const jobData = body.data;

  if (!queueName || !jobName || !jobData) {
    logInfo(
      `Missing body parameters: queueName: ${!!queueName}, jobName: ${!!jobName}, jobData: ${!!jobData}`
    );
    res
      .status(400)
      .json({
        message: `Missing body parameters: queueName: ${!!queueName}, jobName: ${!!jobName}, jobData: ${!!jobData}`,
      });
    return;
  }

  logInfo(`Checking and getting the queue instance ${queueName}`);
  const queue = await queueInstance.createQueue(queueName);

  if (!queue) {
    res.status(502).json({ message: "Queue not found" });
    return;
  }

  const jobOptions: JOptions = {
    priority: 1,
    removeOnComplete: true,
    removeOnFail: true,
  };
  const job = await queue.add(jobName, jobData, jobOptions);
  logInfo("Job added to the queue ", jobName, " - jobId: ", job.id);

  res.send({ status: 0, message: "Job added to the queue" });
});

const PORT = process.env.PORT || "3000";

app.listen(PORT, async () => {
  logInfo("Server on", PORT);

  await queueInstance.getQueue("jobs");
  await queueInstance.setupDefaultHandler("jobs");
});

quitKeyInput();
