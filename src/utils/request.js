import axios from 'axios'
import { getStorage } from "@/utils/storage.js";
import { ElMessage } from "element-plus";
import router from "@/router/index.js";

// 创建 axios 实例
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API, // url = base url + request url
    timeout: 5000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 添加认证token等操作
        if (getStorage('token')) {
            config.headers['Authorization'] = `Bearer ${ getStorage('token') }`
        }
        return config
    },
    error => {
        // 对请求错误做些什么
        console.log(error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data

        // 如果返回的状态码不是200，则进行错误处理
        if (res.code === 401 || res.code === 403) {
            ElMessage.warning(res.message)
            router.push({
                path: '/login',
                query: { redirect: router.currentRoute.value.fullPath }
            })
            return res
        }

        if (res.code !== 200) {
            ElMessage.error(res.message)
            return Promise.reject(res)
        }

        return res
    },
    error => {
        console.error('err ' + error)
        return Promise.reject(error)
    }
)

export default service
