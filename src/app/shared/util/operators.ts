import { map, OperatorFunction } from 'rxjs';

export function mapIsDefined<T>(): OperatorFunction<unknown, boolean> {
    return map((source) => source !== undefined);
}
