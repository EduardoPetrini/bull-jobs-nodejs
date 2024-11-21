import EventEmitter from 'node:events';
import readline from 'readline';
import { setTimeout } from 'timers/promises';

export const logInfo = (...args: any[]) => {
  console.log(new Date().toLocaleString(), '[INFO]', ...args);
}

export const smoothShutdown = async (code: number = 0) => {
  logInfo('App is shuting down in 3 seconds');
  await setTimeout(3000);

  logInfo('Bye!')

  process.exit(code)

}

export const errorShutdown = async (error: Error) => {
  console.error(error);
  await smoothShutdown(1);
}

export const promisifyListener = (eventInstance: EventEmitter, event: string): [Promise<unknown>, () => void] => {
  const callback = (resolve: (value: unknown) => void, reject: (reason: any) => void) => (data: unknown) => {
    if (data instanceof Error) {
      return reject(data)
    }

    resolve(data)
  }

  return [new Promise((resolve, reject) => {
    eventInstance.once(event, callback(resolve, reject))
  }), eventInstance.removeAllListeners.bind(eventInstance, event)]
}


export const quitKeyInput = () => {

  readline.emitKeypressEvents(process.stdin);
  let keyPressed = [];

  process.stdin.on('keypress', (ch, key) => {
    keyPressed.push(key.name);
    keyPressed.splice(0, keyPressed.length - 2);
    if (keyPressed[0] === 'q' && keyPressed[1] === 'return') {
      smoothShutdown();
    }
  });
}
