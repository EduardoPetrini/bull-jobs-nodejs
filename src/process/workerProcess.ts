import { spawn } from 'child_process';
import { logInfo } from '../utils/utils';


export const spawnWorker = async (queueName: string) => {
  const worker = spawn('npx', ['ts-node', 'src/worker/worker-standalone.ts', queueName], { cwd: process.cwd(), env: process.env });

  worker.stdout.on('data', data => logInfo(`Worker ${worker.pid} output: ${data}`))
  worker.stderr.on('data', data => logInfo(`Worker ${worker.pid} error: ${data}`))
  worker.on('close', code => logInfo(`Worker ${worker.pid} exited with the code: ${code}`))
}


export const startWorkerProcess = (type: string, params: string[]) => {
  if (type === 'process') {
    spawnWorker(params[0]);
    return;
  }

  if (type === 'pod') {
    //create a worker pod
  }
}