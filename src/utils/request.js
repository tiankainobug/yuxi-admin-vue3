import axios from 'axios'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 可以添加认证token等操作
    // 注意：这里的 token 获取逻辑需要根据实际项目调整
    // 暂时注释掉，因为我们还没有实现 store 和 getToken
    /*
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    */
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
    if (res.code !== 200) {
      console.error('接口调用异常:', res.message || 'Error')
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.error('err' + error)
    return Promise.reject(error)
  }
)

export default service