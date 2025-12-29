<template>
    <div class="page-container">
        <!-- 查询条件 -->
        <el-card class="search-card">
            <el-form label-width="80" :model="searchForm">
                <el-row :gutter="15">
                    <el-col :span="6">
                        <el-form-item label="用户名称" prop="username">
                            <el-input v-model="searchForm.username" placeholder="请输入用户名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="searchForm.phone" placeholder="请输入手机号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="searchForm.status" placeholder="全部" clearable>
                                <el-option label="启用" :value="1"></el-option>
                                <el-option label="禁用" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="goSearch">搜索</el-button>
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
                <el-table-column prop="userAccount" label="用户名" />
                <el-table-column prop="userName" label="昵称" />
                <el-table-column prop="userPhone" label="手机号" />
                <el-table-column prop="userStatus" label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag v-if="row.userStatus === 1">启用</el-tag>
                        <el-tag type="danger" v-else>禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="300">
                    <template #default="{ row }">
                        <el-button size="small" @click="goEdit(row)">编辑</el-button>
                        <el-button size="small" type="primary" @click="goAssignRole(row)">分配角色</el-button>
                        <el-button size="small" type="danger" @click="goResetPassword(row)">重置密码</el-button>
                        <el-popconfirm
                            title="确定删除该用户吗？"
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

        <!-- 新增/编辑用户 -->
        <el-dialog
            v-model="data.showAddDialog"
            :title="data.dialogType === 'add' ? '新增用户' : '编辑用户'"
            show-close
        >
            <el-form
                :model="addForm"
                label-width="100"
                :rules="rules"
            >
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item v-if="data.dialogType === 'add'" prop="password" label="密码">
                    <el-input v-model="addForm.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item prop="nickName" label="昵称">
                    <el-input v-model="addForm.nickName" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="手机号">
                    <el-input v-model="addForm.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-radio-group v-model="addForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">提交</el-button>
                    <el-button type="" @click="data.showAddDialog = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 分配角色 -->
        <el-dialog
            v-model="data.showAssignRoleDialog"
            title="分配角色"
            show-close
            destroy-on-close
        >
            <el-form
                label-width="100"
            >
                <el-form-item label="选择角色">
                    <el-checkbox-group v-model="data.selectedRoleIds">
                        <el-checkbox
                            v-for="role in data.roleList"
                            :key="role.id"
                            :label="role.id"
                        >
                            {{ role.roleName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="goUpdateUserRole">提交</el-button>
                    <el-button type="" @click="data.showAssignRoleDialog = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 重置密码 -->
        <el-dialog
            v-model="data.showResetPasswordDialog"
            title="重置密码"
            show-close
        >
            <el-form
                :model="resetPasswordForm"
                label-width="100"
                :rules="resetPasswordRules"
            >
                <el-form-item prop="password" label="新密码">
                    <el-input v-model="resetPasswordForm.password" type="password" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleResetPasswordSubmit">提交</el-button>
                    <el-button type="" @click="data.showResetPasswordDialog = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>

import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import {
    addUserApi,
    deleteUserApi,
    getUserListApi,
    updateUserApi,
    resetUserPasswordApi,
    assignUserRoleApi,
    getUserRoleIdsApi
} from "@/api/user.js";
import {
    getRoleListApi
} from "@/api/role/index.js";

// 数据
const searchForm = reactive({
    username: '',
    phone: '',
    status: ''
})
const addForm = reactive({})
const resetPasswordForm = reactive({})
const loading = ref(false)
let data = reactive({
    tableData: [],
    showAddDialog: false,
    dialogType: 'add', // add || edit
    showResetPasswordDialog: false, // 显示重置密码对话框
    currentRow: {}, // 当前操作的行数据
    showAssignRoleDialog: false, // 显示分配角色对话框
    selectedRoleIds: [], // 选中的角色ID
    roleList: [] // 角色列表
})

// 规则
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    nickName: [
        { required: true, message: '请输入昵称', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
        }
    ],
    email: [
        {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
        }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})

const resetPasswordRules = reactive({
    password: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
    ]
})

onMounted(() => {
    goSearch()
    loadRoleList()
})

const loadRoleList = async () => {
    const res = await getRoleListApi({})
    if (res.code === 200) {
        data.roleList = res.data
    }
}

const goSearch = async () => {
    loading.value = true
    const res = await getUserListApi({
        username: searchForm.username,
        phone: searchForm.phone,
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
    searchForm.username = ''
    searchForm.phone = ''
    searchForm.status = ''
    goSearch()
}
const initAddForm = (param) => {
    addForm.username = ''
    addForm.password = ''
    addForm.nickName = ''
    addForm.phone = ''
    addForm.email = ''
    addForm.status = 1
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
    const res = await addUserApi(addForm)
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    ElMessage.success(res.message)
    data.showAddDialog = false
    await goSearch()
}
const goEditSubmit = async () => {
    const res = await updateUserApi(addForm)
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    ElMessage.success(res.message)
    data.showAddDialog = false
    await goSearch()
}
const goDelete = async (row) => {
    const res = await deleteUserApi(row.id)
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
const goResetPassword = (row) => {
    resetPasswordForm.password = ''
    resetPasswordForm.id = row.id
    data.currentRow = row
    data.showResetPasswordDialog = true
}
const handleResetPasswordSubmit = async () => {
    const res = await resetUserPasswordApi({
        id: resetPasswordForm.id,
        password: resetPasswordForm.password
    })
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    ElMessage.success(res.message)
    data.showResetPasswordDialog = false
}
const goAssignRole = async (row) => {
    // 获取用户当前的角色
    const res = await getUserRoleIdsApi({
        id: row.id
    })
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    // 设置默认选中的角色ID
    data.selectedRoleIds = res.data
    data.currentRow = row
    data.showAssignRoleDialog = true
}
const goUpdateUserRole = async () => {
    const res = await assignUserRoleApi({
        userId: data.currentRow.id,
        roleIds: data.selectedRoleIds
    })
    if (res.code !== 200) {
        ElMessage.error(res.message)
        return
    }
    data.showAssignRoleDialog = false
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
