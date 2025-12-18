import { defineStore } from "pinia";

const useRouteStore = defineStore('route', {
    state: () => ({
        dynamicRoutes: []
    }),
})

export default useRouteStore


