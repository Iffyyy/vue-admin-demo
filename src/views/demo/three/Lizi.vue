<template>
  <div class="lizi">
    <div id="liziContainer" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { WEBGL } from 'three/examples/jsm/WebGL.js'
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js'
import spark1 from '@/assets/spark1.png'

if (WEBGL.isWebGL2Available() === false) {
  document.body.appendChild(WEBGL.getWebGL2ErrorMessage())
}

// 星星
const vertexshader = `
    attribute float size;
    attribute vec3 customColor;
    varying vec3 vColor;

    void main() {
      vColor = customColor;
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_PointSize = size * ( 300.0 / -mvPosition.z );
      gl_Position = projectionMatrix * mvPosition;
    }
      `

const fragmentshader = `
      uniform vec3 color;
      uniform sampler2D pointTexture;
      varying vec3 vColor;

      void main() {
        gl_FragColor = vec4( color * vColor, 1.0 );
        gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
      }
      `

let renderer:any, scene:any, camera:any, stats:any

let sphere:any, mesh:any

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

// 粒子
let group:any
let container:any, stats1
const particlesData:any = []
let camera1, scene1, renderer1
let positions, colors
let particles
let pointCloud:any
let particlePositions:any
let linesMesh:any

const maxParticleCount = 100
const particleCount = 50
const r = 140
const rHalf = r / 2

const effectController = {
  showDots: true,
  showLines: true,
  minDistance: 50,
  limitConnections: false,
  maxConnections: 10,
  particleCount: 500,
  speed: 0.1
}

@Component({
  name: 'Lizi'
})
export default class extends Vue {
  mounted() {
    this.initStar()
    this.animateStar()
    this.initLizi()
    this.animateLizi()
    this.initSmock()
    this.animateSmock()
  }

  private initStar() {
    camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 1, 10000)
    camera.position.z = 300

    scene = new THREE.Scene()
    scene.background = new THREE.Color('#04121D')

    // 星星
    const amount = 1000 * 2
    const radius = 200
    const positions = new Float32Array(amount * 3)
    const colors = new Float32Array(amount * 3)
    const sizes = new Float32Array(amount)

    const vertex = new THREE.Vector3()
    const color = new THREE.Color(0xffffff)

