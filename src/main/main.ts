import { MyClass } from '../shared/my-class';
import { wrapBackgroundService } from './worker-consumer.js';
import { WorkerWorkerConnection } from './worker-worker-connection.js';

const worker = new Worker('build/worker/worker.js', {
  type: 'module',
});
const workerConnection = new WorkerWorkerConnection(worker);

const wrapper = wrapBackgroundService<MyClass>(workerConnection);

const result = wrapper.sayHello('Zlepper');

result.then(r => {
  console.log({ result, r });
});

const longRunning = wrapper.longRunningMethod('Zlepper', 1500);

longRunning.then(r => {
  console.log({ r, longRunning });
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
