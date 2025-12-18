import { createRouter, createWebHistory } from 'vue-router'
import Layout from "@/components/Layout/Layout.vue";
import { defineAsyncComponent } from "vue";

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
            // route level code-splitting
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

/**
 * 映射组件路径到实际组件（懒加载）
 * @param componentPath 后端返回的组件路径（如 "dashboard/index"）
 */
export const mapComponent = (componentPath) => {
    if (process.env.NODE_ENV === 'development') {
        return (resolve) => require([`@/views/${componentPath}/index.vue`], resolve)
    } else {
        // 使用 import 实现生产环境的路由懒加载
        return () => import(`@/views/${componentPath}/index.vue`)
    }
}

export const dynamicRoutes = []

export default router
