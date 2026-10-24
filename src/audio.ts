// Nhạc nền và âm thanh trống trận tạo bằng Web Audio API: không cần file mp3, không lo bản quyền.
let ctx: AudioContext | null = null
let master: GainNode
let timer: number | undefined
let on = false
let sfxOn = false
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
  document.addEventListener('visibilitychange', () => { document.hidden ? ctx?.suspend() : (on || sfxOn) && ctx?.resume() })
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

// ───────── Hiệu ứng âm thanh (SFX): mặc định TẮT, bật riêng bằng nút SFX ─────────
// Mọi hàm đều tự thoát nếu SFX đang tắt, nên gọi ở đâu cũng an toàn.
export function setSfx(v: boolean) {
  init()
  sfxOn = v
  if (v) ctx!.resume()
  subs.forEach(f => f())
}
export const isSfxOn = () => sfxOn

function noise(c: AudioContext, dur: number) {
  const b = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate)
  const d = b.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const s = c.createBufferSource(); s.buffer = b
  return s
}
// Chuyển cảnh: tiếng "vút" (nhiễu lọc quét tần số)
export function whoosh() {
  if (!sfxOn || !ctx) return
  try {
    const c = ctx, t = c.currentTime
    const s = noise(c, 0.7), f = c.createBiquadFilter(), g = c.createGain()
    f.type = 'bandpass'; f.Q.value = 1.2
    f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(3200, t + 0.5)
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.16, t + 0.18); g.gain.exponentialRampToValueAtTime(0.001, t + 0.65)
    s.connect(f); f.connect(g); g.connect(c.destination); s.start(t); s.stop(t + 0.7)
  } catch { /* trình duyệt không hỗ trợ: bỏ qua */ }
}
// Mở hồ sơ nhân vật: tiếng giấy cuộn mở ra
export function unroll() {
  if (!sfxOn || !ctx) return
  try {
    const c = ctx, t = c.currentTime
    const s = noise(c, 0.9), f = c.createBiquadFilter(), g = c.createGain()
    f.type = 'highpass'; f.frequency.value = 1800
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.09, t + 0.1)
    for (let i = 1; i < 7; i++) g.gain.linearRampToValueAtTime(0.03 + Math.random() * 0.07, t + i * 0.11)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.85)
    s.connect(f); f.connect(g); g.connect(c.destination); s.start(t); s.stop(t + 0.9)
  } catch { /* bỏ qua */ }
}
// Bấm marker: tiếng "tích" nhỏ
export function tick() {
  if (!sfxOn || !ctx) return
  try {
    const c = ctx, t = c.currentTime
    const o = c.createOscillator(), g = c.createGain()
    o.type = 'sine'; o.frequency.setValueAtTime(1400, t); o.frequency.exponentialRampToValueAtTime(900, t + 0.06)
    g.gain.setValueAtTime(0.09, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.09)
  } catch { /* bỏ qua */ }
}
