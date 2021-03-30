import { Worker } from 'worker_threads';
import { wrapBackgroundService } from '../../src/client/worker-consumer.js';
import { WorkerThreadClientConnection } from '../../src/node-worker-threads/worker-thread-client-connection.js';
import { MyClass, useMyClass } from '../shared/my-class.js';

const workerThread = new Worker('./build/sample/nodejs/worker.js');
const workerConnection = new WorkerThreadClientConnection(workerThread);

const wrapper = wrapBackgroundService<MyClass>(workerConnection);

useMyClass(wrapper, () => {
  process.exit(0);
});
