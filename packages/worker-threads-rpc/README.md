# @zlepper/worker-threads-rpc

Provides a connection implementation for NodeJS' `worker_threads`. 

## Installation
First install the library:
```shell
npm install --save @zlepper/rpc @zlepper/worker-threads-rpc
```


## Usage

This sample shows how to implement a simple calculator that runs in a worker thread.

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
import { WorkerThreadServerConnection } from '@zlepper/worker-threads-rpc';
import { parentPort } from 'worker_threads';
import { Calculator } from './calculator';

// Check if we actually are in a worker thread. (Required to satisfy TypeScript strict null checks. 
// You can leave this out if you don't use TypeScript or don't have strict null checks enabled.
if (parentPort) {
// Create a wrapper around the connection. The specific wrapper class
// depends on which worker model you are using.
  const connection = new WorkerThreadServerConnection(parentPort);
// Then provide the actual class you want to wrap.
  startWorkerProvider(new Calculator(), connection);
}
```

Lastly in your main thread: Start the worker and connect to it:
```ts
// main.ts
import { wrapBackgroundService } from '@zlepper/rpc';
import { WorkerThreadClientConnection } from '@zlepper/worker-threads-rpc';
import { Worker } from 'worker_threads';
import { Calculator } from './calculator';

// First start the worker itself
const workerThread = new Worker('./worker.js');

// Wrap the connection, the class is again specific to the worker model 
// you wish to use. 
const connection = new WorkerThreadClientConnection(workerThread);

// Lastly access the wrapped "instance" of your class. 
const wrapper = wrapBackgroundService<Calculator>(connection);

console.log(await wrapper.add(1, 2)); // Logs '3'
console.log(await wrapper.subtract(2, 1)); // Logs '1'
```

Also check the full sample [here](/samples/nodejs-worker-threads).
