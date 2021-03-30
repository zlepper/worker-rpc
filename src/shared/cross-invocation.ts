export type FunctionArguments<TProperty> = TProperty extends (...args: infer TArgs) => any ? TArgs : `Property is not a functions`[];

export interface CrossInvocation<T extends object, TPropertyName extends keyof T> {
  refId: number;
  propertyName: TPropertyName;
  args: FunctionArguments<T[TPropertyName]>;
}

export interface FailedCrossInvocationResult {
  refId: number;
  success: false;
  error: any;
}

export interface SuccessfulCrossInvocationResult<T extends object, TPropertyName extends keyof T> {
  refId: number;
  success: true;
  result: T[TPropertyName];
}

export type CrossInvocationResult<T extends object, TPropertyName extends keyof T> =
  | FailedCrossInvocationResult
  | SuccessfulCrossInvocationResult<T, TPropertyName>;
