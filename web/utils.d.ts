export declare function macOs(): boolean;
export declare function windows(): boolean;
export declare function enter(e: KeyboardEvent, cb: Function): void;
export declare function notice(msg: any, type?: string, time?: number): void;
export declare function filterCount(n: number): string | number;
export declare function random(max?: number, min?: number, fractionDigits?: number): string;
export declare function getDuration(time: number): string;
export declare function timestampToTime(timestamp: number): {
    year: number;
    month: number;
    day: number;
    hour: number;
    min: number;
    sec: number;
};
