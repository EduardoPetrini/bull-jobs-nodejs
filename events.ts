import { Job, Queue } from 'bull';

export const listen = (queue: Queue) => {
  queue.on('error', function (error) {
    console.error('*error | Queue error occurred:', error);
  })

  .on('waiting', function (jobId) {
    console.log(`*waiting | Job with ID ${jobId} is waiting to be processed.`);
  })

  .on('active', function (job, jobPromise) {
    console.log(`*active | Job with ID ${job.id} is now active.`);
  })

  .on('stalled', function (job) {
    console.warn(`*stalled | Job with ID ${job.id} has been marked as stalled.`);
  })

  .on('lock-extension-failed', function (job, err) {
    console.error(`*lock-extension-failed | Lock extension failed for Job with ID ${job.id}. Error:`, err);
  })

  .on('progress', function (job, progress) {
    console.log(`*progress | Job with ID ${job.id} progress: ${progress}%`);
  })

  .on('completed', function (job, result) {
    console.log(`*completed | Job with ID ${job.id} completed successfully. Result:`, result);
  })

  .on('failed', function (job, err) {
    console.error(`*failed | Job with ID ${job.id} failed. Error:`, err);
  })

  .on('paused', function () {
    console.log('*paused | The queue has been paused.');
  })

  .on('resumed', function (job: Job) {
    console.log('*resumed | The queue has been resumed.', job.id);
  })

  .on('cleaned', function (jobs, type) {
    console.log(`*cleaned | Cleaned ${jobs.length} ${type} jobs from the queue.`);
  })

  .on('drained', function () {
    console.log('*drained | The queue has processed all waiting jobs.');
  })

  .on('removed', function (job) {
    console.log(`*removed | Job with ID ${job.id} has been removed from the queue.`);
  });
};
