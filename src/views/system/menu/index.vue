<template>
    <div class="page-container">
        <el-card>
            <el-form label-width="100">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="菜单名称">
                            <el-input placeholder="请输入用户名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary">查询</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card>

        </el-card>
    </div>
</template>

<script setup>

import { reactive } from "vue";

const form = reactive({
    username: '',
    password: ''
})
</script>
