<template>
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @select="handleMenuSelect"
        router
    >
        <template v-for="item in data.menuTree" :key="item.path">

            <template v-if="isSubMenu(item)">
                <el-sub-menu v-if="item.children.length > 0" :index="item.path">
                    <template #title>
                        <el-icon>
                            <location/>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>

                    <MenuItem
                        v-for="children in item.children"
                        :key="children.id"
                        :menu-item="children"
                        :rootRouter="item.path"
                    />
                </el-sub-menu>
            </template>

            <MenuItem v-else :menu-item="item"/>
        </template>
    </el-menu>
</template>

<script setup>
import { Location } from "@element-plus/icons-vue";
import { defineAsyncComponent, onMounted, reactive } from "vue";
import { getMenuTreeApi } from "@/api/menu/index.js";
import MenuItem from "@/components/Layout/MenuItem.vue";
import router, { mapComponent } from "@/router/index.js";
import Layout from "@/components/Layout/Layout.vue";

const data = reactive({
    menuTree: [],
    dynamicRoutes: []
})

onMounted(() => {
    initMenuTree()
})

/**
 * 构造菜单树
 */
const buildMenuTree = (menuTree) => {
    const treeList = []
    for (let i = 0; i < menuTree.length; i++) {
        const item = menuTree[i]
        if (item.type > 1) {
            continue
        }
        if (item.children && item.children.length > 0) {
            const treeItem = {
                path: item.routerPath,
                name: item.name,
                component: Layout,
                children: buildMenuTree(item.children)
            }
            treeList.push(treeItem)
            continue
        }
        const treeItem = {
            path: item.routerPath,
            name: item.name,
            component: mapComponent(item.component)
        }
        treeList.push(treeItem)
    }
    return treeList
}

// 递归添加路由的函数
const addRouteRecursive = (router, routes, parent) => {
    routes.forEach(route => {
        if (parent && parent.name) {
            router.addRoute(parent.name, route)
        } else {
            router.addRoute(route)
        }
        if (route.children && route.children.length) {
            addRouteRecursive(router, route.children, route)
        }
    })
}

/**
 * 初始化菜单树
 */
const initMenuTree = async () => {
    const res = await getMenuTreeApi()

    // 构造路由
    data.menuTree = buildMenuTree(res.data);
    console.log('data.menuTree', data.menuTree)

    // 添加路由到 vue-router
    addRouteRecursive(router, data.menuTree)

    console.log('routers', router.getRoutes())
}

/**
 * 判断是否是子菜单
 * @param {*} menu
 * @returns boolean
 */
const isSubMenu = (menu) => {
    if (menu.children && menu.children.length > 0) {
        return true
    }
    return false
}

/**
 * 菜单点击事件
 * @param {*} menu
 */
const handleMenuSelect = (selectedIndex) => {
    console.log('selectedIndex', selectedIndex)
    // router.push('/system/menu')
}
</script>

<style scoped>

</style>
