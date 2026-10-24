import LocationPanel from '../components/LocationPanel'
import { nguyenDu } from '../data/nguyenDu'
export default function NguyenDuScene({ onBack, onStep }: { onBack: () => void; onStep?: (step: number) => void }) {
  return <LocationPanel data={nguyenDu} onBack={onBack} onStep={onStep} />
}
