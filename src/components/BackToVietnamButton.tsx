export default function BackToVietnamButton({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="min-h-11 rounded-full border border-gold bg-navy/80 px-4 text-sm font-semibold text-gold backdrop-blur transition duration-200 hover:scale-105 md:text-base">🌏 Về Việt Nam</button>
}
