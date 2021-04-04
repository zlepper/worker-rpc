# @zlepper/web-worker-rpc

Provides a connection implementation for web-workers. 

## Installation
First install the library:
```shell
npm install --save @zlepper/rpc @zlepper/web-worker-rpc
```


## Usage

This sample shows how to implement a simple calculator that runs in a web-worker.

Start by creating the actual class that has the logic that should be run in your worker:

```ts
// calculator.ts
export class Calculator {
  public add(a: number, b: number): number {
    return a + b;
  }
  
  public subtract(a: number, b: number): number {
    return a - b;
  }
}
```

Next create the worker initialization code:

```ts
// worker.ts
import { startWorkerProvider } from '@zlepper/rpc';
import { WebWorkerServerConnection } from '@zlepper/web-worker-rpc';
import { Calculator } from './calculator';

// Create a wrapper around the connection. The specific wrapper class
// depends on which worker model you are using.
const connection = new WebWorkerServerConnection();
// Then provide the actual class you want to wrap.
startWorkerProvider(new Calculator(), connection);
```

Lastly in your main thread: Start the worker and connect to it:
```ts
// main.ts
import { Calculator } from './calculator';
import { wrapBackgroundService } from '@zlepper/rpc';
import { WebWorkerClientConnection } from '@zlepper/web-worker-rpc';

// First start the worker itself
const worker = new Worker('worker.ts', {
  type: 'module'
});
// Wrap the connection, the class is again specific to the worker model 
// you wish to use. 
const connection = new WebWorkerClientConnection(worker);

// Lastly access the wrapped "instance" of your class. 
const wrapper = wrapBackgroundService<Calculator>(connection);

console.log(await wrapper.add(1, 2)); // Logs '3'
console.log(await wrapper.subtract(2, 1)); // Logs '1'
```

Also check the full sample [here](/samples/web-worker-sample).
