<template>
    <div class="login-container">
        <div class="login-intro">
            <div class="intro-content">
                <h1 class="system-title">🏛️ 予溪管理系统</h1>
                <!-- <p class="system-slogan">赋能企业数字化转型，构建高效智能政务/业务体系。</p> -->

                <!-- <ul class="features-list"> -->
                <!--     <li>✅ 安全可靠的数据加密</li> -->
                <!--     <li>📈 实时高效的业务支撑</li> -->
                <!--     <li>💡 精准智能的辅助决策</li> -->
                <!-- </ul> -->
            </div>
            <div class="copyright">© 2025 yuxi. All Rights Reserved.</div>
        </div>

        <div class="login-form-wrapper">
            <el-card class="login-card">
                <h2 class="form-title">用户登录</h2>

                <el-form
                    ref="loginFormRef"
                    :model="loginForm"
                    :rules="loginRules"
                    label-position="top"
                    @keyup.enter="submitForm(loginFormRef)"
                >
                    <el-form-item label="账号" prop="username">
                        <el-input
                            v-model="loginForm.username"
                            placeholder="请输入账号"
                            size="large"
                        >
                            <template #prefix>
                                <el-icon><User /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="密码" prop="password">
                        <el-input
                            v-model="loginForm.password"
                            type="password"
                            placeholder="请输入密码"
                            show-password
                            size="large"
                        >
                            <template #prefix>
                                <el-icon><Lock /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item>
                        <div class="form-options">
                            <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
                            <el-link type="primary" :underline="false">忘记密码?</el-link>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-button
                            type="primary"
                            :loading="isLoading"
                            @click="submitForm(loginFormRef)"
                            size="large"
                            class="login-button"
                        >
                            立即登录
                        </el-button>
                    </el-form-item>

                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { ElMessage } from "element-plus";
import { login } from "@/api/user.js";

// 路由对象
const router = useRouter();

// 表单引用和状态
const loginFormRef = ref(null);
const isLoading = ref(false);

// 表单数据模型
const loginForm = reactive({
    username: '',
    password: '',
    rememberMe: true,
});

// 表单校验规则
const loginRules = reactive({
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 4, max: 15, message: '长度应在 4 到 15 个字符', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' },
    ],
});

// 提交表单方法
const submitForm = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            // 校验成功，执行登录逻辑
            isLoading.value = true;

            const res = await login(loginForm)

            if (!res.code === 200) {
                ElMessage.error(res.message);
                return;
            }

            isLoading.value = false;
            ElMessage({
                message: '登录成功！正在跳转...',
                type: 'success',
            });
            await router.push('/home')

        } else {
            // 校验失败
            console.log('表单校验失败:', fields);
            ElMessage.error('请检查并完善表单内容');
        }
    });
};
</script>

<style scoped>
/* 容器设置，实现自适应左右布局 */
.login-container {
    display: flex;
    min-height: 100vh; /* 撑满视口高度 */
    background-color: #f0f2f5; /* 略微灰色的背景 */
}

/* 左侧介绍区域 */
.login-intro {
    flex: 1; /* 占据剩余空间 */
    background: linear-gradient(135deg, #409eff, #367cff); /* Element Plus 主色渐变 */
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
    position: relative; /* 用于放置版权信息 */
}

.intro-content {
    max-width: 400px;
    text-align: left;
}

.system-title {
    font-size: 28px;
    margin-bottom: 20px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.5);
    padding-bottom: 10px;
}

.system-slogan {
    font-size: 18px;
    margin-bottom: 30px;
    line-height: 1.5;
}

.features-list {
    list-style: none;
    padding: 0;
}

.features-list li {
    margin-bottom: 15px;
    font-size: 16px;
}

.copyright {
    position: absolute;
    bottom: 20px;
    font-size: 12px;
    opacity: 0.8;
}

/* 右侧登录表单区域 */
.login-form-wrapper {
    flex: 0 0 550px; /* 右侧固定宽度（在大屏下），或设置最大宽度 */
    max-width: 550px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    padding: 20px; /* 增加内边距以保证间距 */
}

.login-card {
    width: 100%;
    max-width: 400px; /* 限制表单最大宽度，居中 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 20px;
}

.form-title {
    text-align: center;
    font-size: 24px;
    color: #303133; /* Element Plus 默认深色 */
    margin-bottom: 30px;
}

/* 表单选项：记住我 & 忘记密码 */
.form-options {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: -10px; /* 调整与上一个输入框的间距 */
}

/* 登录按钮样式 */
.login-button {
    width: 100%;
    margin-top: 20px;
}

/* 媒体查询：适配小屏幕 */
@media (max-width: 992px) {
    .login-container {
        flex-direction: column; /* 小屏幕堆叠 */
    }

    .login-intro {
        flex: 0 0 200px; /* 介绍区域改为固定高度 */
        min-height: 200px;
    }

    .intro-content {
        text-align: center;
    }

    .system-title, .system-slogan {
        margin-bottom: 10px;
    }

    .features-list {
        display: none; /* 小屏幕隐藏特点列表 */
    }

    .login-form-wrapper {
        flex: 1 1 auto; /* 占据剩余空间 */
        max-width: 100%;
        padding: 30px 20px;
    }

    .login-card {
        max-width: 450px;
    }
}
</style>
