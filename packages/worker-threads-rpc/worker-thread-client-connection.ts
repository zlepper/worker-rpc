import { CrossInvocation, CrossInvocationResult, WorkerClientConnection } from '@zlepper/rpc';
import { Worker } from 'worker_threads';

export class WorkerThreadClientConnection implements WorkerClientConnection {
  constructor(private workerThread: Worker) {}

  addListener(callback: (data: CrossInvocationResult) => void): void {
    this.workerThread.on('message', callback);
  }

  send(message: CrossInvocation): void {
    this.workerThread.postMessage(message);
  }
}
