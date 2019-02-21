declare module "*.grs" {
    const _default: any;
    export default _default;
}
declare type Cookie = {
    Expires: number;
    MUSIC_U: string;
    __csrf: string;
    __remember_me: string;
};
declare type RequestResponse = {
    status: number;
    body: any;
};
interface Window {
    onNetworkError: () => void;
    node: {
        request: (router: string, body?: Object) => Promise<RequestResponse>;
        getCookie: () => Cookie | null;
        setCookie: (cookie: Cookie) => void;
        clearCookie: () => void;
    };
}
declare var window: Window;
