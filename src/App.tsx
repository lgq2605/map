import { useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import type { Scene } from './data/types'
import EarthScene from './scenes/EarthScene'
import VietnamMapScene from './scenes/VietnamMapScene'
import BackToVietnamButton from './components/BackToVietnamButton'
import MusicButton from './components/MusicButton'
import StarField from './components/StarField'
import ClickRipple from './components/ClickRipple'
import SceneTransition from './components/SceneTransition'

export default function App() {
  const [scene, setScene] = useState<Scene>('earth')
  return (
    // reducedMotion="user": người dùng bật "giảm chuyển động" thì framer-motion bỏ hiệu ứng dịch chuyển/phóng to
    <MotionConfig reducedMotion="user">
      {/* Nền sao chỉ chạy ở màn địa cầu; sang bản đồ thì tắt hẳn để bản đồ zoom mượt */}
      {scene === 'earth' && <StarField />}
      <AnimatePresence mode="wait">
        {scene === 'earth' ? (
          <motion.div key="earth" className="h-full" exit={{ opacity: 0, scale: 1.1 }}>
            <EarthScene onDone={() => setScene('menu')} />
          </motion.div>
        ) : (
          <motion.div key="map" className="h-full" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <VietnamMapScene scene={scene} setScene={setScene} />
          </motion.div>
        )}
      </AnimatePresence>
      <SceneTransition trigger={scene} />
      {/* Nút nổi luôn nằm trên mọi scene (z cao hơn lớp nhiễu hạt) */}
      <div className="fixed right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-[60] flex gap-2">
        {/* Nút về bản đồ Việt Nam: hiện từ màn TP.HCM trở vào trong (màn menu đã là bản đồ Việt Nam) */}
        {scene !== 'earth' && scene !== 'menu' && <BackToVietnamButton onClick={() => setScene('menu')} />}
      </div>
      {/* Âm thanh: góc dưới trái (điện thoại: góc trên trái để khỏi đè bảng nội dung phía dưới) */}
      <div className="fixed left-[max(0.75rem,env(safe-area-inset-left))] top-[max(1rem,env(safe-area-inset-top))] z-[60] md:bottom-[max(1rem,env(safe-area-inset-bottom))] md:left-4 md:top-auto">
        <MusicButton />
      </div>
      <ClickRipple />
    </MotionConfig>
  )
}
