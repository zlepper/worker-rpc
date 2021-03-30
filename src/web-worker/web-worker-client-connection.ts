import { CrossInvocation, CrossInvocationResult } from '../shared/cross-invocation.js';
import { WorkerClientConnection } from '../client/worker-client-connection.js';

export class WebWorkerClientConnection implements WorkerClientConnection {
  constructor(private worker: Worker) {
    this.worker.addEventListener('message', this.workerCallback);
  }

  private wrapperCallback?: (data: CrossInvocationResult) => void;

  private workerCallback = (ev: MessageEvent) => {
    if (this.wrapperCallback) {
      this.wrapperCallback(ev.data);
    }
  };

  addListener(callback: (data: CrossInvocationResult) => void): void {
    this.wrapperCallback = callback;
  }

  send(message: CrossInvocation): void {
    this.worker.postMessage(message);
  }
}
