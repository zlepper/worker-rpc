import {CrossInvocation, CrossInvocationResult} from '../shared';

/**
 * Wraps around the connection to the underlying worker
 */
export interface WorkerClientConnection {
  /**
   * Should serialize and send the message across to the worker
   */
  send(message: CrossInvocation): void;

  /**
   * Invoked to register the listener. The callback should be invoked whenever
   * there is new data from the underlying worker.
   */
  addListener(callback: (data: CrossInvocationResult) => void): void;
}
