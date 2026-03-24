import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, logout as logoutApi } from '@/api/auth'
import { getMe } from '@/api/user'
import type { UserResponse, AuthLoginRequest } from '@/types/api'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const userInfo = ref<UserResponse | null>(null)
  let userInfoPromise: Promise<UserResponse | null> | null = null

  const clearSession = () => {
    token.value = null
    userInfo.value = null
    userInfoPromise = null
    localStorage.removeItem('token')
  }

  const login = async (loginForm: AuthLoginRequest) => {
    const { data } = await loginApi(loginForm)
    token.value = data.token
    userInfo.value = data.user
    userInfoPromise = null
    localStorage.setItem('token', data.token)
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
