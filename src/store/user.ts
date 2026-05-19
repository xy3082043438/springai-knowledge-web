import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, logout as logoutApi } from '@/api/auth'
import { getMe } from '@/api/system/user'
import type { UserResponse, AuthLoginRequest } from '@/types/api'

const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch {
    // 隐私模式或 localStorage 被禁用时降级到内存态
    return null
  }
}

const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

const safeRemoveItem = (key: string) => {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(safeGetItem('token'))
  const userInfo = ref<UserResponse | null>(null)
  let userInfoPromise: Promise<UserResponse | null> | null = null

  const clearSession = () => {
    token.value = null
    userInfo.value = null
    userInfoPromise = null
    safeRemoveItem('token')
  }

  const login = async (loginForm: AuthLoginRequest) => {
    const { data } = await loginApi(loginForm)
    token.value = data.token
    userInfo.value = data.user
    userInfoPromise = null
    safeSetItem('token', data.token)
  }

  const fetchUserInfo = async () => {
    const { data } = await getMe()
    userInfo.value = data
    return data
  }

  const ensureUserInfo = async () => {
    if (!token.value) {
      return null
    }

    if (userInfo.value) {
      return userInfo.value
    }

    if (!userInfoPromise) {
      userInfoPromise = fetchUserInfo().finally(() => {
        userInfoPromise = null
      })
    }

    return userInfoPromise
  }

  const logout = async () => {
    try {
      await logoutApi()
    } catch {
      // ignore
    }
    clearSession()
  }

  return {
    token,
    userInfo,
    clearSession,
    login,
    logout,
    fetchUserInfo,
    ensureUserInfo,
  }
})

