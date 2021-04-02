import { parentPort } from 'worker_threads';
import { WorkerThreadServerConnection } from '../../src/node-worker-threads/worker-thread-server-connection.js';
import { startWorkerProvider } from '../../src/worker/worker-provider.js';
import { MyClass } from '../shared/my-class.js';

if (parentPort) {
  const connection = new WorkerThreadServerConnection(parentPort);
  startWorkerProvider(new MyClass(), connection);
}
