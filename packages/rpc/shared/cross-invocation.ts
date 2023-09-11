export type FunctionArguments<TProperty> = TProperty extends (...args: infer TArgs) => any ? TArgs : `Property is not a function`[];

export interface CrossInvocation<T extends object = any, TPropertyName extends keyof T = any> {
  readonly refId: number;
  readonly propertyName: TPropertyName;
  readonly args: FunctionArguments<T[TPropertyName]>;
}

export interface FailedCrossInvocationResult {
  kind: 'message';
  readonly refId: number;
  readonly success: false;
  readonly error: any;
}

export interface SuccessfulCrossInvocationResult<T extends object, TPropertyName extends keyof T> {
  kind: 'message';
  readonly refId: number;
  readonly success: true;
  readonly result: T[TPropertyName];
}

export interface CrossEvent<TEvent extends object, TEventName extends keyof TEvent> {
  kind: 'event';
  readonly refId: -1;
  readonly type: TEventName;
  readonly data: TEvent[TEventName];
}

export type CrossInvocationResult<T extends object = any, TPropertyName extends keyof T = any, TEvent extends object = any, TEventName extends keyof TEvent = any> =
  | FailedCrossInvocationResult
  | SuccessfulCrossInvocationResult<T, TPropertyName>
  | CrossEvent<TEvent, TEventName>;