    for (let i = 0; i < amount; i++) {
      vertex.x = (Math.random() * 2 - 1) * radius
      vertex.y = (Math.random() * 2 - 1) * radius
      vertex.z = (Math.random() * 2 - 1) * radius
      vertex.toArray(positions, i * 3)

      // if (vertex.x < 0) {
      //   color.setHSL(0.5 + 0.1 * (i / amount), 0.7, 0.5)
      // } else {
      //   color.setHSL(0.0 + 0.1 * (i / amount), 0.9, 0.5)
      // }
      color.setHSL(0.6 + 0.02 * (i / amount), 0.7, 0.6)

      color.toArray(colors, i * 3)

      sizes[i] = 10
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    //

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
        pointTexture: { value: new THREE.TextureLoader().load(spark1) }
      },
      vertexShader: vertexshader,
      fragmentShader: fragmentshader,

      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    })

    sphere = new THREE.Points(geometry, material)
    scene.add(sphere)

    renderer = new THREE.WebGLRenderer()
    // renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(WIDTH, HEIGHT)

    container = document.getElementById('liziContainer')
    if (container) {
      container.appendChild(renderer.domElement)
      // @ts-ignore
      stats = new Stats()
      container.appendChild(stats.dom)
    }

    //

    window.addEventListener('resize', this.onWindowResize)
  }

  private renderStar() {
    const time = Date.now() * 0.005

    sphere.rotation.z = 0.003 * time

    const geometry = sphere.geometry
    const attributes = geometry.attributes

    for (let i = 0; i < attributes.size.array.length; i++) {
      attributes.size.array[i] = 5 + 4 * Math.sin(0.1 * i + time)
    }

    attributes.size.needsUpdate = true

    renderer.render(scene, camera)
  }

  private animateStar() {
    requestAnimationFrame(this.animateStar)

    this.renderStar()
    stats.update()
  }

  private initLizi() {
    if (!container) return

    group = new THREE.Group()
    scene.add(group)

    // 线
    const segments = maxParticleCount * maxParticleCount
    positions = new Float32Array(segments * 3)
    colors = new Float32Array(segments * 3)

    // 点
    const color = new THREE.Color(0xffffff)
    particles = new THREE.BufferGeometry()
    particlePositions = new Float32Array(maxParticleCount * 3)
    const colorsP = new Float32Array(maxParticleCount * 3)
    const sizes = new Float32Array(maxParticleCount)

    for (let i = 0; i < maxParticleCount; i++) {
      const x = Math.random() * r - r / 2
      const y = Math.random() * r - r / 2
      const z = Math.random() * r - r / 2
      const temp = i * 3

      particlePositions[temp] = x
      particlePositions[temp + 1] = y
      particlePositions[temp + 2] = z

      // add it to the geometry
      particlesData.push({
        velocity: new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2),
        numConnections: 0
      })

      color.setHSL(0.6 + 0.03 * (i / maxParticleCount), 1, 0.6)

      color.toArray(colorsP, temp)
      color.toArray(colors, temp)
      sizes[i] = 30
    }

    particles.setDrawRange(0, particleCount)
    particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setUsage(THREE.DynamicDrawUsage))
    particles.setAttribute('customColor', new THREE.BufferAttribute(colorsP, 3))
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 2))

    // create the particle system

    const pMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
        pointTexture: { value: new THREE.TextureLoader().load(spark1) }
      },
      vertexShader: vertexshader,
      fragmentShader: fragmentshader,

      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    })
    pointCloud = new THREE.Points(particles, pMaterial)
    group.add(pointCloud)

    // 线

    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage))

    geometry.computeBoundingSphere()
    geometry.setDrawRange(0, 0)

    const material = new THREE.LineBasicMaterial({
      color: 0x1E67BB,
      linewidth: 4,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true
    })

    linesMesh = new THREE.LineSegments(geometry, material)
    group.add(linesMesh)

    //

    // renderer = new THREE.WebGLRenderer({ antialias: true })
    // renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.outputEncoding = THREE.sRGBEncoding

    container.appendChild(renderer.domElement)

    // @ts-ignore
    // stats = new Stats()
    container.appendChild(stats.dom)

    window.addEventListener('resize', this.onWindowResize)
  }

  private onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  private animateLizi() {
    let vertexpos = 0
    let colorpos = 0
    let numConnected = 0

    for (let i = 0; i < particleCount; i++) { particlesData[i].numConnections = 0 }

    for (let i = 0; i < particleCount; i++) {
      // get the particle
      const particleData = particlesData[i]
      const temp = i * 3

      particlePositions[temp] += particleData.velocity.x * effectController.speed
      particlePositions[temp + 1] += particleData.velocity.y * effectController.speed
      particlePositions[temp + 2] += particleData.velocity.z * effectController.speed

      if (particlePositions[temp + 1] < -rHalf || particlePositions[temp + 1] > rHalf) { particleData.velocity.y = -particleData.velocity.y }

      if (particlePositions[temp] < -rHalf || particlePositions[temp] > rHalf) { particleData.velocity.x = -particleData.velocity.x }

      if (particlePositions[temp + 2] < -rHalf || particlePositions[temp + 2] > rHalf) { particleData.velocity.z = -particleData.velocity.z }

      if (effectController.limitConnections && particleData.numConnections >= effectController.maxConnections) { continue }

      // Check collision
      for (let j = i + 1; j < particleCount; j++) {
        const particleDataB = particlesData[j]
        if (effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections) { continue }

        const dx = particlePositions[temp] - particlePositions[j * 3]
        const dy = particlePositions[temp + 1] - particlePositions[j * 3 + 1]
        const dz = particlePositions[temp + 2] - particlePositions[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < effectController.minDistance) {
          particleData.numConnections++
          particleDataB.numConnections++

          const alpha = 1.0 - dist / effectController.minDistance

          positions[vertexpos++] = particlePositions[temp]
          positions[vertexpos++] = particlePositions[temp + 1]
          positions[vertexpos++] = particlePositions[temp + 2]

          positions[vertexpos++] = particlePositions[j * 3]
          positions[vertexpos++] = particlePositions[j * 3 + 1]
          positions[vertexpos++] = particlePositions[j * 3 + 2]

          colors[colorpos++] = alpha
          colors[colorpos++] = alpha
          colors[colorpos++] = alpha

          colors[colorpos++] = alpha
          colors[colorpos++] = alpha
          colors[colorpos++] = alpha

          numConnected++
        }
      }
    }

    linesMesh.geometry.setDrawRange(0, numConnected * 2)
    linesMesh.geometry.attributes.position.needsUpdate = true
    linesMesh.geometry.attributes.color.needsUpdate = true

    pointCloud.geometry.attributes.position.needsUpdate = true

    requestAnimationFrame(this.animateLizi)

    stats.update()
    this.renderLizi()
  }

  private renderLizi() {
    const time = Date.now() * 0.001

    group.rotation.y = time * 0.1
    renderer.render(scene, camera)
  }

  private initSmock() {
    // renderer = new THREE.WebGLRenderer()
    // renderer.setPixelRatio(window.devicePixelRatio)
    // renderer.setSize(window.innerWidth, window.innerHeight)
    // document.body.appendChild(renderer.domElement)

    // camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    // camera.position.set(0, 0, 1.5)

    // eslint-disable-next-line no-new
    new OrbitControls(camera, renderer.domElement)

    // Sky

    // const canvas = document.createElement('canvas')
    // canvas.width = 1
    // canvas.height = 32

    // const context = canvas.getContext('2d')
    // if (!context) return
    // const gradient = context.createLinearGradient(0, 0, 0, 32)
    // gradient.addColorStop(0.0, '#014a84')
    // gradient.addColorStop(0.5, '#0561a0')
    // gradient.addColorStop(1.0, '#437ab6')
    // context.fillStyle = gradient
    // context.fillRect(0, 0, 1, 32)

    // const sky = new THREE.Mesh(
    //   new THREE.SphereGeometry(10),
    //   new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), side: THREE.BackSide })
    // )
    // scene.add(sky)

    // Texture

    const size = 128
    const data = new Uint8Array(size * size * size)

    let i = 0
    const scale = 0.05
    const perlin = new ImprovedNoise()
    const vector = new THREE.Vector3()

    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const d = 1.0 - vector.set(x, y, z).subScalar(size / 2).divideScalar(size).length()
          data[i] = (size + size * perlin.noise(x * scale / 1.5, y * scale, z * scale / 1.5)) * d * d
          i++
        }
      }
    }

    const texture = new THREE.DataTexture3D(data, size, size, size)
    texture.format = THREE.RedFormat
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.unpackAlignment = 1

    // Material

    const vertexShader = /* glsl */`
     in vec3 position;
     uniform mat4 modelMatrix;
     uniform mat4 modelViewMatrix;
     uniform mat4 projectionMatrix;
     uniform vec3 cameraPos;
     out vec3 vOrigin;
     out vec3 vDirection;
     void main() {
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      vOrigin = vec3( inverse( modelMatrix ) * vec4( cameraPos, 1.0 ) ).xyz;
      vDirection = position - vOrigin;
      gl_Position = projectionMatrix * mvPosition;
     }
    `

    const fragmentShader = /* glsl */`
     precision highp float;
     precision highp sampler3D;
     uniform mat4 modelViewMatrix;
     uniform mat4 projectionMatrix;
     in vec3 vOrigin;
     in vec3 vDirection;
     out vec4 color;
     uniform vec3 base;
     uniform sampler3D map;
     uniform float threshold;
     uniform float range;
     uniform float opacity;
     uniform float steps;
     uniform float frame;
     uint wang_hash(uint seed)
     {
       seed = (seed ^ 61u) ^ (seed >> 16u);
       seed *= 9u;
       seed = seed ^ (seed >> 4u);
       seed *= 0x27d4eb2du;
       seed = seed ^ (seed >> 15u);
       return seed;
     }
     float randomFloat(inout uint seed)
     {
       return float(wang_hash(seed)) / 4294967296.;
     }
     vec2 hitBox( vec3 orig, vec3 dir ) {
      const vec3 box_min = vec3( - 0.5 );
      const vec3 box_max = vec3( 0.5 );
      vec3 inv_dir = 1.0 / dir;
      vec3 tmin_tmp = ( box_min - orig ) * inv_dir;
      vec3 tmax_tmp = ( box_max - orig ) * inv_dir;
      vec3 tmin = min( tmin_tmp, tmax_tmp );
      vec3 tmax = max( tmin_tmp, tmax_tmp );
      float t0 = max( tmin.x, max( tmin.y, tmin.z ) );
      float t1 = min( tmax.x, min( tmax.y, tmax.z ) );
      return vec2( t0, t1 );
     }
     float sample1( vec3 p ) {
      return texture( map, p ).r;
     }
     float shading( vec3 coord ) {
      float step = 0.01;
      return sample1( coord + vec3( - step ) ) - sample1( coord + vec3( step ) );
     }
     void main(){
      vec3 rayDir = normalize( vDirection );
      vec2 bounds = hitBox( vOrigin, rayDir );
      if ( bounds.x > bounds.y ) discard;
      bounds.x = max( bounds.x, 0.0 );
      vec3 p = vOrigin + bounds.x * rayDir;
      vec3 inc = 1.0 / abs( rayDir );
      float delta = min( inc.x, min( inc.y, inc.z ) );
      delta /= steps;
      // Jitter
      // Nice little seed from
      // https://blog.demofox.org/2020/05/25/casual-shadertoy-path-tracing-1-basic-camera-diffuse-emissive/
      uint seed = uint( gl_FragCoord.x ) * uint( 1973 ) + uint( gl_FragCoord.y ) * uint( 9277 ) + uint( frame ) * uint( 26699 );
      vec3 size = vec3( textureSize( map, 0 ) );
      float randNum = randomFloat( seed ) * 2.0 - 1.0;
      p += rayDir * randNum * ( 1.0 / size );
      //
      vec4 ac = vec4( base, 0.0 );
      for ( float t = bounds.x; t < bounds.y; t += delta ) {
       float d = sample1( p + 0.5 );
       d = smoothstep( threshold - range, threshold + range, d ) * opacity;
       float col = shading( p + 0.5 ) * 3.0 + ( ( p.x + p.y ) * 0.25 ) + 0.2;
       ac.rgb += ( 1.0 - ac.a ) * d * col;
       ac.a += ( 1.0 - ac.a ) * d;
       if ( ac.a >= 0.95 ) break;
       p += rayDir * delta;
      }
      color = ac;
      if ( color.a == 0.0 ) discard;
     }
    `

    const geometry = new THREE.BoxGeometry(1400, 1400, 1400)
    const material = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms: {
        base: { value: new THREE.Color(0x1A7ED3) },
        map: { value: texture },
        cameraPos: { value: new THREE.Vector3() },
        threshold: { value: 0.25 },
        opacity: { value: 0.05 },
        range: { value: 0.1 },
        steps: { value: 100 },
        frame: { value: 0 }
      },
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
      transparent: true
    })

    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    //

    const parameters = {
      threshold: 0.25,
      opacity: 0.25,
      range: 0.1,
      steps: 100
    }

    function update() {
      material.uniforms.threshold.value = parameters.threshold
      material.uniforms.opacity.value = parameters.opacity
      material.uniforms.range.value = parameters.range
      material.uniforms.steps.value = parameters.steps
    }

    window.addEventListener('resize', this.onWindowResize)
  }

  private animateSmock() {
    requestAnimationFrame(this.animateSmock)

    mesh.material.uniforms.cameraPos.value.copy({ x: 0, y: 0, z: 1.5 })
    mesh.rotation.y = -performance.now() / 7500

    mesh.material.uniforms.frame.value++

    renderer.render(scene, camera)
  }
}
</script>
<style lang="scss" scoped>
.lizi {
  width: 100vw;
  height: 100vh;
}

#liziContainer {
  & ::v-deep >div{
    display: none;
  }
}
</style>
