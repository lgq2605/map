// Nhạc nền và âm thanh trống trận tạo bằng Web Audio API: không cần file mp3, không lo bản quyền.
let ctx: AudioContext | null = null
let master: GainNode
let timer: number | undefined
let on = false
const subs = new Set<() => void>()
const PENTA = [293.66, 329.63, 369.99, 440, 493.88, 587.33, 659.25] // D–E–F#–A–B: âm giai ngũ cung

function init() {
  if (ctx) return
  ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  master = ctx.createGain(); master.gain.value = 0
  const delay = ctx.createDelay(); delay.delayTime.value = 0.45
  const fb = ctx.createGain(); fb.gain.value = 0.4
  delay.connect(fb); fb.connect(delay)
  master.connect(ctx.destination); master.connect(delay); delay.connect(ctx.destination)
  for (const f of [73.42, 110]) {
    const o = ctx.createOscillator(); o.frequency.value = f
    const g = ctx.createGain(); g.gain.value = 0.12
    o.connect(g); g.connect(master); o.start()
  }
  document.addEventListener('visibilitychange', () => { document.hidden ? ctx?.suspend() : on && ctx?.resume() })
}

function pluck() {
  const c = ctx!, t = c.currentTime
  const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = PENTA[Math.floor(Math.random() * PENTA.length)]
  const g = c.createGain()
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + 2.4)
  o.connect(g); g.connect(master); o.start(t); o.stop(t + 2.5)
}

export function setMusic(v: boolean) {
  init()
  const c = ctx!
  on = v
  if (v) c.resume()
  master.gain.cancelScheduledValues(c.currentTime)
  master.gain.linearRampToValueAtTime(v ? 0.5 : 0, c.currentTime + 1)
  clearInterval(timer)
  if (v) { pluck(); timer = window.setInterval(() => { if (Math.random() < 0.75) pluck() }, 1400) }
  subs.forEach(f => f())
}

export function drum() {
  if (!on || !ctx) return
  const c = ctx
  for (let i = 0; i < 3; i++) {
    const t = c.currentTime + i * 0.45
    const o = c.createOscillator(); o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.4)
    const g = c.createGain(); g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.45)
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.5)
  }
}

export const isMusicOn = () => on
export const subscribeMusic = (f: () => void) => { subs.add(f); return () => { subs.delete(f) } }

