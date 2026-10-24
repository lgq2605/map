import { useSyncExternalStore } from 'react'
import { isMusicOn, setMusic, subscribeMusic } from '../audio'
import Tooltip from './Tooltip'
import { SpeakerIcon } from './Icons'

// Nút nhạc nền (góc dưới trái; điện thoại ở góc trên trái). Mặc định TẮT. Hình cái loa + các cột âm thanh (chỉ nhảy khi nhạc đang bật).
export default function MusicButton() {
  const on = useSyncExternalStore(subscribeMusic, isMusicOn)
  return (
    <Tooltip label={on ? 'Tắt nhạc nền' : 'Bật nhạc nền'} pos="right">
      <button onClick={() => setMusic(!on)} aria-label={on ? 'Tắt nhạc' : 'Bật nhạc'} aria-pressed={on} className="glass-pill flex min-h-11 items-center gap-2 rounded-full px-3.5">
        <SpeakerIcon className="flex-none text-gold" width={22} height={22} />
        <span className={'wave ' + (on ? 'on' : '')} aria-hidden="true"><i /><i /><i /><i /></span>
      </button>
    </Tooltip>
  )
}
