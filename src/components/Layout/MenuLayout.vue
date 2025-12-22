<template>
    <el-menu
        default-active="2"
        router
    >
        <template v-for="item in routeStore.dynamicRoutes" :key="item.path">

            <template v-if="isSubMenu(item)">
                <el-sub-menu v-if="item.children.length > 0" :index="item.path">
                    <template #title>
                        <el-icon>
                            <component :is="item.meta.icon" v-if="item.meta.icon" />
                            <location v-else />
                        </el-icon>
                        <span>{{ item.meta.name }}</span>
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
import MenuItem from "@/components/Layout/MenuItem.vue";
import useRouteStore from "@/stores/router.js";
import { getDynamicRoutes } from "@/router/routerUtils.js";

const routeStore = useRouteStore()

onMounted(() => {

})

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
</script>

<style scoped>

</style>