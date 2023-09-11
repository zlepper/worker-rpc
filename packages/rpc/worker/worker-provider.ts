import { CrossEvent, CrossInvocation, FailedCrossInvocationResult, SuccessfulCrossInvocationResult } from "../shared/cross-invocation.js";
import {WorkerServerConnection} from "./worker-server-connection.js";
import { IEventDispatcher, InferEvent } from "../shared/normalized-event-target";

interface WorkerProviderRef {
  stop(): void;
  start(): void;
}


// @ts-ignore
function isEventDispatcher<T extends object|EventDispatcher<TEvent>, TEvent extends object>(target: T): target is EventDispatcher<TEvent> {
  return '__initializeEventDispatcher' in target;

}


class WorkerProvider<TWorker extends object|EventDispatcher<TEvent>, TEvent extends object = InferEvent<TWorker>> implements WorkerProviderRef {
  constructor(private target: TWorker, private serverConnection: WorkerServerConnection) {
    if (isEventDispatcher<TWorker, TEvent>(target)) {
      target.__initializeEventDispatcher(this as any);
    }
  }

  stop(): void {
    this.serverConnection.removeListener();
  }

  start(): void {
    this.serverConnection.addListener(data => this.handleInvocation(data));
  }

  private sendErrorResponse(invocation: CrossInvocation<any, any>, error: any) {
    const errorMessage: FailedCrossInvocationResult = {
      kind: 'message',
      refId: invocation.refId,
      success: false,
      error,
    };

    // Not entirely sure why typescript confuses the overload here, but i'm not going to think too much about it
    // this specific part is never exposed to the end consumer, so it should be safe to just "ignore"
    this.serverConnection.send(errorMessage);
  }

  private sendSuccessResponse<TPropertyName extends keyof TWorker>(invocation: CrossInvocation<TWorker, TPropertyName>, result: TWorker[TPropertyName]) {
    const message: SuccessfulCrossInvocationResult<TWorker, TPropertyName> = {
      kind: 'message',
      refId: invocation.refId,
      result,
      success: true,
    };

    this.serverConnection.send(message);
  }

  sendEvent<TEventName extends keyof TEvent>(type: TEventName, data: TEvent[TEventName]) {
    const event: CrossEvent<TEvent, TEventName> = {
      refId: -1,
      kind: 'event',
      type,
      data
    };

    this.serverConnection.send(event);
  }

  private handleInvocation<TPropertyName extends keyof TWorker>(invocation: CrossInvocation<TWorker, TPropertyName>) {
    try {
      const prop = this.target[invocation.propertyName];
      if (typeof prop !== 'function') {
        this.sendErrorResponse(
          invocation,
          new Error(
            `Property ${String(invocation.propertyName)} is not a function on the underlying worker objects. Did you use the correct type in both the Worker and main code?`
          )
        );
        return;
      }

      const result = prop.apply(this.target, invocation.args);

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

export abstract class EventDispatcher<TEvent extends object> implements IEventDispatcher<TEvent> {

  /**
   * @internal
   */
  private __workerProvider: WorkerProvider<this, TEvent>|null = null;

  /**
   * @internal
   */
  __initializeEventDispatcher(provider: WorkerProvider<this, TEvent>): void {
    this.__workerProvider = provider;
  }

  public dispatchEvent<K extends keyof TEvent>(type: K, data: TEvent[K]): void {
    if(!this.__workerProvider) {
      throw new Error('Worker provider has not been initialized. Did you call dispatchEvent before passing the worker to the provider?');
    }

    this.__workerProvider.sendEvent(type, data);
  }
}
