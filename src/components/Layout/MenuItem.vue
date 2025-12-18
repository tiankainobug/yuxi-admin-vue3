<template>
    <el-menu-item :index="getRouterIndex()" @click="handleMenuClick(menuItem)">
        <template #title>
            <el-icon>
                <location/>
            </el-icon>
            <span>{{ menuItem.meta.name }}</span>
        </template>
    </el-menu-item>
</template>

<script setup>
import { Location } from "@element-plus/icons-vue";

const props = defineProps({
    menuItem: {
        type: Object,
        required: true
    },
    rootRouter: {
        type: String,
        required: false,
        default: ''
    }
})

const getRouterIndex = () => {
    if (props.rootRouter) return `${props.rootRouter}/${props.menuItem.path}`
    return props.menuItem.path
}

const handleMenuClick = (menu) => {
    console.log(menu)
    // 拼接路由

}
</script>

<style scoped>

</style>
