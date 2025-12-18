import { createRouter, createWebHistory } from 'vue-router'
import Layout from "@/components/Layout/Layout.vue";
import { getToken } from "@/utils/token.js";
import useRouteStore from "@/stores/router.js";
import { getDynamicRoutes } from "@/router/routerUtils.js";

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

router.beforeEach((to, from, next) => {
    if (getToken()) {
        if (to.path === '/login') {
            next({ path: '/' })
            return
        }

        if (useRouteStore().dynamicRoutes.length === 0) {
            getDynamicRoutes().then(() => {
                next({ ...to, replace: true })
            })
            return;
        }

        next()

    } else {
        next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
    }
})

export default router
