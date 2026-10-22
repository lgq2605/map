export type Scene = 'earth' | 'menu' | 'hue' | 'du' | 'namky'
export interface Milestone { year: string; text: string; visual: string; image?: string; query?: string }
export interface Figure { name: string; lines: string[]; image?: string; query?: string }
export interface LocationData { title: string; milestones: Milestone[]; figure: Figure }
