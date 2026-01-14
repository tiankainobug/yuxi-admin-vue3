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
import { LineLayer, Mapbox, Scene } from "@antv/l7";
import sdJson from "/public/gis/data/city_sd.json"

const initMap = async () => {
    await loadMap('map', '/rest/elec/sd_map/server/wmts', 'dark/dark-v11')

    map.setZoom(6.5)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')

    const scene = new Scene({
        id: 'map',
        map: new Mapbox({
            mapInstance: map,
        }),
    })

    const layer = new LineLayer({}).source(sdJson).size(40).shape('wall').style({
        opacity: 1,
        sourceColor: '#0DCCFF',
        targetColor: 'rbga(255,255,255, 0)',
    });
    scene.addLayer(layer);
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
