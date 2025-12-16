import request from "@/utils/request.js";

export const getMenuTreeApi = () => {
    return request({
        url: '/menu',
        method: 'get'
    })
}
