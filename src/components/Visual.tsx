import { useEffect, useState } from 'react'
import { useCommonsImage } from './useCommonsImage'

export default function Visual({ src, query, caption, top }: { src?: string; query?: string; caption: string; top?: boolean }) {
  const img = useCommonsImage(query, src)
  const [bad, setBad] = useState(false)
  useEffect(() => setBad(false), [img?.url])
  if (!img || bad) return <div className="rounded-xl border border-dashed border-paper/30 bg-white/5 p-4 text-sm italic text-paper/70">🖼️ {caption}</div>
  return (
    <figure className="overflow-hidden rounded-xl shadow-lg shadow-black/50">
      <img src={img.url} alt={caption} loading="lazy" onError={() => setBad(true)}
        className={'h-52 w-full object-cover transition duration-200 hover:scale-105 ' + (top ? 'object-top' : '')} />
      <figcaption className="bg-black/40 px-3 py-1 text-xs text-paper/70">
        {caption}{img.page && <> · <a href={img.page} target="_blank" rel="noreferrer" className="underline">Wikimedia Commons</a></>}
      </figcaption>
    </figure>
  )
}
