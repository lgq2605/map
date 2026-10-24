import { useSyncExternalStore } from 'react'
import { isMusicOn, isSfxOn, setMusic, setSfx, subscribeMusic } from '../audio'
import Tooltip from './Tooltip'

// Điều khiển âm thanh (góc dưới trái; điện thoại ở góc trên trái). Mặc định TẮT cả nhạc nền lẫn SFX.
// Nút lớn: nhạc nền ambient (icon sóng âm nhảy khi bật). Nút "SFX": hiệu ứng chuyển cảnh / mở hồ sơ / bấm marker.
export default function MusicButton() {
  const on = useSyncExternalStore(subscribeMusic, isMusicOn)
  const sfx = useSyncExternalStore(subscribeMusic, isSfxOn)
  return (
    <div className="flex items-center gap-2">
      <Tooltip label={on ? 'Tắt nhạc nền' : 'Bật nhạc nền'} pos="right">
        <button onClick={() => setMusic(!on)} aria-label={on ? 'Tắt nhạc' : 'Bật nhạc'} aria-pressed={on} className="glass-pill grid min-h-11 min-w-11 place-items-center rounded-full">
          <span className={'wave ' + (on ? 'on' : '')} aria-hidden="true"><i /><i /><i /><i /></span>
        </button>
      </Tooltip>
      <Tooltip label={sfx ? 'Tắt hiệu ứng âm thanh' : 'Bật hiệu ứng âm thanh'} pos="right">
        <button onClick={() => setSfx(!sfx)} aria-label={sfx ? 'Tắt hiệu ứng âm thanh' : 'Bật hiệu ứng âm thanh'} aria-pressed={sfx}
          className={'glass-pill grid h-9 min-w-9 place-items-center rounded-full px-2 font-display text-[10px] font-bold tracking-wider ' + (sfx ? 'text-gold' : 'text-paper/60')}>SFX</button>
      </Tooltip>
    </div>
  )
}
