import { CrossInvocation, CrossInvocationResult } from '../shared/cross-invocation.js';
import { WorkerClientConnection } from '../client/worker-client-connection.js';

export class WorkerWorkerClientConnection implements WorkerClientConnection {
  constructor(private worker: Worker) {
    this.worker.addEventListener('message', this.workerCallback);
  }

  private wrapperCallback?: (data: CrossInvocationResult<any, any>) => void;

  private workerCallback = (ev: MessageEvent) => {
    if (this.wrapperCallback) {
      this.wrapperCallback(ev.data);
    }
  };

  addListener(callback: (data: CrossInvocationResult<any, any>) => void): void {
    this.wrapperCallback = callback;
  }

  send(message: CrossInvocation<any, any>): void {
    this.worker.postMessage(message);
  }
}
