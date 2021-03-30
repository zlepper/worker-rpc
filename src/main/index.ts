import { MyClass } from '../shared/my-class';
import { wrapUsingWorker } from './worker-consumer.js';

const wrapper = wrapUsingWorker<MyClass>('build/worker/worker.js');

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
