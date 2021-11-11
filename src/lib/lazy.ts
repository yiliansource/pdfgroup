type LazyFactory<T> = () => T;

export class Lazy<T> {
    public get current() {
        if (!this._current) this._current = this.factory();
        return this._current;
    }

    private _current: T | null = null;

    public constructor(public factory: LazyFactory<T>) {}
}
