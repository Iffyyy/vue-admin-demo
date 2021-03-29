<template>
  <div id="cesiumContainer" />
</template>

<script>
import 'cesium/Build/Cesium/Widgets/widgets.css'
import * as Cesium from 'cesium'

let viewer

export default {
  name: '',
  mounted() {
    this.initMap()
    this.addCube()
  },

  methods: {
    initMap() {
      viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false, // 隐藏动画控件
        baseLayerPicker: false, // 隐藏图层选择控件
        fullscreenButton: false, // 隐藏全屏按钮
        vrButton: false, // 隐藏VR按钮，默认false
        geocoder: false, // 隐藏地名查找控件
        homeButton: false, // 隐藏Home按钮
        infoBox: false, // 隐藏点击要素之后显示的信息窗口
        sceneModePicker: false, // 隐藏场景模式选择控件
        selectionIndicator: true, // 显示实体对象选择框，默认true
        timeline: false, // 隐藏时间线控件
        navigationHelpButton: false, // 隐藏帮助按钮
        scene3DOnly: true, // 每个几何实例将只在3D中呈现，以节省GPU内存
        shouldAnimate: true, // 开启动画自动播放
        sceneMode: 3, // 初始场景模式 1：2D 2：2D循环 3：3D，默认3
        requestRenderMode: true, // 减少Cesium渲染新帧总时间并减少Cesium在应用程序中总体CPU使用率
        // 如场景中的元素没有随仿真时间变化，请考虑将设置maximumRenderTimeChange为较高的值，例如Infinity
        maximumRenderTimeChange: Infinity
      })

      viewer.cesiumWidget.creditContainer.style.display = 'none'
    },
    addCube() {
      // var viewer = new Cesium.CesiumWidget('cesiumContainer')

      // function onChanged(collection, added) {
      //   var msg = 'Added ids'
      //   for (var i = 0; i < added.length; i++) {
      //     msg += '\n' + added[i].id
      //   }
      // }
      // viewer.entities.collectionChanged.addEventListener(onChanged)

      /** 立方体 */
      var wyoming = viewer.entities.add({
        id: 'cube',
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([-109.080842, 45.002073, -105.91517, 45.002073, -104.058488, 44.996596, -104.053011, 43.002989, -104.053011, 41.003906, -105.728954, 40.998429, -107.919731, 41.003906, -109.04798, 40.998429, -111.047063, 40.998429, -111.047063, 42.000709, -111.047063, 44.476286, -111.05254, 45.002073]),
          height: 0,
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        }
      })

      wyoming.polygon.height = 200000
      wyoming.polygon.extrudedHeight = 250000
      wyoming.name = 'wyoming'
      wyoming.description = `
<img
  width="50%"
  style="float:left; margin: 0 1em 1em 0;"
  src="//cesium.com/docs/tutorials/creating-entities/Flag_of_Wyoming.svg"/>
<p>
  Wyoming is a state in the mountain region of the Western 
  United States.
</p>
<p>
  Wyoming is the 10th most extensive, but the least populous 
  and the second least densely populated of the 50 United 
  States. The western two thirds of the state is covered mostly 
  with the mountain ranges and rangelands in the foothills of 
  the eastern Rocky Mountains, while the eastern third of the 
  state is high elevation prairie known as the High Plains. 
  Cheyenne is the capital and the most populous city in Wyoming, 
  with a population estimate of 63,624 in 2017.
</p>
<p>
  Source: 
  <a style="color: WHITE"
    target="_blank"
    href="http://en.wikipedia.org/wiki/Wyoming">Wikpedia</a>
</p>`

      var citizensBankPark = viewer.entities.add({
        name: 'Citizens Bank Park',
        position: Cesium.Cartesian3.fromDegrees(-75.166493, 39.9060534),
        billboard: {
          image: '//cesium.com/images/docs/tutorials/creating-entities/Philadelphia_Phillies.png',
          width: 64,
          height: 64
        },
        label: {
          text: 'Citizens Bank Park',
          font: '14pt monospace',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -9)
        }
      })

      viewer.zoomTo(citizensBankPark)

      viewer.zoomTo(wyoming)
      var heading = Cesium.Math.toRadians(90)
      var pitch = Cesium.Math.toRadians(-30)
      viewer.zoomTo(wyoming, new Cesium.HeadingPitchRange(heading, pitch))

      setTimeout(() => {
        viewer.flyTo(wyoming).then(function(result) {
          if (result) {
            viewer.selectedEntity = wyoming
          }
        })
      }, 1000)

      // wyoming.position = Cesium.Cartesian3.fromDegrees(-107.724, 42.68);
      // viewer.trackedEntity = wyoming;
    },

    /**
     * Returns the list of entities at the provided window coordinates.
     * The entities are sorted front to back by their visual order.
     *
     * @param {Cartesian2} windowPosition The window coordinates.
     * @returns {Entity[]} The picked entities or undefined.
     */
    drillPickEntities(viewer, windowPosition) {
      var i
      var entity
      var picked
      var pickedPrimitives = viewer.scene.drillPick(windowPosition)
      var length = pickedPrimitives.length
      var result = []
      var hash = {}

      for (i = 0; i < length; i++) {
        picked = pickedPrimitives[i]
        entity = Cesium.defaultValue(picked.id, picked.primitive.id)
        if (entity instanceof Cesium.Entity && !Cesium.defined(hash[entity.id])) {
          result.push(entity)
          hash[entity.id] = true
        }
      }
      return result
    },

    /**
     * Returns the top-most entity at the provided window coordinates
     * or undefined if no entity is at that location.
     *
     * @param {Cartesian2} windowPosition The window coordinates.
     * @returns {Entity} The picked entity or undefined.
     */
    pickEntity(viewer, windowPosition) {
      var picked = viewer.scene.pick(windowPosition)
      if (Cesium.defined(picked)) {
        var id = Cesium.defaultValue(picked.id, picked.primitive.id)
        if (id instanceof Cesium.Entity) {
          return id
        }
      }
      return undefined
    }
  }
}
</script>

<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
