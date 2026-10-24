import { useEffect, useRef, useState } from 'react'
import { useCommonsImage } from './useCommonsImage'
import { useInViewOnce } from './useInViewOnce'
import Spinner from './Spinner'

// Ảnh hiển thị NGUYÊN MÀU, nguyên tỉ lệ (không cắt, không phủ màu đỏ/vàng).
// `variant`: 'portrait' = chân dung (khung viền vàng kép, xem FigureCard).
// `fit`, `top`, `tone` giữ lại để các nơi gọi cũ không phải sửa; không còn tác dụng.
// Ảnh chỉ được tìm/tải khi cuộn tới gần (IntersectionObserver).
export default function Visual({ src, query, caption, variant = 'plain' }: {
  src?: string; query?: string | string[]; caption: string; top?: boolean; fit?: 'cover' | 'contain'
  tone?: 'history' | 'modern' | 'none'; variant?: 'plain' | 'portrait'
}) {
  const box = useRef<HTMLDivElement>(null)
  const seen = useInViewOnce(box, '240px')
  const { img, fail, canFail, loading } = useCommonsImage(query, src, seen)
  const [bad, setBad] = useState(false)
  useEffect(() => setBad(false), [img?.url])
  const portrait = variant === 'portrait'
  let body
  if (!img || bad) {
    body = (!bad && (loading || !seen))
      ? <div className="grid h-40 place-items-center rounded-sm bg-white/5"><Spinner /></div>
      : <div className="rounded-xl border border-dashed border-paper/30 bg-white/5 p-4 text-sm italic text-paper/70">🖼️ {caption}</div>
  } else {
    body = (
      <figure className={portrait ? 'portrait-frame overflow-hidden' : 'museum-frame'}>
        {/* Ảnh hỏng thì thử từ khoá dự phòng kế tiếp; hết dự phòng mới hiện khung chữ thay ảnh */}
        <img src={img.url} alt={caption} loading="lazy" decoding="async" onError={() => (canFail ? fail() : setBad(true))}
          className={portrait ? 'h-44 w-full bg-navy/60 object-contain' : 'max-h-72 w-full rounded-[2px] bg-black/20 object-contain'} />
        {!portrait && (
          <figcaption className="px-2 pb-0.5 pt-2 font-sub text-[13px] italic leading-snug text-paper/75">
            {caption}{img.page && <> · <a href={img.page} target="_blank" rel="noreferrer" className="underline decoration-gold/50">Wikimedia Commons</a></>}
          </figcaption>
        )}
      </figure>
    )
  }
  return <div ref={box}>{body}</div>
}
