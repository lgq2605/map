import { useEffect, useState } from 'react'
export interface Img { url: string; page?: string }
const cache = new Map<string, Promise<Img | null>>()

// Tìm ảnh trên Wikimedia Commons (API công khai, không cần key). Kết quả đầu tiên là ảnh jpeg/png/webp.
function find(q: string) {
  if (!cache.has(q)) {
    const api = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url|mime&iiurlwidth=800&gsrsearch=' + encodeURIComponent(q)
    cache.set(q, fetch(api).then(r => r.json()).then(d => {
      const pages = (Object.values(d?.query?.pages ?? {}) as any[]).sort((a, b) => a.index - b.index)
      for (const p of pages) {
        const i = p.imageinfo?.[0]
        if (i && /^image\/(jpeg|png|webp)/.test(i.mime)) return { url: i.thumburl || i.url, page: i.descriptionurl }
      }
      return null
    }).catch(() => null))
  }
  return cache.get(q)!
}

export function useCommonsImage(query?: string, src?: string) {
  const [img, setImg] = useState<Img | null>(src ? { url: src } : null)
  useEffect(() => {
    if (src) { setImg({ url: src }); return }
    if (!query) { setImg(null); return }
    let on = true
    find(query).then(i => on && setImg(i))
    return () => { on = false }
  }, [query, src])
  return img
}
