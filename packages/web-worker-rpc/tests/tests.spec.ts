import { Calculator } from '@zlepper/testing';
import { wrapBackgroundService, WrappedObject } from '@zlepper/rpc';
import { integrationTests } from '../../testing/testing.js';
import { WebWorkerClientConnection } from '../web-worker-client-connection.js';

function create(): [WrappedObject<Calculator>, Worker] {
  const worker = new Worker('tests/build/test/test-worker.js', {
    type: 'module',
  });

  worker.addEventListener('error', err => console.error(err));

  const workerConnection = new WebWorkerClientConnection(worker);

  return [wrapBackgroundService<Calculator>(workerConnection), worker];
}

describe('Browser', function () {
  let calculator: WrappedObject<Calculator>;
  let worker: Worker;

  beforeEach(function () {
    [calculator, worker] = create();
  });

  integrationTests(() => calculator);

  afterEach(function () {
    return worker.terminate();
  });
});
