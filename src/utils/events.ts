import { Job, Queue } from 'bull';
import { logInfo } from './utils';

export const listen = (queue: Queue) => {
  queue.on('error', function (error) {
    console.error('*error | Queue error occurred:', error);
  })

  .on('waiting', function (jobId) {
    logInfo(`*waiting | Job with ID ${jobId} is waiting to be processed.`);
  })

  .on('active', function (job, jobPromise) {
    logInfo(`*active | Job with ID ${job.id} is now active.`);
  })

  .on('stalled', function (job) {
    console.warn(`*stalled | Job with ID ${job.id} has been marked as stalled.`);
  })

  .on('lock-extension-failed', function (job, err) {
    console.error(`*lock-extension-failed | Lock extension failed for Job with ID ${job.id}. Error:`, err);
  })

  .on('progress', function (job, progress) {
    logInfo(`*progress | Job with ID ${job.id} progress: ${progress}%`);
  })

  .on('completed', function (job, result) {
    logInfo(`*completed | Job with ID ${job.id} completed successfully. Result:`, result);
  })

  .on('failed', function (job, err) {
    console.error(`*failed | Job with ID ${job.id} failed. Error:`, err);
  })

  .on('paused', function () {
    logInfo('*paused | The queue has been paused.');
  })

  .on('resumed', function (job: Job) {
    logInfo('*resumed | The queue has been resumed.', job.id);
  })

  .on('cleaned', function (jobs, type) {
    logInfo(`*cleaned | Cleaned ${jobs.length} ${type} jobs from the queue.`);
  })

  .on('drained', function () {
    logInfo('*drained | The queue has processed all waiting jobs.');
  })

  .on('removed', function (job) {
    logInfo(`*removed | Job with ID ${job.id} has been removed from the queue.`);
  });
};
