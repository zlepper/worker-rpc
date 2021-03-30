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

  public myProp: string = 'foo';
}
