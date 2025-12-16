<template>
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
    >
        <template v-for="item in data.menuTree" :key="item.id">

            <template v-if="isSubMenu(item)">
                <el-sub-menu v-if="item.children.length > 0" :index="item.id.toString()">
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
                    />
                </el-sub-menu>
            </template>

            <MenuItem v-else :menu-item="item" />
        </template>
    </el-menu>
</template>

<script setup>
import { Location } from "@element-plus/icons-vue";
import { onMounted, reactive } from "vue";
import { getMenuTreeApi } from "@/api/menu/index.js";
import MenuItem from "@/components/Layout/MenuItem.vue";

const data = reactive({
    menuTree: []
})

onMounted(() => {
    initMenuTree()
})

const initMenuTree = async () => {
    const res = await getMenuTreeApi()
    data.menuTree = res.data
}
const isSubMenu = (menu) => {
    if (menu.children && menu.children.length > 0) {
        return true
    }
    return false
}
</script>

<style scoped>

</style>
