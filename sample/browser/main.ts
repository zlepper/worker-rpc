import { MyClass, useMyClass } from '../shared/my-class.js';
import { wrapBackgroundService } from '../../src/client/worker-consumer.js';
import { WebWorkerClientConnection } from '../../src/web-worker/web-worker-client-connection.js';

const worker = new Worker('build/sample/worker.js', {
  type: 'module',
});
const workerConnection = new WebWorkerClientConnection(worker);

const wrapper = wrapBackgroundService<MyClass>(workerConnection);

useMyClass(wrapper);
