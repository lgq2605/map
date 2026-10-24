import { lazy, Suspense, useState } from 'react'
import LocationPanel from '../components/LocationPanel'
import { StreetViewFrame, svBox, svBtn, svLink, svPos } from '../components/StreetView'
import { nguyenDu } from '../data/nguyenDu'
import { SV_SCHOOL } from '../data/geo'

// Mô hình 3D (three.js) tải lười: chỉ tải khi người xem mở tab 3D
const School3D = lazy(() => import('../components/School3D'))
type Tab = '3d' | 'sv'

// Trường THCS và THPT Trần Đại Nghĩa: bảng lịch sử + 2 nút nổi (không tự bật):
// 🧊 Mô hình 3D của trường (xoay quanh / "đi vào" sân trường) và 👁️ Street View tại vị trí trường.
export default function NguyenDuScene({ onBack, onStep }: { onBack: () => void; onStep?: (step: number) => void }) {
  const [tab, setTab] = useState<Tab | null>(null)
  const [inside, setInside] = useState(false)
  const pick = (t: Tab | null) => { setTab(t); setInside(false) }
  const tabCls = (t: Tab) => 'rounded-full px-3 py-1.5 font-medium ' + (tab === t ? 'bg-slate-800 text-white' : 'text-slate-700 hover:bg-slate-100')
  return (
    <>
      <LocationPanel data={nguyenDu} onBack={onBack} onStep={onStep} />
      {tab ? (
        <div className={svPos + ' w-[calc(100%-1rem)] md:w-[min(560px,55vw)] ' + svBox}>
          <div className="flex gap-1 border-b border-slate-200 p-1.5 text-xs">
            <button onClick={() => pick('3d')} className={tabCls('3d')}>🧊 Mô hình 3D</button>
            <button onClick={() => pick('sv')} className={tabCls('sv')}>👁️ Street View</button>
          </div>
          <div className="relative h-44 md:h-80">
            {tab === '3d' ? (
              <>
                <Suspense fallback={<div className="grid h-full place-items-center bg-slate-100 text-sm text-slate-500">Đang dựng mô hình…</div>}>
                  <School3D mode={inside ? 'inside' : 'orbit'} />
                </Suspense>
                <button onClick={() => setInside(v => !v)} className="absolute bottom-2 left-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-800 shadow hover:bg-white">
                  {inside ? '↩ Quan sát toàn trường' : '🚶 Đi vào trong trường'}
                </button>
              </>
            ) : (
              <StreetViewFrame at={SV_SCHOOL.ll} heading={SV_SCHOOL.heading} title="Street View trường Trần Đại Nghĩa" className="h-full w-full" />
            )}
          </div>
          <div className="flex justify-between px-3 py-2 text-xs">
            {tab === 'sv'
              ? <a className="font-medium text-blue-700 underline" target="_blank" rel="noreferrer" href={svLink(SV_SCHOOL.ll, SV_SCHOOL.heading)}>Mở Street View ↗</a>
              : <span className="text-slate-500">{inside ? 'Kéo để nhìn quanh sân trường' : 'Kéo để xoay · cuộn/chụm để phóng to'}</span>}
            <button onClick={() => pick(null)} className="text-slate-600 hover:text-slate-900">✕ Đóng</button>
          </div>
        </div>
      ) : (
        <div className={svPos + ' flex gap-2'}>
          <button onClick={() => pick('3d')} className={svBtn}>🧊 Mô hình 3D</button>
          <button onClick={() => pick('sv')} className={svBtn}>👁️ Street View</button>
        </div>
      )}
    </>
  )
}
