import LocationPanel from '../components/LocationPanel'
import StreetView from '../components/StreetView'
import { nguyenDu } from '../data/nguyenDu'
import { SV_SCHOOL } from '../data/geo'

// Trường THCS và THPT Trần Đại Nghĩa: bảng lịch sử + nút Street View tại vị trí trường (không tự bật).
export default function NguyenDuScene({ onBack, onStep }: { onBack: () => void; onStep?: (step: number) => void }) {
  return (
    <>
      <LocationPanel data={nguyenDu} onBack={onBack} onStep={onStep} />
      <StreetView at={SV_SCHOOL.ll} heading={SV_SCHOOL.heading} title="Street View trường Trần Đại Nghĩa" />
    </>
  )
}
