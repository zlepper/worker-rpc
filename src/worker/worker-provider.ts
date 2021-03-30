import { CrossInvocation, FailedCrossInvocationResult, SuccessfulCrossInvocationResult } from '../shared/cross-invocation.js';
import {WorkerServerConnection} from "./worker-server-connection.js";

interface WorkerProviderRef {
  stop(): void;
  start(): void;
}

class WorkerProvider<T extends object> implements WorkerProviderRef {
  constructor(private target: T, private serverConnection: WorkerServerConnection) {
  }

  stop(): void {
    this.serverConnection.removeListener();
  }

  start(): void {
    this.serverConnection.addListener(data => this.handleInvocation(data));
  }

  private sendErrorResponse(invocation: CrossInvocation<any, any>, error: Error) {
    const errorMessage: FailedCrossInvocationResult = {
      refId: invocation.refId,
      success: false,
      error,
    };

    // Not entirely sure why typescript confuses the overload here, but i'm not going to think too much about it
    // this specific part is never exposed to the end consumer, so it should be safe to just "ignore"
    this.serverConnection.send(errorMessage);
  }

  private sendSuccessResponse<TPropertyName extends keyof T>(invocation: CrossInvocation<T, TPropertyName>, result: T[TPropertyName]) {
    const message: SuccessfulCrossInvocationResult<T, TPropertyName> = {
      refId: invocation.refId,
      result,
      success: true,
    };

    this.serverConnection.send(message);
  }

  private handleInvocation<TPropertyName extends keyof T>(invocation: CrossInvocation<T, TPropertyName>) {
    try {
      const prop = this.target[invocation.propertyName];
      if (typeof prop !== 'function') {
        this.sendErrorResponse(
          invocation,
          new Error(
            `Property ${invocation.propertyName} is not a function on the underlying worker objects. Did you use the correct type in both the Worker and main code?`
          )
        );
        return;
      }

      const result = prop(...invocation.args);

      Promise.resolve(result)
        .then(response => {
          this.sendSuccessResponse(invocation, response);
        })
        .catch(error => {
          this.sendErrorResponse(invocation, error);
        });
    } catch (e) {
      this.sendErrorResponse(invocation, e);
    }
  }
}

export function startWorkerProvider<T extends object>(target: T, serverConnection: WorkerServerConnection): WorkerProviderRef {
  const provider = createWorkerProvider(target, serverConnection);
  provider.start();
  return provider;
}

export function createWorkerProvider<T extends object>(target: T, serverConnection: WorkerServerConnection): WorkerProviderRef {
  return new WorkerProvider(target, serverConnection);
}
