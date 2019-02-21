export default class Event {
    private listener;
    on(event: string, fn: Function): boolean;
    once(event: string, fn: Function): boolean;
    off(event: string, fn?: Function): boolean;
    offAll(): void;
    dispatch(event: string, data?: any): boolean;
}
