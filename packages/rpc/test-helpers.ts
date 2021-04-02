import { WorkerClientConnection } from './client';
import { CrossInvocation, CrossInvocationResult } from './shared';
import { WorkerServerConnection } from './worker';

class Pipe {
  private clientCallback: (message: CrossInvocationResult) => void;
  private serverCallback: (message: CrossInvocation) => void;

  sendToServer(message: CrossInvocation) {
    const raw = JSON.stringify(message);
    setTimeout(() => {
      const parsed = JSON.parse(raw);
      this.serverCallback?.(parsed);
    }, 1);
  }

  sendToClient(message: CrossInvocationResult) {
    const raw = JSON.stringify(message);
    setTimeout(() => {
      const parsed = JSON.parse(raw);
      this.clientCallback?.(parsed);
    }, 1);
  }

  registerClientCallback(callback: (message: CrossInvocationResult) => void) {
    this.clientCallback = callback;
  }

  registerServerCallback(callback: (message: CrossInvocation) => void) {
    this.serverCallback = callback;
  }
}

export class TestClientConnection implements WorkerClientConnection {
  constructor(private pipe: Pipe) {
  }

  addListener(callback: (data: CrossInvocationResult) => void): void {
    this.pipe.registerClientCallback(callback);
  }

  send(message: CrossInvocation): void {
    this.pipe.sendToServer(message);
  }
}

export class TestServerConnection implements WorkerServerConnection {
  constructor(private pipe: Pipe) {
  }

  addListener(callback: (data: CrossInvocation) => void): void {
    this.pipe.registerServerCallback(callback);
  }

  removeListener(): void {
    this.pipe.registerServerCallback(null);
  }

  send(message: CrossInvocationResult): void {
    this.pipe.sendToClient(message);
  }

}

export function createTestConnection(): {client: TestClientConnection, server: TestServerConnection} {
  const pipe = new Pipe();
  const client = new TestClientConnection(pipe);
  const server = new TestServerConnection(pipe);

  return {client, server};
}
