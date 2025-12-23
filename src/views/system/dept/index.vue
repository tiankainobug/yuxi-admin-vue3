<template>
    <div class="page-container">
        <!-- 查询条件 -->
        <el-card class="search-card">
            <el-form label-width="80" :model="searchForm">
                <el-row :gutter="15">
                    <el-col :span="6">
                        <el-form-item label="部门名称" prop="deptName">
                            <el-input v-model="searchForm.deptName" placeholder="请输入部门名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="显示状态" prop="status">
                            <el-select v-model="searchForm.status" placeholder="全部" clearable>
                                <el-option label="启用" :value="1"></el-option>
                                <el-option label="禁用" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-button  type="primary" @click="goSearch">搜索</el-button>
                        <el-button type="" @click="resetSearch">重置</el-button>
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
                row-key="deptId"
                stripe
                style="width: 100%;margin-top: 10px;"
                :tree-props="{ children: 'children' }"
                empty-text="暂无数据～"
            >
                <el-table-column prop="deptName" label="部门名称" />
                <el-table-column prop="sortNum" label="排序" width="100" />
                <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag v-if="row.status === 1">启用</el-tag>
                        <el-tag type="danger" v-else>禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template #default="{ row }">
                        <el-button size="small" @click="goEdit(row)">编辑</el-button>
                        <el-popconfirm
                            title="确定删除该部门吗？"
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
            :title="data.dialogType === 'add' ? '新增部门' : '编辑部门'"
            show-close
        >
            <el-form
                :model="addForm"
                label-width="100"
                :rules="rules"
            >
                <el-form-item label="上级菜单">
                    <el-tree-select
                        v-model="addForm.parentDeptId"
                        :data="[{
                            deptId: 0,
                            deptName: '顶级菜单',
                            children: data.tableData
                        }]"
                        :render-after-expand="false"
                        :check-on-click-node="true"
                        :expand-on-click-node="false"
                        :check-strictly="true"
                        :props="{
                            label: 'deptName',
                            value: 'deptId',
                            children: 'children'
                        }"
                    />
                </el-form-item>
                <el-form-item prop="deptName" label="部门名称">
                    <el-input v-model="addForm.deptName" placeholder="请输入部门名称"></el-input>
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-radio-group v-model="addForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="sortNum" label="排序">
                    <el-input v-model="addForm.sortNum" placeholder="排序"></el-input>
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
import { ElMessage } from "element-plus";
import { addDeptApi, deleteDeptApi, getDeptListApi, updateDeptApi } from "@/api/dept/index.js";

const searchForm = reactive({
    deptName: '',
    status: ''
})
const addForm = reactive({})
const loading = ref(false)
let data = reactive({
    tableData: [],
    showAddDialog: false,
    dialogType: 'add' // add || edit
})

const rules = reactive({
    deptName: [
        { required: true, message: '请输入部门名称', trigger: 'blur' }
    ],
})

onMounted(() => {
    goSearch()
})

const goSearch = async () => {
    loading.value = true
    const res = await getDeptListApi({
        deptName: searchForm.deptName,
        status: searchForm.status
    })
    loading.value = false
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    data.tableData = res.data
}
const resetSearch = () => {
    searchForm.deptName = ''
    searchForm.status = ''
    goSearch()
}
const initAddForm = (param) => {
    addForm.parentDeptId = 0
    addForm.deptName = ''
    addForm.status = 1
    addForm.sortNum = 0
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
    const res = await addDeptApi(addForm)
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    ElMessage.success(res.message)
    data.showAddDialog = false
    await goSearch()
}
const goEditSubmit = async () => {
    const res = await updateDeptApi(addForm)
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    ElMessage.success(res.message)
    data.showAddDialog = false
    await goSearch()
}
const goDelete = async (row) => {
    const res = await deleteDeptApi(row.deptId)
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    ElMessage.success(res.message)
    await goSearch()
}
const goEdit = (row) => {
    initAddForm(row)
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
