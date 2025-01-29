import Bull, { Queue as BullQueue } from "bull";
import {
  Job,
  QueueFactory,
  QueueOptions,
  QueueProvider,
  Worker,
} from "./interfaces/interfaces";

class BullQueueProvider implements QueueProvider {
  constructor(private queue: BullQueue) {}
  
  add(jobName: string, data: any): Promise<Job> {
    return Promise.resolve(this.queue.add(jobName, data));
  }

  async empty(): Promise<void> {
    return this.queue.empty();
  }

  async count(): Promise<number> {
    return this.queue.count();
  }

  async getWorkers(): Promise<Worker[]> {
    return this.queue.getWorkers();
  }

  process(
    jobName: string,
    concurrency: number,
    handler: (job: Job, done: () => void) => void
  ): void {
    this.queue.process(jobName, concurrency, handler);
  }
}

export class BullQueueFactory implements QueueFactory {
  async createQueue(
    name: string,
    options: QueueOptions
  ): Promise<QueueProvider> {
    const bullQueue = new Bull(name, {
      prefix: "local",
      redis: {
        host: options.host as string,
        port: options.port as number,
      },
    });

    const queueProvider = new BullQueueProvider(bullQueue);
    return queueProvider;
  }
}
