<template>
  <div class="magic">
    <div id="magicContainer" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js'
let container:any, camera:any, scene:any, renderer:any, mesh:any

@Component({
  name: 'Magic'
})
export default class extends Vue {
  mounted() {
    this.init()
  }

  private init() {
    container = document.getElementById('magicContainer')
    const posArr = [[1, 1, 1], [1, 1, 0], [1, 0, 1], [1, 0, 0], [0, 1, 1], [0, 1, 0], [0, 0, 1], [0, 0, 0]]

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x8fbcd4)

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
    // camera.position.z = 20
    camera.position.set(10, 10, 20)

    scene.add(new THREE.AmbientLight(0x8fbcd4, 0.4))

    const pointLight = new THREE.PointLight(0xffffff, 1)
    console.log(pointLight.position)
    pointLight.position.set(2, 2, 2)
    camera.add(pointLight)

    const geometry = this.createGeometry()

    const material = new THREE.MeshPhongMaterial({
      color: '#7afcea',
      flatShading: true,
      morphTargets: true
    })

    posArr.forEach(item => {
      mesh = new THREE.Mesh(geometry, material)

      mesh.position.set(...item)

      scene.add(mesh)
    })

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setAnimationLoop(function() {
      renderer.render(scene, camera)
    })
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false

    window.addEventListener('resize', this.onWindowResize)
  }

  private createGeometry() {
    const geometry:any = new THREE.BoxGeometry(0.94, 0.94, 0.94, 24, 24, 24)
    return geometry
  }

  private onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}
</script>
<style lang="scss" scoped>
.magic {
  width: 100vw;
  height: 100vh;
}
</style>
