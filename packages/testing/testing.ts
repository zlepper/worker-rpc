import { expect } from 'chai';

interface PromisedCalculator  {
  add(a: number, b: number): Promise<number>;

  addUsingPromise(a: number, b: number): Promise<number>;

  addAll(numbers: number[]): Promise<number>;

  increment(): Promise<number>;
  resetCount(): Promise<number>;

  addEventListener(type: 'count-changed', listener: (data: number) => void): void;
}

async function sleep(ms: number) {
  // @ts-ignore
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function integrationTests(getCalculator: () => PromisedCalculator) {

  it('should invoke normal (non-promise) methods', async function() {
    const result = await getCalculator().add(1, 2);
    expect(result).to.equal(3);
  });

  it('should invoke promise methods', async function() {
    const result = await getCalculator().addUsingPromise(3, 4);
    expect(result).to.equal(7);
  });

  it('should invoke methods with "complex" type arguments', async function() {
    const result = await getCalculator().addAll([1, 2, 3, 4]);
    expect(result).to.equal(10);
  });


  it('passes along events', async function () {
    let lastEventValueReceived = -1;
    getCalculator().addEventListener('count-changed', value => {
      lastEventValueReceived = value;
    });
    await getCalculator().increment();
    await sleep(1);
    expect(lastEventValueReceived).to.equal(1);
    await getCalculator().increment();
    await sleep(1);
    expect(lastEventValueReceived).to.equal(2);
    await getCalculator().resetCount();
    await sleep(1);
    expect(lastEventValueReceived).to.equal(0);
  });
}
