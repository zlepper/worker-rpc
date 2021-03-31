# RPC.ts (Better name would be lovely)

RPC.ts is a tiny library that makes it easier to deal with web-workers, or any other
kind of background thread in js/ts land. 

## Installation
```shell
npm install --save @zlepper/rpc.ts
```

## Usage

This sample shows how to implement a simple calculator that runs in a web-worker. 

Start by creating the actual class that has the logic that should be run in your worker:

`calculator.ts`:
```ts
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

`worker.ts`
```ts
import { startWorkerProvider, WebWorkerServerConnection } from '@zlepper/rpc.ts';
import { Calculator } from './calculator';

const connection = new WebWorkerServerConnection();
startWorkerProvider(new Calculator(), connection);
```

Lastly in your main thread: Start the worker and connect to it:

`main.ts`

```ts
import { Calculator } from './calculator';
import { wrapBackgroundService, WebWorkerClientConnection } from '@zlepper/rpc.ts';

const worker = new Worker('worker.ts', {
  type: 'module'
});
const connection = new WebWorkerClientConnection(worker);

const wrapper = wrapBackgroundService<Calculator>(connection);

console.log(await wrapper.add(1, 2)); // Logs '3'
console.log(await wrapper.subtract(2, 1)); // Logs '1'
```

A couple of things to notice:
* All methods returning primitive values (Aka, values not already in a `Promise`) will be wrapped
  in promises in the main code, since the entire process is async.
* Types are maintained across the call boundary, so if you provided `number` and expect to get `number`
  back, that is what will happen.
* If you are using TypeScript (As the samples above do), you will get strong type information about what
  methods are actually available, with the correct return type (promises wrapped if not already).
  
### Questions
Questions you are probably asking yourself right now. 

#### How do I do actual async work in my worker?
Return a `Promise`, and we will automatically wait for it to resolve, and then return the actual 
resolved value. If your Promise rejects, or the method throws an error, we pass that back to the client
and reject the promise there.

#### Why the whole "connection" part? 
The library supports other ways of using "workers" than just web workers. e.g., `worker_threads` from node.js. 
Additionally, it is possible to plug your own connection implementation, fx to allow usage of WebSockets to communicate
with a web server. 

#### How to I stop the connection when I want to get rid of it?
Just `.terminate()` the worker, or equivalent with whatever connection library you are using.


#### How does it work?
On the "client-side" we are using a `Proxy` to intercept all getters, and then replacing the result
with a custom function. This function then passes a message through the `connection`. 
On the worker side we simply receive the events send from the client, and invokes the underlying
functions on the actual object provided to `startWorkerProvider`. 

## Limitations
This just sounds too good to be true? Yes it is, there are certain limitations that has to be
obeyed for everything to keep working.

* Only functions calls are available right now. Getters and setters will be removed from the type definition
  in TypeScript. If you are not using typescript, they will error at runtime.
* Callbacks or streamed results is currently not supported. I'm considering using rxjs to allow for multiple
  result values, however the current version does not support that.
* Due to the usage of [`Proxy`](https://caniuse.com/proxy) this library does not work with IE11, but requires
  a modern browser. 
