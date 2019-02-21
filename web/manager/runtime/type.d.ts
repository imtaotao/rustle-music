export interface Song {
    id: number;
    name: string;
    al?: {
        name: string;
    };
    album?: {
        name: string;
    };
    ar?: {
        name: string;
    };
    artists?: {
        name: string;
    };
    dt?: string | number;
    duration?: number;
}
export declare type PlayMode = 'cycle' | 'song-cycle' | 'random';
