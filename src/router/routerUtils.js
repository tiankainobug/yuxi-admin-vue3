import { getMenuTreeApi } from "@/api/menu/index.js";
import router from "@/router/index.js";
import { getToken } from "@/utils/token.js";
import useRouteStore from "@/stores/router.js";
import Layout from "@/components/Layout/Layout.vue";

const modules = import.meta.glob('./../views/**/*.vue')

/**
 * 映射组件路径到实际组件（懒加载）
 * @param componentPath 后端返回的组件路径（如 "dashboard/index"）
 */
export const mapComponent = (componentPath) => {
    let res;
    for (const path in modules) {
        const dir = path.split('views/')[1].split('.vue')[0];
        if (dir === componentPath) {
            res = () => modules[path]();
        }
    }
    return res;
}

/**
 * 构造菜单树
 */
const buildRouterTree = (menuTree, parent) => {
    const treeList = []
    if (parent) {
        menuTree.forEach(menu => {
            const menuItem = {
                id: menu.id,
                path: menu.routerPath,
                name: menu.routerName,
                component: mapComponent(menu.component),
                meta: {
                    name: menu.name,
                    icon: menu.icon
                }
            }
            router.addRoute(parent.routerName, menuItem)
            treeList.push(menuItem)
        })
        return treeList
    }
    menuTree.forEach(menu => {
        const menuItem = {
            id: menu.id,
            path: menu.routerPath,
            name: menu.routerName,
            component: Layout,
            meta: {
                name: menu.name,
                icon: menu.icon
            }
        }
        // 添加路由
        router.addRoute(menuItem)
        // 添加子菜单
        if (menu.children && menu.children.length > 0) {
            menuItem.children = buildRouterTree(menu.children, menu)
        }
        treeList.push(menuItem)
    })
    return treeList
}

/**
 * 初始化菜单树
 */
export const getDynamicRoutes = async () => {
    const res = await getMenuTreeApi()
    if (res.code !== 200) {
        await router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
        return false
    }
    // 构造路由
    useRouteStore().dynamicRoutes = buildRouterTree(res.data);
    return true
}
