import { useSyncExternalStore } from 'react'
import { isMusicOn, setMusic, subscribeMusic } from '../audio'
export default function MusicButton() {
  const on = useSyncExternalStore(subscribeMusic, isMusicOn)
  return (
    <button onClick={() => setMusic(!on)} aria-label={on ? 'Tắt nhạc' : 'Bật nhạc'} aria-pressed={on}
      className="min-h-11 min-w-11 rounded-full border border-gold bg-navy/80 text-lg backdrop-blur transition duration-200 hover:scale-105">{on ? '🔊' : '🔇'}</button>
  )
}
