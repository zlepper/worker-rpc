import { Calculator, integrationTests } from '@zlepper/testing';
import { expect } from 'chai';
import { wrapBackgroundService, WrappedObject } from '../client/worker-consumer.js';
import { createTestConnection } from '../test-helpers.js';
import { startWorkerProvider } from '../worker/worker-provider.js';

function create(): WrappedObject<Calculator> {
  const { client, server } = createTestConnection();

  startWorkerProvider(new Calculator(), server);
  return wrapBackgroundService<Calculator>(client);
}

describe('basic tests', () => {
  let calculator: WrappedObject<Calculator>;

  before(() => {
    calculator = create();
  });

  integrationTests(() => calculator);

  it('should allow access to class properties on the underlying object', async function () {
    let lastCount = 0;
    calculator.addEventListener('count-changed', c => {
      lastCount = c;
    });

    expect(await calculator.increment()).to.equal(1);
    expect(await calculator.increment()).to.equal(2);
    expect(await calculator.increment()).to.equal(3);
    await calculator.resetCount();
    expect(await calculator.increment()).to.equal(1);
    expect(lastCount).to.equal(1);
  });
});
