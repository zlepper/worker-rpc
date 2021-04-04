import { wrapBackgroundService } from '@zlepper/rpc';
import { WebWorkerClientConnection } from '@zlepper/web-worker-rpc';
import { MyClass } from './my-class';

// Start the web-worker
const worker = new Worker(new URL('./worker', import.meta.url), {
  type: 'module',
});
// Wrap it in a connection so the rpc library can use it
const workerConnection = new WebWorkerClientConnection(worker);

// Wrap the class that is being used in the actual worker
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

