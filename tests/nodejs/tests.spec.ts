import { expect } from 'chai';
import { Worker } from 'worker_threads';
import { WorkerThreadClientConnection, wrapBackgroundService, WrappedObject } from '../../src';
import { Calculator } from '../shared/calculator';

function create(): [WrappedObject<Calculator>, Worker] {
  const workerThread = new Worker(`
  const wk = require('worker_threads');
  require('ts-node').register();
  const file = wk.workerData.filename;
  require(file);
  `, {
    eval: true,
    workerData: {
      filename: './tests/nodejs/test-worker.ts'
    }
  });
  const workerConnection = new WorkerThreadClientConnection(workerThread);

  return [wrapBackgroundService<Calculator>(workerConnection), workerThread];
}

describe('NodeJS', function() {
  let calculator: WrappedObject<Calculator>;
  let worker: Worker;

  beforeEach(function() {
    [calculator, worker] = create();
  })

  it('should invoke normal (non-promise) methods', async function() {
    const result = await calculator.add(1, 2);
    expect(result).to.equal(3);
  });

  it('should invoke promise methods', async function() {
    const result = await calculator.addUsingPromise(3, 4);
    expect(result).to.equal(7);
  });

  it('should invoke methods with "complex" type arguments', async function() {
    const result = await calculator.addAll([1, 2, 3, 4]);
    expect(result).to.equal(10);
  });

  afterEach(function() {
    return worker.terminate();
  })
});
