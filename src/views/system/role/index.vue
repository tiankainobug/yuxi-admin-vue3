<template>
    <div class="page-container">
        <!-- 查询条件 -->
        <el-card class="search-card">
            <el-form label-width="80" :model="searchForm">
                <el-row :gutter="15">
                    <el-col :span="6">
                        <el-form-item label="角色名称" prop="roleName">
                            <el-input v-model="searchForm.roleName" placeholder="请输入角色名称"></el-input>
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
                stripe
                style="width: 100%;margin-top: 10px;"
                empty-text="暂无数据～"
            >
                <el-table-column prop="roleName" label="角色名称" />
                <el-table-column prop="roleCode" label="角色标识" />
                <el-table-column prop="sort" label="排序" width="100" />
                <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag v-if="row.status === 1">启用</el-tag>
                        <el-tag type="danger" v-else>禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300">
                    <template #default="{ row }">
                        <template v-if="row.roleCode !== 'ADMIN'">
                            <el-button type="primary" size="small" @click="goMenu(row)">分配菜单</el-button>
                            <el-button size="small" @click="goEdit(row)">编辑</el-button>
                            <el-popconfirm
                                title="确定删除该角色吗？"
                                confirm-button-text="确定"
                                cancel-button-text="取消"
                                @confirm="goDelete(row)"
                            >
                                <template #reference>
                                    <el-button size="small" type="danger">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 新增/编辑角色 -->
        <el-dialog
            v-model="data.showAddDialog"
            :title="data.dialogType === 'add' ? '新增角色' : '编辑角色'"
            show-close
        >
            <el-form
                :model="addForm"
                label-width="100"
                :rules="rules"
            >
                <el-form-item prop="roleName" label="角色名称">
                    <el-input v-model="addForm.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item prop="roleCode" label="角色标识">
                    <el-input v-model="addForm.roleCode" placeholder="请输入角色标识"></el-input>
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-radio-group v-model="addForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="sort" label="排序">
                    <el-input v-model="addForm.sort" placeholder="排序"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">提交</el-button>
                    <el-button type="" @click="data.showAddDialog = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 分配菜单 -->
        <el-dialog
            v-model="data.showMenuDialog"
            title="分配菜单"
            show-close
            destroy-on-close
        >
            <el-form
                label-width="100"
            >
                <el-form-item label="分配菜单">
                    <el-tree
                        ref="treeRef"
                        node-key="id"
                        style="max-width: 600px"
                        :data="routerStore.dynamicRoutes"
                        :default-checked-keys="data.defaultCheckedKeys"
                        show-checkbox
                        :props="{
                            label: (nodeData) => { return nodeData.meta.name },
                            children: 'children'
                        }"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="goUpdateRoleMenu">提交</el-button>
                    <el-button type="" @click="data.showMenuDialog = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>

import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import {
    addRoleApi,
    deleteRoleApi,
    getRoleListApi,
    getRoleMenuApi,
    updateRoleApi,
    updateRoleMenuApi
} from "@/api/role/index.js";
import useRouteStore from "@/stores/router.js";

// store
const routerStore = useRouteStore()
// 数据
const searchForm = reactive({
    roleName: '',
    status: ''
})
const addForm = reactive({})
let data = reactive({
    tableData: [],
    showAddDialog: false,
    dialogType: 'add', // add || edit

    showMenuDialog: false, // 显示分配菜单的对话框
    defaultCheckedKeys: [], // 默认选中的菜单ID
    currentRole: {},
})
// loading
const loading = ref(false)
// ref
const treeRef = ref(null)

// 规则
const rules = reactive({
    roleName: [
        { required: true, message: '请输入角色名称', trigger: 'blur' }
    ],
    roleCode: [
        { required: true, message: '请输入角色标识', trigger: 'blur' }
    ]
})

onMounted(() => {
    goSearch()
})

const goSearch = async () => {
    loading.value = true
    const res = await getRoleListApi({
        roleName: searchForm.roleName,
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
    searchForm.roleName = ''
    searchForm.status = ''
    goSearch()
}
const initAddForm = (param) => {
    addForm.roleName = ''
    addForm.roleCode = ''
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
    const res = await addRoleApi(addForm)
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    ElMessage.success(res.message)
    data.showAddDialog = false
    await goSearch()
}
const goEditSubmit = async () => {
    const res = await updateRoleApi(addForm)
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    ElMessage.success(res.message)
    data.showAddDialog = false
    await goSearch()
}
const goDelete = async (row) => {
    const res = await deleteRoleApi(row.id)
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
const goMenu = async (row) => {
    // 获取登录角色的菜单权限
    const res = await getRoleMenuApi()
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    // 赋值给默认选中的菜单ID
    data.defaultCheckedKeys = res.data
    data.currentRole = row
    data.showMenuDialog = true
}
const goUpdateRoleMenu = async () => {
    const checkedKeys = treeRef.value.getCheckedKeys()
    const res = await updateRoleMenuApi({
        roleId: data.currentRole.id,
        menuIds: checkedKeys
    })
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    data.showMenuDialog = false
    ElMessage.success(res.message)
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
