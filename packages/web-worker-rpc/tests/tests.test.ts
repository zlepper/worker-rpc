import { Calculator } from '@zlepper/calculator';
import { wrapBackgroundService, WrappedObject } from '@zlepper/rpc';
import { WebWorkerClientConnection } from '../web-worker-client-connection';

function create(): [WrappedObject<Calculator>, Worker] {
  const worker = new Worker('/build/test-worker.js', {
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

  it('should invoke normal (non-promise) methods', async function () {
    const result = await calculator.add(1, 2);
    expect(result).toEqual(3);
  });

  it('should invoke promise methods', async function () {
    const result = await calculator.addUsingPromise(3, 4);
    expect(result).toEqual(7);
  });

  it('should invoke methods with "complex" type arguments', async function () {
    const result = await calculator.addAll([1, 2, 3, 4]);
    expect(result).toEqual(10);
  });

  afterEach(function () {
    return worker.terminate();
  });
});
