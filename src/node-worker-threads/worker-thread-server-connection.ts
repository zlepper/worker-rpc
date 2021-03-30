import { CrossInvocation, CrossInvocationResult } from '../shared/cross-invocation.js';
import { WorkerServerConnection } from '../worker/worker-server-connection.js';
import { MessagePort } from 'worker_threads';

export class WorkerThreadServerConnection implements WorkerServerConnection {
  constructor(private parent: MessagePort) {
  }

  private wrapperCallback?: (data: CrossInvocation) => void;

  addListener(callback: (data: CrossInvocation) => void): void {
    this.wrapperCallback = callback;
    this.parent.on('message', this.wrapperCallback);
  }

  removeListener(): void {
    if(this.wrapperCallback) {
      this.parent.off('message', this.wrapperCallback);
    }
    this.wrapperCallback = undefined;
  }

  send(message: CrossInvocationResult): void {
    this.parent.postMessage(message, null as any);
  }

}
