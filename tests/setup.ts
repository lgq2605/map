import { vi } from 'vitest'
window.matchMedia = ((q: string) => ({ matches: true, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} })) as any
globalThis.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve({}) })) as any
Element.prototype.scrollTo = () => {}
const param = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, cancelScheduledValues() {} })
const node = () => ({ connect() {}, start() {}, stop() {}, gain: param(), frequency: param(), delayTime: param() })
;(window as any).AudioContext = class { currentTime = 0; destination = {}; createGain = node; createDelay = node; createOscillator = node; resume() { return Promise.resolve() } suspend() { return Promise.resolve() } }
