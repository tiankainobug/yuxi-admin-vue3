<template>
    <el-menu-item :index="menuItem.id.toString()" @click="handleMenuClick(menuItem)">
        <template #title>
            <el-icon>
                <location/>
            </el-icon>
            <span>{{ menuItem.name }}</span>
        </template>
    </el-menu-item>
</template>

<script setup>
import { Location } from "@element-plus/icons-vue";

defineProps({
    menuItem: {
        type: Object,
        required: true
    }
})

const handleMenuClick = (menu) => {
    console.log(menu)
    // 拼接路由

}
</script>

<style scoped>

</style>
