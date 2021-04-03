import { wrapBackgroundService, WrappedObject } from '@zlepper/rpc';
import { Calculator, integrationTests } from '@zlepper/testing';
import { Worker } from 'worker_threads';
import { WorkerThreadClientConnection } from '../worker-thread-client-connection.js';

function create(): [WrappedObject<Calculator>, Worker] {
  const workerThread = new Worker('./tests/build/tests/test-worker.js');
  const workerConnection = new WorkerThreadClientConnection(workerThread);

  return [wrapBackgroundService<Calculator>(workerConnection), workerThread];
}

describe('NodeJS', function() {
  let calculator: WrappedObject<Calculator>;
  let worker: Worker;

  before(function() {
    [calculator, worker] = create();
  });

  integrationTests(() => calculator);

  after(function() {
    return worker.terminate();
  });
});
