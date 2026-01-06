import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css"

export var map;

/**
 * 底图url     serviceAgent/rest/elec/sd_map/server/wmts
 * 卫星底图url serviceAgent/rest/hdsat/sd_map/server/wmts
 */
export async function loadMap(box) {
    let style = 'mapbox://styles/mapbox/streets-v12'

    mapboxgl.accessToken = "pk.eyJ1IjoiNjc2NzEyODM1IiwiYSI6ImNsNXZ0YTNieTAwczUza25zbzljcmk2cTAifQ.ENcgO0d8c8M72x08yuiWWA";
    map = new mapboxgl.Map({
        container: box, //前端定义的ID
        style: style, // 样式
        preserveDrawingBuffer: true,  //  拍照用到
        center: [ 118.593359, 36.279178 ],
        zoom: 16,
    });
    map.on("load", () => {

    });
}
