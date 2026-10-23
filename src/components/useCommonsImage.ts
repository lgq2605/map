import { useEffect, useState } from 'react'
export interface Img { url: string; page?: string }

// Chỉ ghi nhớ kết quả THÀNH CÔNG. Tìm hỏng (mạng chập chờn, máy chủ từ chối tới) thì lần sau thử lại —
// trước đây lỗi bị nhớ mãi nên có ảnh mãi không hiện cho tới khi tải lại trang.
const okCache = new Map<string, Img>()
const inflight = new Map<string, Promise<Img | null>>()

// Tìm ảnh trên Wikimedia Commons (API công khai, không cần key). Kết quả đầu tiên là ảnh jpeg/png/webp.
// Máy chủ thỉnh thoảng từ chối (giới hạn số yêu cầu): thử lại vài lần trước khi bỏ cuộc.
function find(q: string, tries = 2): Promise<Img | null> {
  const hit = okCache.get(q)
  if (hit) return Promise.resolve(hit)
  let p = inflight.get(q)
  if (!p) {
    const api = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url|mime&iiurlwidth=800&gsrsearch=' + encodeURIComponent(q)
    const one = () => fetch(api).then(r => {
      if (!r.ok) throw new Error(String(r.status))
      return r.json()
    }).then(d => {
      const pages = (Object.values(d?.query?.pages ?? {}) as any[]).sort((a, b) => a.index - b.index)
      for (const p of pages) {
        const i = p.imageinfo?.[0]
        if (i && /^image\/(jpeg|png|webp)/.test(i.mime)) {
          const img = { url: i.thumburl || i.url, page: i.descriptionurl }
          okCache.set(q, img)
          return img
        }
      }
      return null
    })
    const attempt = (n: number): Promise<Img | null> => one().catch(() => (n > 0 ? attempt(n - 1) : null))
    p = attempt(tries).finally(() => inflight.delete(q))
    inflight.set(q, p)
  }
  return p
}

// Nhận MỘT chuỗi tìm kiếm hoặc DANH SÁCH chuỗi dự phòng: từ khoá nào không ra ảnh (hoặc ảnh hỏng
// không tải được) thì tự chuyển sang từ khoá kế tiếp, tới khi hết mới hiện khung chữ thay ảnh.
export function useCommonsImage(query?: string | string[], src?: string) {
  const queries = Array.isArray(query) ? query : query ? [query] : []
  const key = queries.join('\u0001')
  const [i, setI] = useState(0)
  const [img, setImg] = useState<Img | null>(src ? { url: src } : null)
  useEffect(() => { setI(0) }, [key, src])
  useEffect(() => {
    if (src) { setImg({ url: src }); return }
    const qs = key ? key.split('\u0001') : []
    if (i >= qs.length) { setImg(null); return }
    let on = true
    find(qs[i]).then(r => {
      if (!on) return
      if (r) setImg(r)
      else if (i + 1 < qs.length) setI(i + 1) // từ khoá này không có ảnh: thử từ khoá dự phòng
      else setImg(null)
    })
    return () => { on = false }
  }, [i, key, src])
  const total = key ? key.split('\u0001').length : 0
  // Ảnh hiện ra mà không tải được (onError ở <img>): chuyển từ khoá dự phòng kế tiếp
  return { img, fail: () => setI(i + 1), canFail: i + 1 < total }
}
