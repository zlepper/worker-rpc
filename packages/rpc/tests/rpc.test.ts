import { Calculator } from '@zlepper/calculator';
import { wrapBackgroundService, WrappedObject } from '../client';
import { createTestConnection } from '../test-helpers';
import { startWorkerProvider } from '../worker';

function create(): WrappedObject<Calculator> {
  const { client, server } = createTestConnection();

  startWorkerProvider(new Calculator(), server);
  return wrapBackgroundService(client);
}

describe('', () => {
  let calculator: WrappedObject<Calculator>;

  beforeAll(() => {
    calculator = create();
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
});
