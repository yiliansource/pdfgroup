import { Observable } from 'rxjs';

/**
 * An action that can be executed by the user.
 */
export interface Action<TContext = undefined, TParam = undefined, TResult = void> {
    /**
     * Can the action be executed?
     */
    produceCanExecute$(context: TContext): Observable<boolean>;
    /**
     * Executes the action using the given parameter.
     */
    execute(context: TContext, param: TParam): Promise<TResult>;
}
