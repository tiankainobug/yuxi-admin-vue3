<template>
    <el-container class="common-layout">
        <el-aside class="aside-layout">
            <MenuLogo class="logo-layout"/>
            <MenuLayout class="menu-layout" />
        </el-aside>
        <el-container>
            <el-header>Header</el-header>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import MenuLayout from "@/components/Layout/MenuLayout.vue";
import MenuLogo from "@/components/Layout/MenuLogo.vue";

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
    height: 50px;
}
.menu-layout {
    height: calc(100vh - 50px);
}

</style>
