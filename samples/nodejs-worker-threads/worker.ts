import { startWorkerProvider } from '@zlepper/rpc';
import { WorkerThreadServerConnection } from '@zlepper/worker-threads-rpc';
import { parentPort } from 'worker_threads';
import { MyClass } from './my-class.js';

if (parentPort) {
  const connection = new WorkerThreadServerConnection(parentPort);
  startWorkerProvider(new MyClass(), connection);
}
