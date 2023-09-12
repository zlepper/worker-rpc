export interface AddEventListenerOptions {

}

export interface NormalizedEventTarget<TEvent> {
  addEventListener<K extends keyof TEvent>(type: K, listener: (data: TEvent[K]) => void, options?: AddEventListenerOptions): void;
  removeEventListener<K extends keyof TEvent>(type: K, listener?: (data: TEvent[K]) => void): void;

  /**
   * @private
   */
  ___typescriptInferenceHack: TEvent;
}

export interface IEventDispatcher<TEvent extends object> {
  dispatchEvent<K extends keyof TEvent>(type: K, data: TEvent[K]): void;

  /**
   * @private
   */
  ___typescriptInferenceHack: TEvent
}


export type InferEvent<T> = T extends IEventDispatcher<infer TEvent> ? TEvent : never;
