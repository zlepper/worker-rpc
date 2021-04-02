export type FunctionArguments<TProperty> = TProperty extends (...args: infer TArgs) => any ? TArgs : `Property is not a functions`[];

export interface CrossInvocation<T extends object = any, TPropertyName extends keyof T = any> {
  readonly refId: number;
  readonly propertyName: TPropertyName;
  readonly args: FunctionArguments<T[TPropertyName]>;
}

export interface FailedCrossInvocationResult {
  readonly refId: number;
  readonly success: false;
  readonly error: any;
}

export interface SuccessfulCrossInvocationResult<T extends object, TPropertyName extends keyof T> {
  readonly refId: number;
  readonly success: true;
  readonly result: T[TPropertyName];
}

export type CrossInvocationResult<T extends object = any, TPropertyName extends keyof T = any> =
  | FailedCrossInvocationResult
  | SuccessfulCrossInvocationResult<T, TPropertyName>;
