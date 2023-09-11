import { CrossInvocation, CrossInvocationResult, FunctionArguments } from '../shared/cross-invocation.js';
import { WorkerClientConnection } from './worker-client-connection.js';
import { AddEventListenerOptions, IEventDispatcher, InferEvent, NormalizedEventTarget } from "../shared/normalized-event-target";

type ResultListener<T extends object, TPropertyName extends keyof T> = (result: CrossInvocationResult<T, TPropertyName>) => void;
type Cleanup = () => void;

class EventPipe {

  private listeners: Map<number, ResultListener<any, any>> = new Map();

  public addListener<T extends object, TPropertyName extends keyof T>(refId: number, listener: ResultListener<T, TPropertyName>): Cleanup {
    this.listeners.set(refId, listener);

    return () => {
      this.listeners.delete(refId);
    };
  }

  public emit(result: CrossInvocationResult<any, any>) {
    if(result.kind === 'message') {
      const listener = this.listeners.get(result.refId);

      if (listener) {
        listener(result);
      }
    } else {
      const eventListeners = this._eventListeners.get(result.type);
      if(eventListeners) {
        for (let listener of eventListeners) {
          listener(result.data);
        }
      }
    }
  }

  private _eventListeners = new Map<string, Set<(data: unknown) => void>>();

  addEventListener(type: string, listener: (data: unknown) => void, _options?: AddEventListenerOptions): void {
    const listeners = this._eventListeners.get(type);
    if(!listeners) {
      const newListeners = new Set<(data: unknown) => void>();
      newListeners.add(listener);
      this._eventListeners.set(type, newListeners);
    } else {
      listeners.add(listener);
    }
  }

  removeEventListener(type: string, listener?: (data: unknown) => void): void {
    const listeners = this._eventListeners.get(type);
    if(!listeners) {
      return;
    }
    if(listener) {
      listeners.delete(listener);
    } else {
      this._eventListeners.delete(type);
    }
  }
}


class BackgroundWrapper<T extends object> {
  private refId: number = 1;
  private pipe = new EventPipe();

  constructor(private workerConnection: WorkerClientConnection) {
    workerConnection.addListener(data => {
      this.pipe.emit(data);
    });
  }

  get<TPropertyName extends keyof T>(_target: (T|T&NormalizedEventTarget<unknown>), propertyName: TPropertyName): any {
    if(propertyName === 'addEventListener') {
      return (type: string, listener: (data: unknown) => void, options?: AddEventListenerOptions) => {
        this.pipe.addEventListener(type, listener, options);
      }
    } else if(propertyName === 'removeEventListener') {
      return (type: string, listener?: (data: unknown) => void) => {
        this.pipe.removeEventListener(type, listener);
      }
    }
    
    return (...args: FunctionArguments<T[TPropertyName]>) => {
      return new Promise((resolve, reject) => {
        const message: CrossInvocation<T, TPropertyName> = {
          propertyName,
          args,
          refId: this.refId++,
        };

        const cleanup = this.pipe.addListener(message.refId, result => {
          if (result.kind === 'message') {
            if (result.success) {
              resolve(result.result);
            } else {
              reject(result.error);
            }
            cleanup();
          } else {
            throw new Error('Got event result for a non-event invocation');
          }
        });

        this.workerConnection.send(message);
      });
    };
  }

  set(_target: T, _propertyName: PropertyKey, _vValue: any): boolean {
    throw new Error('`set` is not supported on wrapped objects');
  }

  deleteProperty(_target: T, _propertyName: PropertyKey): boolean {
    throw new Error('deleteProperty is not supported on wrapped objects');
  }

  ownKeys(_target: T): (string | symbol)[] {
    throw new Error('ownKeys is not supported on wrapped objects');
  }

  has(_target: T, _propertyName: PropertyKey): boolean {
    throw new Error('has is not supported on wrapped objects');
  }

  defineProperty(_target: T, _propertyName: PropertyKey, _oDesc: PropertyDescriptor): boolean {
    throw new Error('defineProperty is not supposed on wrapped objects');
  }

  getOwnPropertyDescriptor(_target: T, _propertyName: PropertyKey): undefined {
    throw new Error('getOwnPropertyDescriptor is not supported on background wrapped objects');
  }
}

export type AsyncProperty<T> = T extends (...args: infer TArgs) => infer TResult
  ? (...args: TArgs) => TResult extends Promise<any> ? TResult : Promise<TResult>
  : Promise<T>;

export type WrappedObject<T> = T extends IEventDispatcher<infer TEvent>
  ? {
      readonly [property in keyof Omit<T, 'dispatchEvent'> as T[property] extends Function ? property : never]: AsyncProperty<T[property]>;
    } &
      NormalizedEventTarget<TEvent>
  : {
      readonly [property in keyof T as T[property] extends Function ? property : never]: AsyncProperty<T[property]>;
    };

export function wrapBackgroundService<T extends object | IEventDispatcher<TEvent>, TEvent extends object = InferEvent<T>>(
  workerConnection: WorkerClientConnection
): WrappedObject<T> {
  const wrapper = new BackgroundWrapper<T>(workerConnection);

  const proxiedWrapper = new Proxy({} as T, (wrapper as any) as ProxyHandler<T>);

  return proxiedWrapper as unknown as WrappedObject<T>;
}
