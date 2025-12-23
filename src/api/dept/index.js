import request from "@/utils/request.js";

export const getDeptListApi = (data) => {
    return request({
        url: '/dept/list',
        method: 'post',
        data
    })
}

export const addDeptApi = (data) => {
    return request({
        url: '/dept/add',
        method: 'post',
        data
    })
}

export const updateDeptApi = (data) => {
    return request({
        url: '/dept/update',
        method: 'post',
        data
    })
}

export const deleteDeptApi = (id) => {
    return request({
        url: `/dept/delete/${id}`,
        method: 'post'
    })
}
