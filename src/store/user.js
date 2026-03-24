import { defineStore } from 'pinia';
import { ref } from 'vue';
import { login as loginApi, logout as logoutApi } from '@/api/auth';
import { getMe } from '@/api/user';
import router from '@/router';
export const useUserStore = defineStore('user', () => {
    const token = ref(localStorage.getItem('token'));
    const userInfo = ref(null);
    const login = async (loginForm) => {
        const { data } = await loginApi(loginForm);
        token.value = data.token;
        userInfo.value = data.user;
        localStorage.setItem('token', data.token);
    };
    const fetchUserInfo = async () => {
        const { data } = await getMe();
        userInfo.value = data;
    };
    const logout = async () => {
        try {
            await logoutApi();
        }
        catch {
            // ignore
        }
        token.value = null;
        userInfo.value = null;
        localStorage.removeItem('token');
        router.push('/login');
    };
    return {
        token,
        userInfo,
        login,
        logout,
        fetchUserInfo,
    };
});
//# sourceMappingURL=user.js.map