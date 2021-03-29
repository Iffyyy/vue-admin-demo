<template>
  <div class="light">
    <div id="lightContainer" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js'
import { LightningStrike } from 'three/examples/jsm/geometries/LightningStrike.js'
import { LightningStorm } from 'three/examples/jsm/objects/LightningStorm.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'

let container:any, camera:any, scene:any, renderer:any, mesh:any, stats:any, composer:any, group:any, group1:any
const currentSceneIndex = 0

let currentTime = 0

let sceneCreators:any

const clock = new THREE.Clock()
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

@Component({
  name: 'Light'
})
export default class extends Vue {
  mounted() {
    // this.initMagic()
    sceneCreators = [
      this.createConesScene
    ]

    this.init()
    this.animate()
  }

  private initMagic() {
    container = document.getElementById('lightContainer')
    const posArr = [[1, 1, 1], [1, 1, 0], [1, 0, 1], [1, 0, 0], [0, 1, 1], [0, 1, 0], [0, 0, 1], [0, 0, 0]]

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x8fbcd4)

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
    // camera.position.z = 10
    camera.position.set(6, 10, 10)
    scene.add(camera)

    scene.add(new THREE.AmbientLight(0x8fbcd4, 0.4))

    const pointLight = new THREE.PointLight(0xffffff, 1)
    camera.add(pointLight)

    const geometry = this.createGeometry(0.94)

    const material = new THREE.MeshPhongMaterial({
      color: 0x02FFF6,
      flatShading: true,
      morphTargets: true
    })

    group = new THREE.Group()
    group.name = 'group'

    posArr.forEach(item => {
      mesh = new THREE.Mesh(geometry, material)

      mesh.position.set(...item)
      // mesh.position.y = item[1]
      // mesh.position.z = item[2]
      group.add(mesh)
    })

    scene.add(group)

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

  private createGeometry(r:number) {
    const geometry:any = new THREE.BoxGeometry(r, r, r)
    return geometry
  }

  private onWindowResize() {
    // camera.aspect = window.innerWidth / window.innerHeight
    // camera.updateProjectionMatrix()

    scene.userData.camera.aspect = window.innerWidth / window.innerHeight
    scene.userData.camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
  }

  private init() {
    container = document.getElementById('lightContainer')
    renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.outputEncoding = THREE.sRGBEncoding

    container.appendChild(renderer.domElement)

    composer = new EffectComposer(renderer)

    // @ts-ignore
    stats = new Stats()
    container.appendChild(stats.dom)

    this.createScene()
  }

  private createScene() {
    scene = sceneCreators[currentSceneIndex]()
    scene.userData.sceneIndex = currentSceneIndex

    scene.userData.timeRate = 1
    scene.userData.lightningColorRGB = [
      scene.userData.lightningColor.r * 255,
      scene.userData.lightningColor.g * 255,
      scene.userData.lightningColor.b * 255
    ]

    scene.userData.outlineColorRGB = [
      scene.userData.outlineColor.r * 255,
      scene.userData.outlineColor.g * 255,
      scene.userData.outlineColor.b * 255
    ]
  }

  //

  private animate() {
    requestAnimationFrame(this.animate)

    this.renderLightning()
    stats.update()
  }

  private renderLightning() {
    currentTime += scene.userData.timeRate * clock.getDelta()

    if (currentTime < 0) {
      currentTime = 0
    }

    scene.userData.render(currentTime)
  }

  private createOutline(scene:any, objectsArray:any, visibleColor:any) {
    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, scene.userData.camera, objectsArray)
    outlinePass.edgeStrength = 2.5
    outlinePass.edgeGlow = 0.7
    outlinePass.edgeThickness = 2.8
    outlinePass.visibleEdgeColor = visibleColor
    outlinePass.hiddenEdgeColor.set(0)
    composer.addPass(outlinePass)

    scene.userData.outlineEnabled = true

