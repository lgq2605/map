import { useEffect, useState } from 'react'
export function useTypewriter(text: string, run = true, speed = 18) {
  const [n, setN] = useState(run ? 0 : text.length)
  useEffect(() => {
    if (!run) { setN(text.length); return }
    setN(0)
    const id = setInterval(() => setN(k => { if (k >= text.length) { clearInterval(id); return k } return k + 1 }), speed)
    return () => clearInterval(id)
  }, [text, run, speed])
  return { text: text.slice(0, n), done: n >= text.length }
}
