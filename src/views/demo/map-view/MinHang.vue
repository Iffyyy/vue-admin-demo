<template>
  <div id="container" />
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import AMapLoader from '@amap/amap-jsapi-loader'
let map!: any
let AMap!: any
let object3Dlayer!: any

@Component({
  name: 'MapView'
})
export default class extends Vue {
  mounted() {
    AMapLoader.load({
      key: '550ca3bb7f6fb4cb6f8b03634eef9be8', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      AMapUI: {
        // 是否加载 AMapUI，缺省不加载
        version: '1.1', // AMapUI 缺省 1.1
        plugins: [] // 需要加载的 AMapUI ui插件
      },
      Loca: {
        // 是否加载 Loca， 缺省不加载
        version: '1.3.2' // Loca 版本，缺省 1.3.2
      }
    })
      .then(aMap => {
        AMap = aMap
        // 创建地图实例
        map = new AMap.Map('container', {
          viewMode: '3D',
          pitch: 60,
          rotation: 25,
          showBuilding: false,
          zoom: 16,
          showIndoorMap: false,
          features: ['bg', 'road'], // 地图要素
          mapStyle: 'amap://styles/349cd58a05cbecf74305c7a6d09ec671',
          center: [121.38607968649384, 31.16295983749796]
        })

        // 设置光照
        map.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.5)
        map.DirectionLight = new AMap.Lights.DirectionLight([0, 0, 1], [1, 1, 1], 1)

        var object3Dlayer = new AMap.Object3DLayer()
        map.add(object3Dlayer)

        var bounds = [[121.38607968649384, 31.16295983749796, 121.38629687403963, 31.162495120005435, 121.38727477216342, 31.16278092934226, 121.38780640308542, 31.161209889580082, 121.38765541862529, 31.161167917741118, 121.38774552495815, 31.160903079452765, 121.38400403394066, 31.15951099091605, 121.38219615439806, 31.159155236136566, 121.38164412896084, 31.161713668816912, 121.38132882820136, 31.162460213945675, 121.38107842689035, 31.163460600931, 121.38079931112088, 31.16374443114162, 121.38047302518505, 31.164452999431273, 121.38607968649384, 31.16295983749796]]

        var height = 5000
        var color = '#0088ffcc' // rgba
        var prism = new AMap.Object3D.Prism({
          path: bounds,
          height: height,
          color: color
        })

        prism.transparent = true
        object3Dlayer.add(prism)
      })
      .catch(e => {
        console.log(e)
      })
  }
}
</script>
<style lang="scss" scoped>
#container {
  width: 100vw;
  height: 100vh;
}
</style>
