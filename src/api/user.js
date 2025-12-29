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

// 获取用户列表
export const getUserListApi = (data) => {
    return request({
        url: '/user/list',
        method: 'post',
        data
    })
}

// 新增用户
export const addUserApi = (data) => {
    return request({
        url: '/user/add',
        method: 'post',
        data
    })
}

// 更新用户
export const updateUserApi = (data) => {
    return request({
        url: '/user/update',
        method: 'post',
        data
    })
}

// 删除用户
export const deleteUserApi = (id) => {
    return request({
        url: `/user/delete/${id}`,
        method: 'post'
    })
}

// 重置用户密码
export const resetUserPasswordApi = (data) => {
    return request({
        url: '/user/resetPassword',
        method: 'post',
        data
    })
}

// 分配用户角色
export const assignUserRoleApi = (data) => {
    return request({
        url: '/user/assignRole',
        method: 'post',
        data
    })
}

// 获取用户角色
export const getUserRoleIdsApi = (data) => {
    return request({
        url: '/user/getRoleIds',
        method: 'post',
        data
    })
}