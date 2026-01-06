<template>
    <div class="top-container">
        {{ userStore.name }}

        <el-button @click="goLogout" type="danger" size="small">退出登录</el-button>
    </div>
</template>

<script setup>

import useUserStore from "@/stores/user.js";
import { useRouter } from "vue-router";

const userStore = useUserStore()
const router = useRouter()

const goLogout = () => {
    userStore.logout()
    router.push('/login')
}

</script>

<style scoped>
.top-container {
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #f0f2f5;
    gap: 10px;
}
</style>
