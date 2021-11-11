export class Cache<T = any, K = string | symbol> {
    private _cacheLookup = new Map<K, T>();

    public constructor() {}

    public get(key: K) {
        return this._cacheLookup.get(key);
    }
    public has(key: K) {
        return this._cacheLookup.has(key);
    }
    public store(key: K, value: T) {
        this._cacheLookup.set(key, value);
    }
}
