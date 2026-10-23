import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Scene } from './data/types'
import EarthScene from './scenes/EarthScene'
import VietnamMapScene from './scenes/VietnamMapScene'
import BackToVietnamButton from './components/BackToVietnamButton'
import MusicButton from './components/MusicButton'

export default function App() {
  const [scene, setScene] = useState<Scene>('earth')
  return (
    <>
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
      <div className="fixed right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-40 flex gap-2">
        {/* Nút về bản đồ Việt Nam: hiện từ màn TP.HCM trở vào trong (màn menu đã là bản đồ Việt Nam) */}
        {scene !== 'earth' && scene !== 'menu' && <BackToVietnamButton onClick={() => setScene('menu')} />}
        <MusicButton />
      </div>
    </>
  )
}
