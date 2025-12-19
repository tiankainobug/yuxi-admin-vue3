<template>
    <el-container class="common-layout">
        <el-header>
            <LogoLayout class="logo-layout"/>
            <TopLayout class="top-layout"/>
        </el-header>
        <el-container>
            <el-aside class="aside-layout">
                <MenuLayout class="menu-layout" />
            </el-aside>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import MenuLayout from "@/components/Layout/MenuLayout.vue";
import LogoLayout from "@/components/Layout/LogoLayout.vue";
import TopLayout from "@/components/Layout/TopLayout.vue";
</script>

<style scoped lang="scss">
$aside-width: 200px;

.common-layout {
    width: 100vw;
    height: 100vh;
}
.aside-layout {
    width: $aside-width;
}
.logo-layout {
    width: $aside-width;
    height: 100%;
}
.menu-layout {
    height: calc(100vh - 50px);
}

:deep(.el-header) {
    --el-header-height: $header-layout-height;
    --el-header-padding: 0;

    display: flex;
    align-items: center;
    background: $color-main;
}

</style>
