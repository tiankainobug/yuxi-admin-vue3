import { createRouter, createWebHistory } from 'vue-router'
import Layout from "@/components/Layout/Layout.vue";
import { getToken } from "@/utils/token.js";
import useRouteStore from "@/stores/router.js";
import useUserStore from "@/stores/user.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/home',
            name: 'home',
            component: Layout,
            children: [
                {
                    path: '',
                    name: '首页',
                    component: () => import('../views/HomeView.vue')
                },
            ]
        },
    ]
})

router.beforeEach(async (to, from) => {
    // 判断是否有 token
    if (getToken()) {

        if (to.name === 'login') {
            return true
        }

        if (useUserStore().roles.length === 0) {
            const getUserInfoRes = await useUserStore().getUserInfo()
            if (!getUserInfoRes) {
                return {
                    path: '/login',
                    query: { redirect: to.fullPath }
                }
            }
            const getRoutesRes = await useRouteStore().getRoutes()
            if (getRoutesRes) {
                return {
                    path: to.fullPath,
                    replace: true
                }
            }
        }

        return true
    }
    if (to.name === 'login') {
        return true
    }
    return {
        path: '/login',
        query: { redirect: to.fullPath }
    }
})

export default router
