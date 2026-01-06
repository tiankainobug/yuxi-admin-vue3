<template>
    <div class="container">
        <!-- 地图图层 -->
        <div id="map"></div>
    </div>
</template>

<script setup>
// 初始化地图
import { onMounted } from "vue";
import { loadMap, map } from "@/utils/map/mapbox.js";
import mapboxgl from "mapbox-gl";

const initMap = async () => {
    await loadMap('map', '/rest/elec/sd_map/server/wmts', 'dark/dark-v11')

    map.setZoom(6.5)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
}

onMounted(() => {
    initMap()
})
</script>

<style scoped>
.container {
    width: 100%;
    height: 100%;
}
#map {
    width: 100%;
    height: 100%;
}

</style>
