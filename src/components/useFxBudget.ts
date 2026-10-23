// Ngân sách hiệu ứng nền: tôn trọng prefers-reduced-motion và giảm số sao trên điện thoại.
export function useFxBudget() {
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const mobile = typeof matchMedia === 'function' && matchMedia('(max-width: 767px)').matches
  return { reduced, mobile, stars: mobile ? 10 : 30 }
}