    return outlinePass
  }

  //

  private createConesScene() {
    const scene = new THREE.Scene()

    scene.background = new THREE.Color('#000938')

    scene.userData.canGoBackwardsInTime = true

    scene.userData.camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 200, 100000)

    // Lights

    scene.userData.lightningColor = new THREE.Color(0xB0FFFF)
    scene.userData.outlineColor = new THREE.Color('#ADFFF3')

    const posLight = new THREE.PointLight(0xffffff, 1)
    scene.add(posLight)

    // Ground

    // const ground = new THREE.Mesh(new THREE.PlaneGeometry(200000, 200000), new THREE.MeshPhongMaterial({ color: 0xC0C0C0, shininess: 0 }))
    // ground.rotation.x = -Math.PI * 0.5
    // scene.add(ground)

    // Cones

    const conesDistance = 1000
    const coneHeight = 200
    const coneHeightHalf = coneHeight * 0.5

    posLight.position.set(0, (conesDistance + coneHeight) * 0.5, 0)
    // posLight.color = scene.userData.outlineColor

    scene.userData.camera.position.set(5 * coneHeight, 4 * coneHeight, 18 * coneHeight)

    // 魔方
    const posArr = [[120, 120, 120], [120, 120, 0], [120, 0, 120], [120, 0, 0], [0, 120, 120], [0, 120, 0], [0, 0, 120], [0, 0, 0]]
    const geometry = this.createGeometry(110)
    const material = new THREE.MeshPhongMaterial({
      color: '#89FFEF',
      emissive: '#40bdac',
      flatShading: true,
      morphTargets: true
    })

    const coneMesh1 = new THREE.Group()
    const coneMesh2 = new THREE.Group()
    coneMesh1.name = 'group'
    coneMesh2.name = 'group1'

    posArr.forEach(item => {
      const mesh = new THREE.Mesh(geometry, material)
      const mesh1 = new THREE.Mesh(geometry, material)
      // @ts-ignore
      mesh.position.set(...item)

      // @ts-ignore
      mesh1.position.set(...item)

      coneMesh1.add(mesh)
      coneMesh2.add(mesh1)
    })

    // const coneMesh1 = new THREE.Mesh(geometry, material)
    // const coneMesh2 = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), material)

    // const coneMesh1 = new THREE.Mesh(new THREE.ConeGeometry(coneHeight, coneHeight, 30, 1, false), new THREE.MeshPhongMaterial({ color: 0xFFFF00, emissive: 0x1F1F00 }))
    coneMesh1.rotation.x = Math.PI
    coneMesh1.position.y = conesDistance + coneHeight
    scene.add(coneMesh1)

    // const coneMesh2 = new THREE.Mesh(new THREE.ConeGeometry(coneHeight, coneHeight, 30, 1, false), new THREE.MeshPhongMaterial({ color: 0xFF2020, emissive: 0x1F0202 }))
    coneMesh2.position.y = coneHeightHalf
    scene.add(coneMesh2)
    console.log(coneMesh1, coneMesh2)

    // Lightning strike
    scene.userData.lightningMaterial = new THREE.MeshBasicMaterial({ color: scene.userData.lightningColor })

    scene.userData.rayParams = {

      sourceOffset: new THREE.Vector3(),
      destOffset: new THREE.Vector3(),
      radius0: 4,
      radius1: 4,
      minRadius: 2.5,
      maxIterations: 7,
      isEternal: true,

      timeScale: 0.7,

      propagationTimeFactor: 0.05,
      vanishingTimeFactor: 0.95,
      subrayPeriod: 3.5,
      subrayDutyCycle: 0.6,
      maxSubrayRecursion: 3,
      ramification: 7,
      recursionProbability: 0.6,

      roughness: 0.85,
      straightness: 0.6

    }

    let lightningStrike:any
    let lightningStrikeMesh:any
    const outlineMeshArray:any = []

    scene.userData.recreateRay = function() {
      if (lightningStrikeMesh) {
        scene.remove(lightningStrikeMesh)
      }

      lightningStrike = new LightningStrike(scene.userData.rayParams)
      lightningStrikeMesh = new THREE.Mesh(lightningStrike, scene.userData.lightningMaterial)

      outlineMeshArray.length = 0
      outlineMeshArray.push(lightningStrikeMesh)

      scene.add(lightningStrikeMesh)
    }

    scene.userData.recreateRay()

    // Compose rendering

    composer.passes = []
    composer.addPass(new RenderPass(scene, scene.userData.camera))
    this.createOutline(scene, outlineMeshArray, scene.userData.outlineColor)

    // Controls

    const controls = new OrbitControls(scene.userData.camera, renderer.domElement)
    controls.target.y = (conesDistance + coneHeight) * 0.5
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    scene.userData.render = function(time:number) {
      // Move cones and Update ray position
      coneMesh1.position.set(Math.sin(0.5 * time) * conesDistance * 0.6, conesDistance + coneHeight, Math.cos(0.5 * time) * conesDistance * 0.6)
      coneMesh2.position.set(Math.sin(0.9 * time) * conesDistance, coneHeightHalf, 0)
      lightningStrike.rayParameters.sourceOffset.copy(coneMesh1.position)
      lightningStrike.rayParameters.sourceOffset.y -= coneHeightHalf
      lightningStrike.rayParameters.destOffset.copy(coneMesh2.position)
      lightningStrike.rayParameters.destOffset.y += coneHeightHalf

      lightningStrike.update(time)

      controls.update()

      // Update point light position to the middle of the ray
      posLight.position.lerpVectors(lightningStrike.rayParameters.sourceOffset, lightningStrike.rayParameters.destOffset, 0.5)

      if (scene.userData.outlineEnabled) {
        composer.render()
      } else {
        renderer.render(scene, scene.userData.camera)
      }
    }

    return scene
  }
}
</script>
<style lang="scss" scoped>
.light {
  width: 100vw;
  height: 100vh;
  color: #02FFF6;
  color: #40bdac;
}
</style>
