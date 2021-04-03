import { Calculator, integrationTests } from '@zlepper/testing';
import { wrapBackgroundService, WrappedObject } from '../client/worker-consumer.js';
import { createTestConnection } from '../test-helpers.js';
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

  integrationTests(() => calculator);
});
