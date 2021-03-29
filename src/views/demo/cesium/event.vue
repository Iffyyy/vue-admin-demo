<template>
  <div>
    <div id="cesiumContainer" />
    <div class="heatmap" style="overflow: hidden; width: 840px;height: 400px;">
      <div class="heatmap-canvas" width="50%" height="25%" />
    </div>
  </div>
</template>

<script>
import 'cesium/Build/Cesium/Widgets/widgets.css'
import * as Cesium from 'cesium'

export default {
  name: 'Map',
  mounted() {
    this.init()
  },
  methods: {
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
