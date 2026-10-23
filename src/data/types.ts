export type Scene = 'earth' | 'menu' | 'hcm' | 'hue' | 'du' | 'namky'
export interface Milestone { year: string; text: string; visual: string; image?: string; query?: string | string[] }
export interface Figure { name: string; lines: string[]; image?: string; query?: string | string[] }
export interface LocationData { title: string; milestones: Milestone[]; figure: Figure }
