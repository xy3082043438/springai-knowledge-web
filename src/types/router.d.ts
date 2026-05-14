import 'vue-router'
import type { Permission } from '@/types/api'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    hidden?: boolean
    roles?: string[]
    permissions?: Permission[]
  }
}

export {}
