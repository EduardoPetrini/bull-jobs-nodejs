import { Job as BullJob, JobOptions } from 'bull';

export interface QueueOptions {
  [key: string]: string | number | boolean | undefined | Record<string, any>;
}

export interface BullQueueOptions extends QueueOptions {
  host: string;
  port: number;
  prefix?: string;
  redis?: {
    password?: string;
    tls?: boolean;
  };
}

export interface SQSQueueOptions extends QueueOptions {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export type Job = BullJob & {
  name: string;
}

export type JOptions = JobOptions

export interface Worker {
  [key: string]: string;
}

export interface QueueProvider {
  empty(): Promise<void>;
  count(): Promise<number>;
  getWorkers(): Promise<Worker[]>;
  process(
    jobName: string,
    concurrency: number,
    handler: (job: Job, done: () => void) => void
  ): void;
  add(jobName: string, jobData: any, jobOptions: any): Promise<Job>;
}

export interface QueueFactory {
  createQueue(name: string, options: QueueOptions): Promise<QueueProvider> ;
}
