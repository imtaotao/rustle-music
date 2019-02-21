import * as I from './type';
import Event from 'web/share/event';
declare class RuntimeManager extends Event {
    playlist: I.Song[];
    current: I.Song;
    addlist: Set<any>;
    started: boolean;
    mode: I.PlayMode;
    Hearken: any;
    push(item: I.Song): boolean;
    pushList(listname: string | number, list: I.Song[]): boolean;
    clear(): boolean;
    replaceAll(list: I.Song[]): boolean;
    specifiedPlay(item: I.Song | number): void;
    next(): boolean;
    previous(): boolean;
    randomPlay(): boolean;
    setMode(mode: I.PlayMode): void;
    private toStartNewSong;
    private getSongDetailInfo;
    private findCurrentIndex;
}
declare const Runtime: RuntimeManager;
export default Runtime;
