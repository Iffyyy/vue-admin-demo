<template>
  <div id="earthContainer" class="earth">
    <div id="canvas" width="640" height="380" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import earthImg from '@/assets/earth.jpg'
import earthBg from '@/assets/bg_stars.jpg'

var scene: any, renderer: any, camera: any, orbitcontrols: any
var earthBall // 地球实体
var dom: any, handle: any, composer:any// 容器,定时器动画句柄

interface IEarthOptions{
  imgEarth:any,
  imgSky:any,
  autorotationSpeed:number,
  cameraZ:number,
  earthBallSize:number
}

@Component({
  name: 'Earth'
})
export default class extends Vue {
  mounted() {
    this.createEarth()
  }

  // 初始化
  private createEarth() {
    var earthOptions:IEarthOptions = {
      imgEarth: earthImg, // 地球贴图
      imgSky: earthBg, // 深空背景
      autorotationSpeed: 0.002, // 自转速度（正数自西向东转，负数为逆向）
      cameraZ: 200, // 摄像头高度,
      earthBallSize: 30 // 地球大小
    }

    this.init('earthContainer', earthOptions)
    this.addLightShadow(earthOptions)

    // 窗口resize事件
    window.onresize = function() {
      // 重新初始化尺寸
      camera.aspect = dom.clientWidth / dom.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(dom.clientWidth, dom.clientHeight)
    }
    // const  encEarth = new EncEarth('three-frame', earthOptions)
  }

  /**
   * 初始化地球，对象创建时自动调用
   */
  private init(_domID: string, _earthOptions: IEarthOptions) {
    // 获取地球容器
    dom = document.getElementById(_domID)
    var _imgSky = _earthOptions.imgSky ? _earthOptions.imgSky : ''
    dom.style.background = 'url(' + _imgSky + ') no-repeat center center'
    dom.style.backgroundColor = '#00000000'

    // 初始化场景
    scene = new THREE.Scene()
    // 初始化相机
    camera = new THREE.PerspectiveCamera(20, dom.clientWidth / dom.clientHeight, 1, 100000)
    // 设置相机位置
    camera.position.set(0, 0, _earthOptions.cameraZ ? _earthOptions.cameraZ : 200)
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })
    renderer.autoClear = false
    // 设置窗口尺寸
    renderer.setSize(dom.clientWidth, dom.clientHeight)
    // 初始化控制器
    orbitcontrols = new OrbitControls(camera, renderer.domElement)
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    orbitcontrols.enableDamping = true
    // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
    // orbitcontrols.dampingFactor = 0.2;
    dom.appendChild(renderer.domElement)
    // 设置光线
    scene.add(new THREE.HemisphereLight('#ffffff', '#ffffff', 1))
    // 定义地球材质
    var earthTexture = new THREE.TextureLoader().load(_earthOptions.imgEarth, undefined, function() {
      renderer.render(scene, camera)
    })
    // 创建地球
    earthBall = new THREE.Mesh(
      new THREE.SphereGeometry(_earthOptions.earthBallSize, 50, 50),
      new THREE.MeshBasicMaterial({
        map: earthTexture
      })
    )
    earthBall.layers.set(0)
    scene.add(earthBall)
    // this.renderEarthByRender();
    render()

    // 执行函数
    function render() {
      if (handle) {
        cancelAnimationFrame(handle)
      }

      // 是否开启了辉光渲染，如开启则开启辉光渲染
      if (composer) {
        composer.render()
      }

      renderer.clearDepth()
      // 自转
      scene.rotation.y += _earthOptions.autorotationSpeed ? _earthOptions.autorotationSpeed : 0
      renderer.render(scene, camera)
      orbitcontrols.update()
      handle = requestAnimationFrame(render)
    }
  }

  private addLightShadow(_earthOptions:IEarthOptions) {
    const _pBuffer:number = 0.8// 光晕

    var vertexShader = [
      'varying vec3 vNormal;',

      'void main() {',

      'vNormal = normalize( normalMatrix * normal );',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

      '}'
    ].join('\n')

    var fragmentShader2 = [
      'uniform float c;',
      'uniform float p;',
      'varying vec3 vNormal;',

      'void main() {',

      'float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), p );',
      'gl_FragColor = vec4( 1, 1, 1, 1 ) * intensity;',
      '}'
    ].join('\n')

    var materialGlow = new THREE.ShaderMaterial({
      fragmentShader: fragmentShader2,
      vertexShader: vertexShader,
      uniforms: {
        c: { value: 0.9 },
        p: { value: 10.17 }
      },
      depthWrite: false,
      side: THREE.BackSide
    })

    // 然后创建一个object，类型为Mesh。他的参数使我们之前创的几何模型以及材料
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(_earthOptions.earthBallSize + _pBuffer, 50, 50).clone(), materialGlow)
    sphere.position.set(0, 0, 0)
    scene.add(sphere)
  }
}
</script>
<style lang="scss" scoped>
.earth {
  width: 100vw;
  height: 100vh;
  background: center / 100% 100% url('~@/assets/bg_stars.jpg') no-repeat;
}
</style>
