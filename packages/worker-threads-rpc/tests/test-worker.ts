import { parentPort } from 'worker_threads';
import { startWorkerProvider, WorkerThreadServerConnection } from '../../src';
import { Calculator } from '../shared/calculator';


if (parentPort) {
  const connection = new WorkerThreadServerConnection(parentPort);
  startWorkerProvider(new Calculator(), connection);
}
