<template>
  <div id="container" />
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import AMapLoader from '@amap/amap-jsapi-loader'
let map!:any
let AMap!:any
let object3Dlayer!:any

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
          center: [121.506082, 31.237561]
        })

        this.loadBuilding()// 加载模型
        this.radarScan()// 雷达扫描
        this.lightChange()// 改变光照

        this.underCircle()// 圆形笼罩
      })
      .catch(e => {
        console.log(e)
      })
  }

  private createMap() {}
  // 加载模型
  private loadBuilding() {
    var option = {
      position: new AMap.LngLat(121.499809, 31.239666),
      scale: 1000,
      height: 0,
      scene: 0
    }
    object3Dlayer = new AMap.Object3DLayer()
    map.add(object3Dlayer)

    var druckMeshes!: any, cityMeshes!: any

    map.plugin(['AMap.GltfLoader'], function() {
      var urlCity = 'https://a.amap.com/jsapi_demos/static/gltf-online/shanghai/scene.gltf'
      // var urlDuck = 'https://a.amap.com/jsapi_demos/static/gltf/Duck.gltf'
      var urlDuck = './models/duck.gltf'
      var paramCity = {
        position: new AMap.LngLat(121.510909, 31.233366), // 必须
        scale: 3580, // 非必须，默认1
        height: 1800, // 非必须，默认0
        scene: 0 // 非必须，默认0
      }

      var paramDuck = {
        position: new AMap.LngLat(121.495, 31.233366), // 必须
        scale: 800, // 非必须，默认1
        height: -100, // 非必须，默认0
        scene: 0 // 非必须，默认0
      }

      var paramBuild = {
        position: new AMap.LngLat(121.465, 31.232366), // 必须
        scale: 800, // 非必须，默认1
        height: 0, // 非必须，默认0
        scene: 0 // 非必须，默认0
      }

      var gltfObj = new AMap.GltfLoader()

      gltfObj.load(urlCity, function(gltfCity: any) {
        console.log('建筑加载成功')
        cityMeshes = gltfCity
        gltfCity.setOption(paramCity)
        gltfCity.rotateX(90)
        gltfCity.rotateZ(120)
        object3Dlayer.add(gltfCity)
      })

      gltfObj.load(urlDuck, function(gltfDuck: any) {
        console.log('鸭子加载成功')
        druckMeshes = gltfDuck
        gltfDuck.setOption(paramDuck)
        gltfDuck.rotateX(90)
        gltfDuck.rotateZ(-20)
        object3Dlayer.add(gltfDuck)
      })

      // loader.load('../models/Duck.gltf', function(gltfDuck: any) {
      //   console.log(gltfDuck, 'gltfDuck')
      //   druckMeshes = gltfDuck
      //   gltfDuck.setOption(paramDuck)
      //   gltfDuck.rotateX(90)
      //   gltfDuck.rotateZ(-20)
      //   object3Dlayer.add(gltfDuck)
      // })

      // gltfObj.load('/models/Duck.gltf', function(gltfDuck: any) {
      //   console.log(gltfDuck, 'gltfDuck')
      //   druckMeshes = gltfDuck
      //   gltfDuck.setOption(paramBuild)
      //   gltfDuck.rotateX(90)
      //   gltfDuck.rotateZ(-20)
      //   object3Dlayer.add(gltfDuck)
      // })
    })

    // 给gltf模型绑定事件
    map.on('click', function(ev:any) {
      var pixel = ev.pixel
      var px = new AMap.Pixel(pixel.x, pixel.y)
      var obj = map.getObject3DByContainerPos(px, [object3Dlayer], false) || {}
      if (obj && obj.object) {
        var meshId = obj.object.id
        if (druckMeshes && druckMeshes.layerMesh) {
          for (var i = 0; i < druckMeshes.layerMesh.length; i++) {
            if (meshId === druckMeshes.layerMesh[i].id) {
              return console.info('您点击了小黄鸭模型！')
            }
          }
        }

        if (cityMeshes && cityMeshes.layerMesh) {
          for (let i = 0; i < cityMeshes.layerMesh.length; i++) {
            if (meshId === cityMeshes.layerMesh[i].id) {
              return console.info('您点击了陆家嘴模型！')
            }
          }
        }
      }
    })
  }

  // 雷达扫描
  private radarScan() {
    var radar!:any
    var buildRadar = function() {
      radar = new AMap.Object3D.Mesh()
      radar.transparent = true
      radar.backOrFront = 'front'

      var geometry = radar.geometry
      var radius = 800 // 米
      radius = radius / map.getResolution([121.51267, 31.237395], 20)
      var unit = 1
      var range = 200
      var count = range / unit

      for (var i = 0; i < count; i += 1) {
        var angle1 = i * unit * Math.PI / 180
        var angle2 = (i + 1) * unit * Math.PI / 180

        var p1x = Math.cos(angle1) * radius
        var p1y = Math.sin(angle1) * radius
        var p2x = Math.cos(angle2) * radius
        var p2y = Math.sin(angle2) * radius

        geometry.vertices.push(0, 0, -600)
        geometry.vertices.push(p1x, p1y, -600)
        geometry.vertices.push(p2x, p2y, -600)

        var opacityStart = getOpacity(i / count)
        var opacityEnd = getOpacity((i + 1) / count)

        geometry.vertexColors.push(1, 0, 0, opacityStart)
        geometry.vertexColors.push(1, 0, 0, opacityStart)
        geometry.vertexColors.push(1, 0, 0, opacityEnd)
      }

      radar.position(map.getCenter())

      object3Dlayer.add(radar)
    }

    function getOpacity(scale:number) {
      return 1 - Math.pow(scale, 0.3)
    }

    function scan() {
      radar.rotateZ(-2)
      AMap.Util.requestAnimFrame(scan)
    }

    buildRadar()
    scan()
  }

  // 光照
  private lightChange() {
    map.DirectionLight = new AMap.Lights.DirectionLight([0, -1, 2], [1, 1, 1], 0.7)

    // 动态改变光照方向
    var angle = 90
    function changeLightDirection() {
      angle += 2
      var dir = [
        Math.cos(angle / 180 * Math.PI),
        -Math.sin(angle / 180 * Math.PI),
        2
      ]
      map.DirectionLight.setDirection(dir)
      map.render()
      AMap.Util.requestAnimFrame(changeLightDirection)
    }

    changeLightDirection()
  }

  private underCircle() {
    var center3d = map.lngLatToGeodeticCoord([121.507594, 31.234583])

    var topColor = [0, 1, 1, 0.9]
    var topFaceColor = [0, 1, 1, 0.4]
    var bottomColor = [0, 0, 1, 0.9]
    let cylinder!:any
    const index = 0.1

    var addRegularPrism = function(center:any, segment:number, height:number, radius:number) {
      cylinder = new AMap.Object3D.Mesh()
      var geometry = cylinder.geometry
      var verticesLength = segment * 2
      var path = []
      for (var i = 0; i < segment; i += 1) {
        var angle = 2 * Math.PI * i / segment
        var x = center.x + Math.cos(angle) * radius
        var y = center.y + Math.sin(angle) * radius
        path.push([x, y])
        geometry.vertices.push(x, y, -600) // 底部顶点
        geometry.vertices.push(x, y, -height) // 顶部顶点

        geometry.vertexColors.push.apply(geometry.vertexColors, bottomColor) // 底部颜色
        geometry.vertexColors.push.apply(geometry.vertexColors, topColor) // 顶部颜色

        var bottomIndex = i * 2
        var topIndex = bottomIndex + 1
        var nextBottomIndex = (bottomIndex + 2) % verticesLength
        var nextTopIndex = (bottomIndex + 3) % verticesLength

        geometry.faces.push(bottomIndex, topIndex, nextTopIndex) // 侧面三角形1
        geometry.faces.push(bottomIndex, nextTopIndex, nextBottomIndex) // 侧面三角形2
      }

      // 构建顶面三角形,为了区分顶面点和侧面点使用不一样的颜色,所以需要独立的顶点
      for (let i = 0; i < segment; i += 1) {
        geometry.vertices.push.apply(geometry.vertices, geometry.vertices.slice(i * 6 + 3, i * 6 + 6)) // 底部顶点
        geometry.vertexColors.push.apply(geometry.vertexColors, topFaceColor)
      }

      var triangles = AMap.GeometryUtil.triangulateShape(path)
      var offset = segment * 2

      for (let v = 0; v < triangles.length; v += 3) {
        geometry.faces.push(triangles[v] + offset, triangles[v + 2] + offset, triangles[v + 1] + offset)
      }

      cylinder.transparent = true // 如果使用了透明颜色，请设置true
      object3Dlayer.add(cylinder)
    }

    addRegularPrism(center3d.add(new AMap.Pixel(1500, 0)), 32, 1200, 900)// 圆柱

    function move() {
      // if (index > 0.9) {
      //   index = 0.1
      // } else {
      //   index += 0.1
      // }
      // var geometry = cylinder.geometry
      // // 构建顶面三角形,为了区分顶面点和侧面点使用不一样的颜色,所以需要独立的顶点
      // for (let i = 0; i < 32; i += 1) {
      //   geometry.vertices.push.apply(geometry.vertices, geometry.vertices.slice(i * 6 + 3, i * 6 + 6)) // 底部顶点
      //   geometry.vertexColors.push(geometry.vertexColors, [0, 1, 1, index])
      // }
      // cylinder.reDraw()
      console.log(cylinder, 'cylinder')
      // cylinder.rotateZ(-2)
      AMap.Util.requestAnimFrame(move)
    }

    // move()
  }
}
</script>
<style lang="scss" scoped>
#container {
  width: 100vw;
  height: 100vh;
}
</style>
