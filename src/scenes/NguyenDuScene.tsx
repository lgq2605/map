import LocationPanel from '../components/LocationPanel'
import { nguyenDu } from '../data/nguyenDu'
export default function NguyenDuScene({ onBack }: { onBack: () => void }) {
  return <LocationPanel data={nguyenDu} onBack={onBack} />
}
