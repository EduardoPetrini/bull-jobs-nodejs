import Queue, { Queue as QueueType } from 'bull';
import { logInfo } from './utils/utils';


type QueueOptions = {
  host: string;
  port: number;
}

export class Queues {
  private options: QueueOptions;
  private queueMap: Map<string, QueueType>;

  constructor(redisHost: string, redisPort: number) {
    this.options = {
      host: redisHost,
      port: redisPort,
    }

    this.queueMap = new Map();
  }

  createQueue(queueName: string) {
    if (this.queueMap.has(queueName)) {
      logInfo(`Queue "${queueName}" already exists`);
      return this.queueMap.get(queueName);
    }

    const queue = new Queue(queueName, { redis: { host: this.options.host, port: this.options.port } });
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
    if (!this.queueMap.has(queueName)) {
      logInfo(`Queue "${queueName}"  doesn't exists`);
      return;
    }

    const queue = this.queueMap.get(queueName);

    const workers = (await queue?.getWorkers())?.length;
    return workers;
  }

  countQueues() {
    logInfo('Current number of queues: ', this.queueMap.size)
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
}
