import request from "@/utils/request.js";


export const getRoutesByRole = () => {
    return request({
        url: '/roleMenu/list',
        method: 'post',
    })
}

export const createMenuApi = (data) => {
    return request({
        url: '/menu/add',
        method: 'post',
        data
    })
}

export const updateMenuApi = (data) => {
    return request({
        url: '/menu/update',
        method: 'post',
        data
    })
}

export const deleteMenuApi = (id) => {
    return request({
        url: `/menu/delete/${id}`,
        method: 'post'
    })
}
