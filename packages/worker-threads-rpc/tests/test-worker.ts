import { parentPort } from 'worker_threads';
import { startWorkerProvider } from '@zlepper/rpc';
import { Calculator } from '@zlepper/testing';
import { WorkerThreadServerConnection } from '../worker-thread-server-connection.js';


if (parentPort) {
  const connection = new WorkerThreadServerConnection(parentPort);
  startWorkerProvider(new Calculator(), connection);
}
