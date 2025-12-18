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
import { onMounted, reactive } from "vue";
import { getMenuTreeApi } from "@/api/menu/index.js";
import MenuItem from "@/components/Layout/MenuItem.vue";
import router, { mapComponent } from "@/router/index.js";

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
                component: mapComponent(item.component),
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

const initMenuTree = async () => {
    const res = await getMenuTreeApi()
    data.menuTree = buildMenuTree(res.data);
    console.log('data.menuTree', data.menuTree)
}
const isSubMenu = (menu) => {
    if (menu.children && menu.children.length > 0) {
        return true
    }
    return false
}

const handleMenuSelect = (selectedIndex) => {
    console.log('selectedIndex', selectedIndex)
    // router.push('/system/menu')
}
</script>

<style scoped>

</style>
