import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import logo from '../assets/school-logo.png'

export type Mode = 'orbit' | 'inside'

// Mô hình 3D DỰNG TAY (không phải ảnh quét thật) của cơ sở 53 Nguyễn Du: toà nhà kiểu thuộc địa Pháp hình chữ U
// (khối mặt tiền + hai cánh ôm sân), mái ngói, sảnh giữa có đầu hồi, hành lang cột, sân trường có cột cờ, tường rào,
// cổng, cây xanh và các toà nhà phố xung quanh. Hướng: mặt tiền (đường Nguyễn Du) quay về +z. Đơn vị ≈ mét.
const CREAM = 0xf2dc9a, WHITE = 0xf8f3e4, ROOF = 0xa9462f, GLASS = 0x2d4a6b, WALL = 0xe9e1cf
const mats = new Map<number, THREE.MeshStandardMaterial>()
const mat = (c: number) => { let m = mats.get(c); if (!m) { m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 }); mats.set(c, m) } return m }

function box(w: number, h: number, d: number, c: number, x: number, y: number, z: number, shadow = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c))
  m.position.set(x, y, z); m.castShadow = shadow; m.receiveShadow = true
  return m
}
function cyl(r: number, h: number, c: number, x: number, y: number, z: number, r2 = r) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r2, r, h, 12), mat(c))
  m.position.set(x, y + h / 2, z); m.castShadow = true
  return m
}
// Mái đầu hồi (lăng trụ tam giác). ridge = hướng của đường nóc; span = bề ngang mái, len = chiều dài theo nóc.
function roof(span: number, len: number, h: number, x: number, y: number, z: number, ridge: 'x' | 'z', c = ROOF) {
  const s = new THREE.Shape(); s.moveTo(-span / 2, 0); s.lineTo(span / 2, 0); s.lineTo(0, h); s.closePath()
  const g = new THREE.ExtrudeGeometry(s, { depth: len, bevelEnabled: false }); g.translate(0, 0, -len / 2)
  const m = new THREE.Mesh(g, mat(c)); m.position.set(x, y, z); m.castShadow = true
  if (ridge === 'x') m.rotation.y = Math.PI / 2
  return m
}
const H = 12 // 3 tầng × 4 m
function block(g: THREE.Group, w: number, d: number, x: number, z: number, ridge: 'x' | 'z') {
  g.add(box(w, H, d, CREAM, x, H / 2, z), box(w + 0.4, 0.5, d + 0.4, WHITE, x, 0.25, z), box(w + 0.8, 0.5, d + 0.8, WHITE, x, H + 0.25, z))
  for (let f = 1; f < 3; f++) g.add(box(w + 0.3, 0.25, d + 0.3, WHITE, x, f * 4, z))
  g.add(ridge === 'x' ? roof(d + 1.6, w + 1.6, 3.6, x, H + 0.5, z, 'x') : roof(w + 1.6, d + 1.6, 3.6, x, H + 0.5, z, 'z'))
}
// Cửa sổ: một InstancedMesh cho kính + một cho gờ trên/dưới (nhẹ). spots: [x, y, z, xoay quanh trục y]
function windows(g: THREE.Group, spots: [number, number, number, number][]) {
  const glass = new THREE.InstancedMesh(new THREE.BoxGeometry(1.5, 2.3, 0.3), mat(GLASS), spots.length)
  const frame = new THREE.InstancedMesh(new THREE.BoxGeometry(2.1, 0.35, 0.5), mat(WHITE), spots.length * 2)
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, 1), up = new THREE.Vector3(0, 1, 0)
  spots.forEach(([x, y, z, ry], i) => {
    q.setFromAxisAngle(up, ry)
    glass.setMatrixAt(i, m.compose(new THREE.Vector3(x, y, z), q, s))
    frame.setMatrixAt(i * 2, m.compose(new THREE.Vector3(x, y + 1.3, z), q, s))
    frame.setMatrixAt(i * 2 + 1, m.compose(new THREE.Vector3(x, y - 1.25, z), q, s))
  })
  g.add(glass, frame)
}
function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h
  draw(cv.getContext('2d')!)
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace
  return t
}
function tree(g: THREE.Group, x: number, z: number, s = 1) {
  g.add(cyl(0.35 * s, 3.2 * s, 0x6b4a2b, x, 0, z))
  for (const [dy, r] of [[3.4, 2.6], [5.1, 1.9]] as const) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r * s, 14, 10), mat(0x3f7d3a)); m.position.set(x, dy * s, z); m.castShadow = true; g.add(m)
  }
}

