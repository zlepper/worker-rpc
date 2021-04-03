import { CrossInvocation, CrossInvocationResult, FunctionArguments } from '../shared/cross-invocation.js';
import { WorkerClientConnection } from './worker-client-connection.js';

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
    const listener = this.listeners.get(result.refId);

    if (listener) {
      listener(result);
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

  get<TPropertyName extends keyof T>(_target: T, propertyName: TPropertyName): any {
    return (...args: FunctionArguments<T[TPropertyName]>) => {
      return new Promise((resolve, reject) => {
        const message: CrossInvocation<T, TPropertyName> = {
          propertyName,
          args,
          refId: this.refId++,
        };

        const cleanup = this.pipe.addListener(message.refId, result => {
          if (result.success) {
            resolve(result.result);
          } else {
            reject(result.error);
          }
          cleanup();
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

export type WrappedObject<T> = {
  readonly [property in keyof T as T[property] extends Function ? property : never]: AsyncProperty<T[property]>;
};

export function wrapBackgroundService<T extends object>(workerConnection: WorkerClientConnection): WrappedObject<T> {
  const wrapper = new BackgroundWrapper<T>(workerConnection);

  const proxiedWrapper = new Proxy({} as T, (wrapper as any) as ProxyHandler<T>);

  return proxiedWrapper as WrappedObject<T>;
}
