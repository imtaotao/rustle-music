export default class Queue {
    fx: Function[];
    init: boolean;
    lock: boolean;
    register(fn: Function): void;
    dispatch(data?: any): void;
    end(data?: any): void;
    remove(start: number, end?: number): void;
    clean(): void;
}