function build() {
  const g = new THREE.Group()
  // nền: cỏ, sân bê tông (sân trường + sân trước), lối đi
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), mat(0xaebf93)); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; g.add(ground)
  g.add(box(68, 0.1, 74, 0xd9d2c1, 0, 0.05, -15, false), box(36, 0.12, 44, 0xcfc7b3, 0, 0.06, -29, false), box(6, 0.14, 16, 0xe4dcc9, 0, 0.07, 15, false))
  // khối mặt tiền (dài theo x) + hai cánh ôm sân (dài theo z) → hình chữ U, sân ở giữa
  block(g, 64, 14, 0, 0, 'x'); block(g, 14, 44, -25, -29, 'z'); block(g, 14, 44, 25, -29, 'z')
  // sảnh giữa nhô ra phía đường: đầu hồi, 4 cột, cửa vào, bảng tên, logo
  g.add(box(16, 15, 6, CREAM, 0, 7.5, 10), box(17, 0.6, 7, WHITE, 0, 15.3, 10), roof(17.6, 7.4, 4.6, 0, 15.6, 10, 'z', WHITE), box(9, 0.4, 3, WHITE, 0, 0.2, 14.5))
  for (const cx of [-6, -2, 2, 6]) g.add(cyl(0.55, 11, WHITE, cx, 0.4, 14.2))
  g.add(box(10, 0.7, 2, WHITE, 0, 11.7, 14.2), box(3.2, 4.6, 0.3, 0x3b2a1e, 0, 2.3, 13.1))
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(13.6, 1.5), new THREE.MeshBasicMaterial({ map: canvasTex(1024, 112, c => {
    c.fillStyle = '#0a2a5e'; c.fillRect(0, 0, 1024, 112); c.strokeStyle = '#ffcd00'; c.lineWidth = 6; c.strokeRect(5, 5, 1014, 102)
    c.fillStyle = '#fff'; c.font = 'bold 50px "Be Vietnam Pro", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'
    c.fillText('TRƯỜNG THCS VÀ THPT TRẦN ĐẠI NGHĨA', 512, 58)
  }) })); sign.position.set(0, 13.4, 13.12); g.add(sign)
  const emblem = new THREE.Mesh(new THREE.CircleGeometry(1.7, 32), new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(logo, t => { t.colorSpace = THREE.SRGBColorSpace }), transparent: true }))
  emblem.position.set(0, 16.9, 13.72); g.add(emblem)
  // cửa sổ (3 tầng): mặt trước, mặt sau (chỉ đoạn nhìn ra sân), hai mặt của mỗi cánh
  const spots: [number, number, number, number][] = []
  const face = (axis: 'x' | 'z', fixed: number, from: number, to: number, skip: (t: number) => boolean = () => false) => {
    for (let t = from; t <= to; t += 4) { if (skip(t)) continue; for (let f = 0; f < 3; f++) spots.push(axis === 'z' ? [t, f * 4 + 2.4, fixed, 0] : [fixed, f * 4 + 2.4, t, Math.PI / 2]) }
  }
  face('z', 7, -30, 30, t => Math.abs(t) < 10); face('z', -7, -18, 18)
  for (const sx of [-1, 1]) { face('x', sx * 32, -49, -9); face('x', sx * 18, -49, -9) }
  windows(g, spots)
  // hành lang cột dọc hai cánh (nhìn ra sân)
  for (const sx of [-1, 1]) {
    g.add(box(3.4, 0.35, 41, WHITE, sx * 16.3, 4, -29))
    for (let z = -49; z <= -9; z += 4) g.add(cyl(0.28, 4, WHITE, sx * 15, 0, z))
  }
  // cột cờ + cờ đỏ sao vàng giữa sân
  g.add(cyl(0.18, 14, 0xcfd3d8, 0, 0, -26, 0.12))
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.8), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: canvasTex(300, 200, c => {
    c.fillStyle = '#da251d'; c.fillRect(0, 0, 300, 200); c.fillStyle = '#ffcd00'; c.beginPath()
    for (let i = 0; i < 10; i++) { const r = i % 2 ? 24 : 60, a = -Math.PI / 2 + i * Math.PI / 5; c.lineTo(150 + r * Math.cos(a), 100 + r * Math.sin(a)) }
    c.closePath(); c.fill()
  }) })); flag.position.set(2.2, 12, -26); g.add(flag)
  // tường rào quanh khuôn viên, cổng chính ở giữa mặt đường
  g.add(box(29, 2.2, 0.5, WALL, -19.5, 1.1, 22), box(29, 2.2, 0.5, WALL, 19.5, 1.1, 22), box(0.5, 2.2, 74, WALL, -34, 1.1, -15), box(0.5, 2.2, 74, WALL, 34, 1.1, -15), box(68, 2.2, 0.5, WALL, 0, 1.1, -52))
  for (const sx of [-1, 1]) g.add(box(1.4, 3.8, 1.4, WHITE, sx * 5, 1.9, 22))
  g.add(box(8.6, 0.25, 0.25, 0x23262b, 0, 3.2, 22), box(8.6, 0.25, 0.25, 0x23262b, 0, 0.3, 22))
  for (let x = -4; x <= 4; x += 0.8) g.add(box(0.12, 3, 0.12, 0x23262b, x, 1.7, 22, false))
  // cây xanh: sân trước + dọc hai bên sân trường
  for (const [x, z, s] of [[-14, 17, 1.1], [14, 17, 1.1], [-26, 16, 1], [26, 16, 1], [-9, -12, 0.9], [9, -12, 0.9], [-9, -46, 1], [9, -46, 1], [0, -48, 1.2], [-30, -50, 1], [30, -50, 1], [-30, 17, 1], [30, 17, 1]] as const) tree(g, x, z, s)
  // nhà phố xung quanh (giả định, xếp ngẫu nhiên cố định) để thấy bối cảnh đô thị
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  const pastel = [0xd8c7b0, 0xc9d3dc, 0xe5d3c0, 0xcdbfae, 0xd9dccf]
  for (let i = 0; i < 46; i++) {
    const a = (i / 46) * Math.PI * 2, rad = 62 + rnd() * 55, w = 10 + rnd() * 14, d = 10 + rnd() * 14, h = 8 + rnd() * 34
    const x = Math.cos(a) * rad * 1.15, z = Math.sin(a) * rad - 14
    if (Math.abs(x) < 44 && z > -62 && z < 32) continue
    g.add(box(w, h, d, pastel[i % 5], x, h / 2, z))
  }
  return g
}

