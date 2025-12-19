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

router.beforeEach(async (to, from) => {
    // 判断是否有 token
    if (getToken()) {

        if (to.name === 'login') {
            return true
        }

        if (!useRouteStore().dynamicRoutes.length) {
            // 获取动态路由
            const res = await getDynamicRoutes()
            if (res) {
                return {
                    path: to.fullPath,
                    replace: true
                }
            }
        }

        return true

    } else {
        return {
            path: '/login',
            query: { redirect: to.fullPath }
        };
    }
})

export default router
