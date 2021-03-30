import {CrossInvocation, CrossInvocationResult} from "../shared/cross-invocation.js";

/**
 * Wraps around the connection to the underlying worker
 */
export interface WorkerServerConnection {
  /**
   * Should serialize and send the message across to the worker
   */
  send(message: CrossInvocationResult<any, any>): void;

  /**
   * Invoked to register the listener. The callback should be invoked whenever
   * there is new data from the underlying worker.
   */
  addListener(callback: (data: CrossInvocation<any, any>) => void): void;

  /**
   * Should remove the registered listener and stop listening for events
   */
  removeListener(): void;
}
