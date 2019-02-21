declare const _default: {
    history: never[];
    routers: {};
    capacity: number;
    current: {
        val: null;
        data: null;
        index: number;
    };
    to(url: string, data: any, index?: number | undefined): void;
    register(url: string, fn: Function, forceDirect?: boolean): void;
    back(): void;
    forward(): void;
    canBack(): boolean;
    canForward(): boolean;
    _findCurrentIndex(): number | null;
};
export default _default;
