// Ngân sách hiệu ứng nền: tôn trọng prefers-reduced-motion và giảm số hạt trên điện thoại.
// Tổng hạt (bụi sáng + sao nhấp nháy) trên desktop = 50 + 30 = 80 (≤ 80); mobile = 20 + 10.
export function useFxBudget() {
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const mobile = typeof matchMedia === 'function' && matchMedia('(max-width: 767px)').matches
  return { reduced, mobile, dust: mobile ? 20 : 50, stars: mobile ? 10 : 30 }
}
