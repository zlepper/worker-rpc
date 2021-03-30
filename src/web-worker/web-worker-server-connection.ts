import { CrossInvocation, CrossInvocationResult } from '../shared/cross-invocation.js';
import { WorkerServerConnection } from '../worker/worker-server-connection.js';

export class WebWorkerServerConnection implements WorkerServerConnection {
  private wrapperCallback?: (data: CrossInvocation) => void;

  private workerListener = (ev: MessageEvent) => {
    if(this.wrapperCallback) {
      this.wrapperCallback(ev.data);
    }
  }

  addListener(callback: (data: CrossInvocation) => void): void {
    this.wrapperCallback = callback;
    addEventListener('message', this.workerListener);
  }

  removeListener(): void {
    removeEventListener('message', this.workerListener);
  }

  send(message: CrossInvocationResult): void {
    postMessage(message, null as any);
  }

}
