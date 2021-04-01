export class Calculator {
  public add(a: number, b: number): number {
    return a + b;
  }

  public addUsingPromise(a: number, b: number): Promise<number> {
    return new Promise<number>(resolve => resolve(a + b));
  }

  public addAll(numbers: number[]): number {
    let sum = 0;
    numbers.forEach(n => {
      sum += n;
    });

    return sum;
  }
}
