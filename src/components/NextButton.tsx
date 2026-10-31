import { ArrowRight } from './Icons'

// Nút "Tiếp theo" / "Xem nhân vật": nút viên thuốc phẳng, chữ + mũi tên nhỏ, không animation.
export default function NextButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-paper/40 bg-white/10 px-5 py-2 text-sm font-semibold text-paper transition-colors hover:border-gold hover:bg-white/15 hover:text-gold">
      {label}
      <ArrowRight width={16} height={16} />
    </button>
  )
}
