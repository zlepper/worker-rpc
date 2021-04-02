import { Worker } from 'worker_threads';
import { wrapBackgroundService } from '../../src/client/worker-consumer.js';
import { WorkerThreadClientConnection } from '../../src/node-worker-threads/worker-thread-client-connection.js';
import { MyClass, useMyClass } from '../shared/my-class.js';

const workerThread = new Worker('./build/sample/nodejs/worker.js');
const workerConnection = new WorkerThreadClientConnection(workerThread);

const wrapper = wrapBackgroundService<MyClass>(workerConnection);
const result = wrapper.sayHello('Zlepper');

result.then(r => {
  console.log({ result, r });
});

const longRunning = wrapper.longRunningMethod('Zlepper', 1500);

longRunning.then(r => {
  console.log({ r, longRunning });
  process.exit(0);
});

const asJson = wrapper.toJson({
  key: 'hello',
  nested: {
    v: 'a',
  },
});

asJson.then(json => {
  console.log({ json });
});
