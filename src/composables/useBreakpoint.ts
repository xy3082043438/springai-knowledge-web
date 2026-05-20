import { ref, onMounted, onUnmounted, readonly } from 'vue'

// 与 styles/_responsive.scss 中 $bp-mobile 保持一致
const MOBILE_QUERY = '(max-width: 768px)'

/**
 * 响应式断点感知（无第三方依赖，基于原生 matchMedia）。
 * 返回 isMobile：当视口宽度 ≤ 768px 时为 true。
 */
export function useBreakpoint() {
  const isMobile = ref(false)
  let mql: MediaQueryList | null = null

  const update = (e: MediaQueryListEvent | MediaQueryList) => {
    isMobile.value = e.matches
  }

  onMounted(() => {
    mql = window.matchMedia(MOBILE_QUERY)
    update(mql)
    mql.addEventListener('change', update)
  })

  onUnmounted(() => {
    mql?.removeEventListener('change', update)
  })

  return { isMobile: readonly(isMobile) }
}
