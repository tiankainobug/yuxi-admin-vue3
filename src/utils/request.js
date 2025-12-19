import axios from 'axios'
import { getStorage } from "@/utils/storage.js";

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
    async response => {
        const res = response.data

        return res
    },
    error => {
        console.error('err ' + error)
        return Promise.reject(error)
    }
)

export default service
