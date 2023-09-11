import { EventDispatcher } from "@zlepper/rpc";

export interface CalculatorEvents {
  "count-changed": number;
}

export class Calculator extends EventDispatcher<CalculatorEvents> {
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

  private _currentValue = 0;

  public increment(): number {
    this._currentValue++;
    this.dispatchEvent("count-changed", this._currentValue);
    return this._currentValue;
  }

  public resetCount() {
    this._currentValue = 0;
    this.dispatchEvent("count-changed", this._currentValue);
    return this._currentValue;
  }
}
