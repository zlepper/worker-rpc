import { WrappedObject } from '../../src/client/worker-consumer.js';

export class MyClass {
  public sayHello(name: string): string {
    return 'hello ' + name;
  }

  public longRunningMethod(name: string, duration: number = 2000): Promise<string> {
    return new Promise<string>(resolve => {
      console.log('waiting ' + duration + 'ms');
      setTimeout(() => {
        resolve('delayed hello ' + name);
      }, duration);
    });
  }

  public toJson(o: any): string {
    return JSON.stringify(o);
  }
}

export function useMyClass(wrapper: WrappedObject<MyClass>, done?: () => void) {
  const result = wrapper.sayHello('Zlepper');

  result.then(r => {
    console.log({ result, r });
  });

  const longRunning = wrapper.longRunningMethod('Zlepper', 1500);

  longRunning.then(r => {
    console.log({ r, longRunning });
    done?.();
  });

  const asJson = wrapper.toJson({
    key: 'hello',
    nested: {
      v: 'a',
    },
  });

  asJson.then(json => {
    console.log({ json });
  });

}
