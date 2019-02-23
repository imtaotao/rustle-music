export type Singer = {name: string}
export interface Song {
  id: number
  name: string
  al?: Singer
  album?: Singer
  ar: Singer[]
  artists?: Singer[]
  dt?: string | number
  duration?: number
}

export type PlayMode = 'cycle' | 'song-cycle' | 'random'