import { defineStore } from "pinia";
import { buildRouterTree } from "@/router/routerUtils.js";
import { getRoutes } from "@/api/menu/index.js";

const useRouteStore = defineStore('route', {
    state: () => ({
        routes: []
    }),
    actions: {
        async getRoutes() {
            const res = await getRoutes()
            if (res.code === 200) {
                this.routes = buildRouterTree(res.data)
                return true
            }
            return false
        },
    }
})

export default useRouteStore


