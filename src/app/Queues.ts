import { logInfo } from "../utils/utils";
import {
    Job,
  QueueFactory,
  QueueOptions,
  QueueProvider,
} from "./interfaces/interfaces";

export class Queues {
  private queueMap: Map<string, QueueProvider>;
  private defaultHandlerDone: boolean = false;

  constructor(
    private options: QueueOptions,
    private queueFactory: QueueFactory
  ) {
    this.queueMap = new Map();
  }

  async createQueue(queueName: string) {
    if (this.queueMap.has(queueName)) {
      return this.queueMap.get(queueName);
    }

    const queue = await this.queueFactory.createQueue(queueName, this.options);
    this.queueMap.set(queueName, queue);
    return queue;
  }

  getQueue(queueName: string) {
    if (this.queueMap.has(queueName)) {
      logInfo(`Queue "${queueName}" exists returning`);
      return this.queueMap.get(queueName);
    }

    logInfo(`Queue "${queueName}" doesn't exists, creating a new one`);
    return this.createQueue(queueName);
  }

  async isThereWorkForQueue(queueName: string) {
    const queue = this.queueMap.get(queueName);
    if (!queue) {
      logInfo(`Queue "${queueName}"  doesn't exists`);
      return false;
    }

    const workers = await queue.getWorkers();

    if (!workers) {
      return false;
    }

    workers.forEach((worker: { [index: string]: string }) =>
      logInfo(worker.name, worker.id)
    );
    const workerCount = workers.length;
    return workerCount > 0;
  }

  countQueues() {
    logInfo("Current number of queues: ", this.queueMap.size);
    return this.queueMap.size;
  }

  async clearQueues() {
    const queues = this.queueMap.values();
    let queue = queues.next();

    while (!queue.done) {
      await queue.value?.empty();
      queue = queues.next();
    }

    this.queueMap.clear();
  }

  async isQueueEmpty(queueName: string) {
    if (!this.queueMap.has(queueName)) {
      logInfo(`Queue "${queueName}"  doesn't exists`);
      return;
    }

    const queue = this.queueMap.get(queueName);
    const countJobs = await queue?.count();

    const isEmpty = countJobs === 0;
    logInfo(`Is queue ${queueName} empty? ${isEmpty}`);

    return isEmpty;
  }

  setupDefaultHandler(queueName: string) {
    if (this.defaultHandlerDone) {
      logInfo(`Default handler already configured, skipping...`);
      return;
    }

    const queue = this.queueMap.get(queueName);
    if (!queue) {
      logInfo(`Queue "${queueName}"  doesn't exists`);
      return;
    }

    logInfo("Setting up the default job handler");
    queue.process("default", 1, (job: Job, done: () => void) => {
      logInfo("Default handler executing for", queueName, job.name, job.id);
      done();
    });

    this.defaultHandlerDone = true;
  }
}
