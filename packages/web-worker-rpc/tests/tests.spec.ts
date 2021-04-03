import { wrapBackgroundService, WrappedObject } from '@zlepper/rpc';
import { Calculator, integrationTests } from '@zlepper/testing';
import { WebWorkerClientConnection } from '../web-worker-client-connection';

function create(): [WrappedObject<Calculator>, Worker] {
  const worker = new Worker('/build/worker.js');

  worker.addEventListener('error', err => console.error(err));

  const workerConnection = new WebWorkerClientConnection(worker);

  return [wrapBackgroundService<Calculator>(workerConnection), worker];
}

describe('Browser', function () {
  let calculator: WrappedObject<Calculator>;
  let worker: Worker;

  beforeEach(function () {
    cy.visit('./index.html').then(() => {
      [calculator, worker] = create();
    });
  });

  integrationTests(() => calculator);

  afterEach(function () {
    return worker.terminate();
  });
});
