import { Observable } from 'rxjs';

/**
 * An action that can be executed by the action runner.
 */
export interface Action<P = unknown, R = void> {
    /**
     * Can the action be executed (in general)?
     */
    canExecute$: Observable<boolean>;

    /**
     * Executes the action using the given parameter.
     */
    execute(param: P): Promise<R>;
}

/**
 * An action with an entity context (e.g. a key that is used to refer to the entity) that can be executed
 * by the action runner.
 */
export interface EntityAction<K, P = unknown, R = void> {
    /**
     * Produces a 'canExecute$' observable for the given entity key. The returned observable indicates whether the
     * action can be performed in general.
     */
    produceCanExecute$(key: K): Observable<boolean>;

    /**
     * Executes the action for the given entity
     * @param key
     * @param param
     */
    execute(key: K, param: P): Promise<R>;
}
