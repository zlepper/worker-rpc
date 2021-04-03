import { expect } from 'chai';

interface PromisedCalculator {
  add(a: number, b: number): Promise<number>;

  addUsingPromise(a: number, b: number): Promise<number>;

  addAll(numbers: number[]): Promise<number>;
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
}
