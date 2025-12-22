<template>
    <div class="page-container">
        <!-- 查询条件 -->
        <el-card class="search-card">
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
        <!-- 表格 -->
        <el-card class="table-card">
            <el-row>
                <el-col :span="4">
                    <el-button type="primary" icon="Plus" @click="goAdd">新增</el-button>
                </el-col>
            </el-row>
            <el-table
                v-loading="loading"
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
                        <el-button size="small" @click="goEdit(row)">编辑</el-button>
                        <el-popconfirm
                            title="确定删除该菜单吗？"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            @confirm="goDelete(row)"
                        >
                            <template #reference>
                                <el-button size="small" type="danger">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 新增菜单 -->
        <el-dialog
            v-model="data.showAddDialog"
            :title="data.dialogType === 'add' ? '新增菜单' : '编辑菜单'"
            show-close
        >
            <el-form
                :model="addForm"
                label-width="100"
                :rules="rules"
            >
                <el-form-item label="上级菜单">
                    <el-tree-select
                        v-model="addForm.parentId"
                        :data="[{
                            id: -1,
                            name: '顶级菜单',
                            children: data.tableData
                        }]"
                        :render-after-expand="false"
                        :check-on-click-node="true"
                        :expand-on-click-node="false"
                        :check-strictly="true"
                        :props="{
                            label: 'name',
                            value: 'id',
                            children: 'children'
                        }"
                    />
                </el-form-item>
                <el-form-item prop="name" label="菜单名称">
                    <el-input v-model="addForm.name" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="菜单类型">
                    <el-radio-group v-model="addForm.type">
                        <el-radio :label="0">目录</el-radio>
                        <el-radio :label="1">菜单</el-radio>
                        <el-radio :label="2">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="routerName" label="路由名称">
                    <el-input v-model="addForm.routerName" placeholder="路由名称"></el-input>
                </el-form-item>
                <el-form-item prop="routerPath" label="路由路径">
                    <el-input v-model="addForm.routerPath" placeholder="路由路径"></el-input>
                </el-form-item>
                <el-form-item v-if="addForm.type === 1" prop="component" label="组件路径">
                    <el-input v-model="addForm.component" placeholder="路由组件">
                        <template #prepend>src/views/</template>
                        <template #append>
                            .vue
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="visible" label="显示状态">
                    <el-radio-group v-model="addForm.visible">
                        <el-radio :label="1">显示</el-radio>
                        <el-radio :label="0">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">提交</el-button>
                    <el-button type="" @click="data.showAddDialog = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>

import { onMounted, reactive, ref } from "vue";
import { createMenuApi, deleteMenuApi, getMenuTreeApi, updateMenuApi } from "@/api/menu/index.js";
import { ElMessage } from "element-plus";
import _ from 'lodash';

const searchForm = reactive({
    username: '',
    password: ''
})
const addForm = reactive({})
const loading = ref(false)
let data = reactive({
    tableData: [],
    showAddDialog: false,
    dialogType: 'add' // add || edit
})

const rules = reactive({
    name: [
        { required: true, message: '请输入菜单名称', trigger: 'blur' }
    ],
    type: [
        { required: true, message: '请选择菜单类型', trigger: 'blur' }
    ],
    routerName: [
        { required: true, message: '请输入路由名称', trigger: 'blur' }
    ],
    routerPath: [
        { required: true, message: '请输入路由路径', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (!value.startsWith('/') && addForm.parentId === -1) {
                    callback(new Error('路由路径必须以 / 开头'))
                }
                callback()
            },
            trigger: 'blur'
        }
    ]
})

onMounted(() => {
    goSearch()
})

const goSearch = async () => {
    loading.value = true
    const res = await getMenuTreeApi()
    loading.value = false
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    data.tableData = res.data
}
const initAddForm = (param) => {
    addForm.parentId = -1
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
    data.dialogType = 'add'
    data.showAddDialog = true
}
const handleSubmit = () => {
    if (data.dialogType === 'add') {
        goSubmit()
    } else {
        goEditSubmit()
    }
}
const goSubmit = async () => {
    const addParams = _.cloneDeep(addForm)
    if (addParams.parentId === -1) {
        delete addParams.parentId
    }
    const res = await createMenuApi(addParams)
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    ElMessage.success(res.message)
    data.showAddDialog = false
    await goSearch()
}
const goEditSubmit = async () => {
    const addParams = _.cloneDeep(addForm)
    if (addParams.parentId === -1) {
        delete addParams.parentId
    }
    const res = await updateMenuApi(addParams)
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    ElMessage.success(res.message)
    data.showAddDialog = false
    await goSearch()
}
const goDelete = async (row) => {
    const res = await deleteMenuApi(row.id)
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    ElMessage.success(res.message)
    await goSearch()
}
const goEdit = (row) => {
    const params = _.cloneDeep(row)
    if (params.parentId === null) {
        params.parentId = -1
    }
    initAddForm(params)
    data.dialogType = 'edit'
    data.showAddDialog = true
}
</script>

<style scoped>
:deep(.search-card .el-card__body) {
    padding-bottom: 0;
}
.table-card {
    margin-top: 15px;
}
</style>
