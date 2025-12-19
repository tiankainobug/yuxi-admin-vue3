import request from "@/utils/request.js";

export const getMenuTreeApi = () => {
    return request({
        url: '/menu',
        method: 'get'
    })
}

export const getMenuListApi = () => {
    return request({
        url: '/menu/list',
        method: 'get'
    })
}

export const createMenuApi = (data) => {
    return request({
        url: '/menu/create',
        method: 'post',
        data
    })
}

export const updateMenuApi = (id, data) => {
    return request({
        url: `/menu/update/${id}`,
        method: 'put',
        data
    })
}

export const deleteMenuApi = (id) => {
    return request({
        url: `/menu/delete/${id}`,
        method: 'delete'
    })
}
