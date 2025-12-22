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
            <el-row>
                <el-col :span="4">
                    <el-button type="primary" icon="Plus" @click="goAdd">新增</el-button>
                </el-col>
            </el-row>
            <el-table
                :data="data.tableData"
                row-key="id"
                stripe
                style="width: 100%;margin-top: 10px;"
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
        <el-dialog
            v-model="data.showAddDialog"
            title="新增菜单"
        >
            <el-form label-width="100">
                <el-form-item prop="name" label="菜单名称" :rules="mustRule()">
                    <el-input v-model="addForm.name" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="菜单类型" :rules="mustRule()">
                    <el-radio-group v-model="addForm.type">
                        <el-radio :label="0">目录</el-radio>
                        <el-radio :label="1">菜单</el-radio>
                        <el-radio :label="2">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="routerName" label="路由名称">
                    <el-input v-model="addForm.routerName" placeholder="路由名称"></el-input>
                </el-form-item>
                <el-form-item props="routerPath"  label="路由路径">
                    <el-input v-model="addForm.routerPath" placeholder="路由路径"></el-input>
                </el-form-item>
                <el-form-item prop="component" label="组件路径">
                    <el-input v-model="addForm.component" placeholder="路由组件"></el-input>
                </el-form-item>
                <el-form-item props="visible" label="显示状态">
                    <el-radio-group v-model="addForm.visible">
                        <el-radio :label="1">显示</el-radio>
                        <el-radio :label="0">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>

import { onMounted, reactive } from "vue";
import { getMenuTreeApi } from "@/api/menu/index.js";
import { ElMessage } from "element-plus";
import { mustRule } from "@/utils/rules.js";

const searchForm = reactive({
    username: '',
    password: ''
})
const addForm = reactive({})
let data = reactive({
    tableData: [],
    showAddDialog: false
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
const initAddForm = (param) => {
    addForm.parentId = ''
    addForm.name = ''
    addForm.type = 0
    addForm.routerName = ''
    addForm.routerPath = ''
    addForm.component = ''
    addForm.visible = 1
    for (const key in param) {
        addForm[key] = param[key]
    }
}
const goAdd = () => {
    initAddForm()
    data.showAddDialog = true
}
</script>

<style scoped>
.table-card {
    margin-top: 15px;
}
</style>