// Mô hình 3D tương tác: kéo để xoay, cuộn/chụm để phóng to. mode='inside' đưa camera vào giữa sân trường,
// ngang tầm mắt (kéo để nhìn quanh); mode='orbit' trở lại góc nhìn toàn trường.
export default function School3D({ mode }: { mode: Mode }) {
  const host = useRef<HTMLDivElement>(null)
  const go = useRef<((m: Mode) => void) | null>(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    const el = host.current
    if (!el) return
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true }) } catch { setErr(true); return }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5))
    renderer.shadowMap.enabled = true
    el.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'
    const sky = new THREE.Color(0xcfe3f5)
    const scene = new THREE.Scene(); scene.background = sky; scene.fog = new THREE.Fog(sky, 160, 460)
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a9a70, 1.1))
    const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(60, 90, 50); sun.castShadow = true
    Object.assign(sun.shadow.camera, { left: -90, right: 90, top: 90, bottom: -90, near: 10, far: 260 }); sun.shadow.mapSize.set(1024, 1024)
    scene.add(sun, build())
    const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 900)
    const ORBIT = { p: new THREE.Vector3(78, 50, 92), t: new THREE.Vector3(0, 6, -16) }
    const eye = new THREE.Vector3(0, 1.7, -44)
    const INSIDE = { p: eye, t: eye.clone().add(new THREE.Vector3(0, 3.3, -7 - eye.z).normalize().multiplyScalar(0.01)) }
    cam.position.copy(ORBIT.p)
    const ctl = new OrbitControls(cam, renderer.domElement)
    ctl.target.copy(ORBIT.t); ctl.enableDamping = true; ctl.maxPolarAngle = Math.PI / 2 - 0.03
    ctl.minDistance = 20; ctl.maxDistance = 240; ctl.autoRotate = true; ctl.autoRotateSpeed = 0.6
    ctl.addEventListener('start', () => { ctl.autoRotate = false })
    const fit = () => { const w = el.clientWidth || 1, h = el.clientHeight || 1; renderer.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix() }
    fit()
    const ro = new ResizeObserver(fit); ro.observe(el)
    renderer.setAnimationLoop(() => { ctl.update(); renderer.render(scene, cam) })

    let cur: Mode = 'orbit', tw: gsap.core.Tween | null = null
    go.current = (m: Mode) => {
      if (m === cur) return
      cur = m; tw?.kill()
      const to = m === 'inside' ? INSIDE : ORBIT, p0 = cam.position.clone(), t0 = ctl.target.clone(), k = { v: 0 }
      ctl.autoRotate = false; ctl.minDistance = 0.01; ctl.maxDistance = 1000
      tw = gsap.to(k, { v: 1, duration: 1.6, ease: 'power2.inOut',
        onUpdate: () => { cam.position.lerpVectors(p0, to.p, k.v); ctl.target.lerpVectors(t0, to.t, k.v) },
        onComplete: () => {
          if (m === 'inside') { ctl.minDistance = ctl.maxDistance = 0.01; ctl.enablePan = false; ctl.rotateSpeed = -0.35 } // nhìn quanh như người đứng tại chỗ
          else { ctl.minDistance = 20; ctl.maxDistance = 240; ctl.enablePan = true; ctl.rotateSpeed = 1 }
        } })
    }
    return () => {
      tw?.kill(); go.current = null; renderer.setAnimationLoop(null); ro.disconnect(); ctl.dispose()
      scene.traverse(o => {
        const m = o as THREE.Mesh, mt = m.material as THREE.MeshBasicMaterial | undefined
        m.geometry?.dispose?.()
        if (mt instanceof THREE.MeshBasicMaterial) { mt.map?.dispose(); mt.dispose() } // bảng tên/logo/cờ (vật liệu riêng)
      })
      renderer.dispose(); renderer.domElement.remove()
    }
  }, [])
  useEffect(() => { go.current?.(mode) }, [mode])

  if (err) return <div className="grid h-full place-items-center bg-slate-100 p-4 text-center text-sm text-slate-600">Thiết bị/trình duyệt này không hỗ trợ WebGL nên không hiện được mô hình 3D.</div>
  return <div ref={host} className="h-full w-full touch-none bg-sky-100" />
}
