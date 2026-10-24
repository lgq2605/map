import LocationPanel from '../components/LocationPanel'
import StreetView from '../components/StreetView'
import { nguyenHue } from '../data/nguyenHue'
import { SV_HUE } from '../data/geo'

// Street View đặt đúng giữa phố đi bộ Nguyễn Huệ (xem SV_HUE trong data/geo.ts), không tự bật.
export default function NguyenHueScene({ onBack }: { onBack: () => void }) {
  return (
    <>
      <LocationPanel data={nguyenHue} onBack={onBack} />
      <StreetView at={SV_HUE.ll} heading={SV_HUE.heading} title="Street View đường Nguyễn Huệ" />
    </>
  )
}
