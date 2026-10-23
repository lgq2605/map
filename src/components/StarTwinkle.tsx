import { useMemo } from 'react'
import { useFxBudget } from './useFxBudget'

// Sao nhấp nháy ngẫu nhiên phủ lên bầu trời (Scene 1). 30 sao desktop / 10 sao mobile.
// Thuần CSS: mỗi sao có thời lượng + độ trễ riêng; reduced-motion thì đứng yên (xem .fx-star trong index.css).
export default function StarTwinkle() {
  const { stars } = useFxBudget()
  const list = useMemo(() => Array.from({ length: stars }, () => ({
    left: Math.random() * 100, top: Math.random() * 100,
    size: 1 + Math.random() * 2.2, dur: 2.2 + Math.random() * 3.6, delay: -Math.random() * 5,
    gold: Math.random() < 0.3,
  })), [stars])
  return (
    <div aria-hidden="true" className="fx-layer">
      {list.map((s, i) => (
        <span key={i} className={'fx-star' + (s.gold ? ' gold' : '')}
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }} />
      ))}
    </div>
  )
}
