declare class SongManager {
    cached: boolean;
    ids: Set<any>;
    cache(fn: (fn: Function) => number[]): void;
    addCacheId(id: number): void;
    removeCacheId(id: number): void;
    cleanCache(): void;
    has(id: number): boolean;
}
declare const s: SongManager;
export default s;
