import { Calculator } from '@zlepper/calculator';
import { wrapBackgroundService, WrappedObject } from '../client/worker-consumer.js';
import { createTestConnection } from '../test-helpers.js';
import { expect } from 'chai';
import { startWorkerProvider } from '../worker/worker-provider.js';

function create(): WrappedObject<Calculator> {
  const { client, server } = createTestConnection();

  startWorkerProvider(new Calculator(), server);
  return wrapBackgroundService(client);
}

describe('basic tests', () => {
  let calculator: WrappedObject<Calculator>;

  before(() => {
    calculator = create();
  });

  it('should invoke normal (non-promise) methods', async function () {
    const result = await calculator.add(1, 2);
    expect(result).to.equal(3);
  });

  it('should invoke promise methods', async function () {
    const result = await calculator.addUsingPromise(3, 4);
    expect(result).to.equal(7);
  });

  it('should invoke methods with "complex" type arguments', async function () {
    const result = await calculator.addAll([1, 2, 3, 4]);
    expect(result).to.equal(10);
  });
});
