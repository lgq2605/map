import { useSyncExternalStore } from 'react'
import { isMusicOn, setMusic, subscribeMusic } from '../audio'
import Tooltip from './Tooltip'

// Nút nhạc nền (góc dưới trái; điện thoại ở góc trên trái). Mặc định TẮT. Icon sóng âm chỉ nhảy khi nhạc đang bật.
export default function MusicButton() {
  const on = useSyncExternalStore(subscribeMusic, isMusicOn)
  return (
    <Tooltip label={on ? 'Tắt nhạc nền' : 'Bật nhạc nền'} pos="right">
      <button onClick={() => setMusic(!on)} aria-label={on ? 'Tắt nhạc' : 'Bật nhạc'} aria-pressed={on} className="glass-pill grid min-h-11 min-w-11 place-items-center rounded-full">
        <span className={'wave ' + (on ? 'on' : '')} aria-hidden="true"><i /><i /><i /><i /></span>
      </button>
    </Tooltip>
  )
}
