import { useEffect, useRef, useState } from 'react'
import { useCommonsImage } from './useCommonsImage'
import { useInViewOnce } from './useInViewOnce'
import Spinner from './Spinner'

// `fit`: cách khớp ảnh vào khung — 'cover' lấp đầy khung (cắt bớt mép trên/dưới, dùng cho ảnh tư liệu
// phong cảnh); 'contain' thu cả ảnh vào trong khung, KHÔNG cắt mất phần nào (dùng cho chân dung nhân vật
// để hiện trọn vẹn hình dáng).
// `tone`: duotone kiểu ảnh bảo tàng — 'history' (đỏ/đen, ảnh lịch sử), 'modern' (vàng/đen, ảnh hiện đại), 'none' (nâu ấm nhẹ).
// `variant`: 'portrait' = viền vàng kép + bóng đỏ cho ảnh chân dung (xem FigureCard).
// Ảnh chỉ được tìm/tải khi cuộn tới gần (IntersectionObserver).
export default function Visual({ src, query, caption, top, fit = 'cover', tone = 'history', variant = 'plain', imgClass }: {
  src?: string; query?: string | string[]; caption: string; top?: boolean; fit?: 'cover' | 'contain'
  tone?: 'history' | 'modern' | 'none'; variant?: 'plain' | 'portrait'; imgClass?: string
}) {
  const box = useRef<HTMLDivElement>(null)
  const seen = useInViewOnce(box, '240px')
  const { img, fail, canFail, loading } = useCommonsImage(query, src, seen)
  const [bad, setBad] = useState(false)
  useEffect(() => setBad(false), [img?.url])
  const portrait = variant === 'portrait'
  const fitCls = fit === 'contain' ? 'object-contain bg-navy/60' : top ? 'object-cover object-top' : 'object-cover'
  let body
  if (!img || bad) {
    body = (!bad && (loading || !seen))
      ? <div className="grid h-52 place-items-center rounded-sm bg-white/5"><Spinner /></div>
      : <div className="rounded-xl border border-dashed border-paper/30 bg-white/5 p-4 text-sm italic text-paper/70">🖼️ {caption}</div>
  } else {
    body = (
      <figure className={portrait ? 'portrait-frame overflow-hidden' : 'museum-frame'}>
        <div className={`duo ${tone === 'none' || portrait ? 'duo-none' : tone === 'modern' ? 'duo-modern' : 'duo-history'}`}>
          {/* Ảnh hỏng thì thử từ khoá dự phòng kế tiếp; hết dự phòng mới hiện khung chữ thay ảnh */}
          <img src={img.url} alt={caption} loading="lazy" onError={() => (canFail ? fail() : setBad(true))}
            className={(portrait ? 'h-44 w-full ' : 'h-52 w-full hover:scale-105 ') + fitCls + ' ' + (imgClass ?? '')} />
          <span className="grain" />
        </div>
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
