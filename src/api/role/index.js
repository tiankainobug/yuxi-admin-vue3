import request from "@/utils/request.js";

export const getRoleListApi = (data) => {
    return request({
        url: '/role/list',
        method: 'post',
        data
    })
}

export const addRoleApi = (data) => {
    return request({
        url: '/role/add',
        method: 'post',
        data
    })
}

export const updateRoleApi = (data) => {
    return request({
        url: '/role/update',
        method: 'post',
        data
    })
}

export const deleteRoleApi = (id) => {
    return request({
        url: `/role/delete/${id}`,
        method: 'post'
    })
}

export const updateRoleMenuApi = (data) => {
    return request({
        url: '/roleMenu/update',
        method: 'post',
        data
    })
}
export const getRoleMenuApi = (data) => {
    return request({
        url: '/roleMenu/list',
        method: 'post',
        data
    })
}
