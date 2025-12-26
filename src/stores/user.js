import { defineStore } from "pinia";
import { getToken, setToken } from "@/utils/token.js";
import { getUserInfo, login } from "@/api/user.js";

const useUserStore = defineStore('user', {
    state: () => ({
        token: getToken(),
        id: '',
        name: '',
        avatar: '',
        roles: [],
        permissions: [],
    }),
    actions: {
        async login(params) {
            const res = await login({
                username: params.username,
                password: params.password
            })
            if (res.code === 200) {
                setToken(res.data)
                return true
            }
            return false
        },
        async getUserInfo() {
            const res = await getUserInfo()
            if (res.code === 200) {
                this.id = res.data.id
                this.name = res.data.name
                this.avatar = res.data.avatar
                this.roles = res.data.roles
                this.permissions = res.data.permissions
                return true
            }
            return false
        }
    }
})

export default useUserStore;
