import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css"
import sdBounds from '/public/gis/data/sd.json'

export var map;
export const center = [ 117.198393, 36.700492 ]

/**
 * 底图url     serviceAgent/rest/elec/sd_map/server/wmts
 * 卫星底图url serviceAgent/rest/hdsat/sd_map/server/wmts
 */
export function loadMap(box) {
    return new Promise((resolve) => {
        let style = 'mapbox://styles/huguojinglearngis/cmkddtryh000a01slcmeh63wc'

        mapboxgl.accessToken =
            'pk.eyJ1IjoiaHVndW9qaW5nbGVhcm5naXMiLCJhIjoiY21kcHBjbTRiMGdnaDJqcXdwdnlxcGkzZSJ9.J4w3YpTZvBDJcX-PtsW5Lg'

        map = new mapboxgl.Map({
            container: box,
            style,
            preserveDrawingBuffer: true,
            center,
            zoom: 0,
            attributionControl: false,
            maxBounds: [[114.8022, 34.2262], [122.9346, 38.4800]],
        })

        map.on('load', () => {
            map.flyTo({
                center,
                zoom: 16,
                pitch: 10,
            })

            // 关键：监听 flyTo 结束
            map.once('moveend', () => {
                resolve(map)
            })
        })

        map.on('click', (e) => {
            const { lng, lat } = e.lngLat
            console.log(lng, lat)
        })
    })
}

