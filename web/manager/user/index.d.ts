import * as U from './type';
import Event from 'web/share/event';
declare class Login {
    Parent: UserManager;
    constructor(Parent: any);
    private saveRespose;
    private clearAutoLoginData;
    phone(phone: string, password: string, autoLogin: boolean): Promise<U.LoginData>;
    email(email: string, password: string, autoLogin: boolean): Promise<U.LoginData>;
}
declare class UserManager extends Event {
    logged: boolean;
    id: number | null;
    nickname: string;
    signature: string;
    avatarUrl: string;
    birthday: string;
    backgroundImgIdStr: string;
    login: Login;
    constructor();
    private init;
    private clearCacheData;
    private check;
    logout(): Promise<RequestResponse>;
    removeInfo(): void;
    getDetail(): any;
    getSubcount(): any;
    getSongList(): any;
    getSongListDetail(id: number): any;
}
declare const a: UserManager;
export default a;
