import { CrossInvocation, CrossInvocationResult, WorkerServerConnection } from '@zlepper/rpc';
import { MessagePort } from 'worker_threads';

export class WorkerThreadServerConnection implements WorkerServerConnection {
  private wrapperCallback?: (data: CrossInvocation) => void;

  constructor(private parent: MessagePort) {}

  addListener(callback: (data: CrossInvocation) => void): void {
    this.wrapperCallback = callback;
    this.parent.on('message', this.wrapperCallback);
  }

  removeListener(): void {
    if (this.wrapperCallback) {
      this.parent.off('message', this.wrapperCallback);
    }
    this.wrapperCallback = undefined;
  }

  send(message: CrossInvocationResult): void {
    this.parent.postMessage(message, null as any);
  }
}
