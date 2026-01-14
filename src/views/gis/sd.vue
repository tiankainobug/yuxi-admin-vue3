<template>
    <div class="container">
        <!-- 地图图层 -->
        <div id="map"></div>

        <!-- 底部按钮 -->
        <div class="main-bottom">
            <ul class="clearfix">
                <li>经度：{{ mapInfo.lon }}</li>
                <li>纬度：{{ mapInfo.lat }}</li>
                <li>层级：{{ mapInfo.level }}</li>
                <li>指北针角度：{{ mapInfo.angle }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
// 初始化地图
import { onMounted, reactive, ref } from "vue";
import { center, loadMap, map } from "@/utils/map/mapbox.js";
import mapboxgl from "mapbox-gl";
import { LineLayer, Mapbox, PointLayer, Scene } from "@antv/l7";
import sdJson from "/public/gis/data/city_sd.json"

let scene;
const mapInfo = reactive({
    lon: '',
    lat: '',
    level: '',
    angle: '',
    currentAdCode: '',
})

const initMap = async () => {
    await loadMap('map', '/rest/elec/sd_map/server/wmts', 'dark/dark-v11')

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')

    scene = new Scene({
        id: 'map',
        map: new Mapbox({
            mapInstance: map,
        }),
        logoVisible: false,
    })

    initEvent()

    // 添加山东地市边界
    const layer = new LineLayer({}).source(sdJson).size(20).shape('wall').style({
        opacity: 0.8,
        sourceColor: '#e49a7d',
        targetColor: '#FFFFFF',
    });
    scene.addLayer(layer);

    // 添加定位
    await handleAddLocation()
}

// 地图事件
const initEvent = () => {
    scene.on('zoom', (e) => {
        mapInfo.level = scene.getZoom().toFixed(2)
    })
    scene.on('move', () => {
        mapInfo.lon = scene.getCenter().lng.toFixed(6)
        mapInfo.lat = scene.getCenter().lat.toFixed(6)
        mapInfo.angle = scene.getPitch().toFixed(2)
    })
}

// 添加定位
const handleAddLocation = async () => {
    // 添加中心点图层
    await scene.addImage('location', '/public/gis/image/location.png')

    scene.addLayer(new PointLayer({
        id: 'location-png'
    }).source(
        [
            {
                lng: center[0],
                lat: center[1],
            }
        ],
{
            parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
            }
        }
    ).size(40).shape('location').style({
        opacity: 1,
    }))
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

.main-bottom {
    position: absolute;
    left: 50%;
    bottom: 14px;
    transform: translateX(-50%);
    height: 26px;
    background: #1b1b1b;
    border-radius: 4px;

    ul {
        li {
            position: relative;
            float: left;
            font-size: 12px;
            color: #ffffff;
            line-height: 26px;
            padding: 0 12px;

            &:not(:last-child)::after {
                position: absolute;
                top: 3px;
                right: 0;
                content: '';
                width: 1px;
                height: 80%;
                background: #797979;
                transform: scaleY(0.5);
            }
        }
    }
}

.clearfix {
    &:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }
}

ul{
    margin: 0;
    padding: 0;
    li{
        list-style: none;
    }
}

</style>
