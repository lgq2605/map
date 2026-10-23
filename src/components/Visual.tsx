import { useEffect, useState } from 'react'
import { useCommonsImage } from './useCommonsImage'

// `fit`: cách khớp ảnh vào khung — 'cover' lấp đầy khung (cắt bớt mép trên/dưới, dùng cho ảnh tư liệu
// phong cảnh); 'contain' thu cả ảnh vào trong khung, KHÔNG cắt mất phần nào (dùng cho chân dung nhân vật
// để hiện trọn vẹn hình dáng).
export default function Visual({ src, query, caption, top, fit = 'cover' }: { src?: string; query?: string | string[]; caption: string; top?: boolean; fit?: 'cover' | 'contain' }) {
  const { img, fail, canFail } = useCommonsImage(query, src)
  const [bad, setBad] = useState(false)
  useEffect(() => setBad(false), [img?.url])
  if (!img || bad) return <div className="rounded-xl border border-dashed border-paper/30 bg-white/5 p-4 text-sm italic text-paper/70">🖼️ {caption}</div>
  const fitCls = fit === 'contain' ? 'object-contain bg-navy/60' : top ? 'object-cover object-top' : 'object-cover'
  return (
    <figure className="overflow-hidden rounded-xl shadow-lg shadow-black/50">
      {/* Ảnh hỏng thì thử từ khoá dự phòng kế tiếp; hết dự phòng mới hiện khung chữ thay ảnh */}
      <img src={img.url} alt={caption} loading="lazy" onError={() => (canFail ? fail() : setBad(true))}
        className={'h-52 w-full transition duration-200 hover:scale-105 ' + fitCls} />
      <figcaption className="bg-black/40 px-3 py-1 text-xs text-paper/70">
        {caption}{img.page && <> · <a href={img.page} target="_blank" rel="noreferrer" className="underline">Wikimedia Commons</a></>}
      </figcaption>
    </figure>
  )
}
