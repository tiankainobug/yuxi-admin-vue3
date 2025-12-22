<template>
    <div class="page-container">
        <el-card>
            <el-form label-width="100">
                <el-row :gutter="15">
                    <el-col :span="6">
                        <el-form-item label="菜单名称">
                            <el-input placeholder="请输入用户名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-button  type="primary" @click="goSearch">搜索</el-button>
                        <el-button type="">重置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="table-card">
            <el-table
                :data="data.tableData"
                row-key="id"
                stripe
                style="width: 100%"
                :tree-props="{ children: 'children' }"
            >
                <el-table-column prop="name" label="菜单名称" />
                <el-table-column prop="routerName" label="路由名称" />
                <el-table-column prop="routerPath" label="路由路径" />
                <el-table-column prop="type" label="类型" width="100">
                    <template #default="{ row }">
                        <el-tag v-if="row.type === 0">目录</el-tag>
                        <el-tag type="success" v-else-if="row.type === 1">菜单</el-tag>
                        <el-tag type="warning" v-else>按钮</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="component" label="路由组件" />
                <el-table-column prop="perm" label="权限标识" />
                <el-table-column label="操作" width="180">
                    <template #default="{ row }">
                        <el-button size="small">编辑</el-button>
                        <el-button size="small" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>
    </div>
</template>

<script setup>

import { onMounted, reactive } from "vue";
import { getMenuTreeApi } from "@/api/menu/index.js";
import { ElMessage } from "element-plus";

const form = reactive({
    username: '',
    password: ''
})
let data = reactive({
    tableData: []
})

onMounted(() => {
    goSearch()
})

const goSearch = async () => {
    const res = await getMenuTreeApi()
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    data.tableData = res.data
}
</script>

<style scoped>
.table-card {
    margin-top: 15px;
}
</style>
