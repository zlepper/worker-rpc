import { MyClass, useMyClass } from '../shared/my-class.js';
import { wrapBackgroundService } from '../../src/client/worker-consumer.js';
import { WebWorkerClientConnection } from '../../src/web-worker/web-worker-client-connection.js';

const worker = new Worker('build/sample/worker.js', {
  type: 'module',
});
const workerConnection = new WebWorkerClientConnection(worker);

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

