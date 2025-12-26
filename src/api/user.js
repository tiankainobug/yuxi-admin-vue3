// API 请求示例
import request from '@/utils/request'

// GET 请求示例
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  })
}

// POST 请求示例
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

// PUT 请求示例
export function updateUser(id, data) {
  return request({
    url: `/user/${id}`,
    method: 'put',
    data
  })
}

// DELETE 请求示例
export function deleteUser(id) {
  return request({
    url: `/user/${id}`,
    method: 'delete'
  })
}
