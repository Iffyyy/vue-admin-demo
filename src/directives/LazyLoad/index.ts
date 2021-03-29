// 图片懒加载，img的src换成v-LazyLoad
const LazyLoad = {
  // install方法
  install(Vue:any, options:any) {
    const defaultSrc = options.default
    Vue.directive('lazy', {
      bind(el:HTMLImageElement, binding:{value:string}) {
        LazyLoad.init(el, binding.value, defaultSrc)
      },
      inserted(el:HTMLImageElement) {
        if (IntersectionObserver) {
          LazyLoad.observe(el)
        } else {
          LazyLoad.listenerScroll(el)
        }
      }
    })
  },
  // 初始化
  init(el:HTMLImageElement, val:string, def:string) {
    el.setAttribute('data-src', val)
    el.setAttribute('src', def)
  },
  // 利用IntersectionObserver监听el
  observe(el:HTMLImageElement) {
    const io = new IntersectionObserver((entries) => {
      const realSrc = el.dataset.src
      if (entries[0].isIntersecting) {
        if (realSrc) {
          el.src = realSrc
          el.removeAttribute('data-src')
        }
      }
    })
    io.observe(el)
  },
  // 监听scroll事件
  listenerScroll(el:HTMLImageElement) {
    const handler = LazyLoad.throttle(LazyLoad.load, 300)
    LazyLoad.load(el)
    window.addEventListener('scroll', () => {
      handler(el)
    })
  },
  // 加载真实图片
  load(el:HTMLImageElement) {
    const windowHeight = document.documentElement.clientHeight
    const elTop = el.getBoundingClientRect().top
    const elBtm = el.getBoundingClientRect().bottom
    const realSrc = el.dataset.src
    if (elTop - windowHeight < 0 && elBtm > 0) {
      if (realSrc) {
        el.src = realSrc
        el.removeAttribute('data-src')
      }
    }
  },
  // 节流
  throttle(fn:Function, delay:number) {
    let timer:NodeJS.Timeout|null
    let prevTime:number
    return function(...args:any) {
      const currTime = Date.now()
      // @ts-ignore
      const context = this
      if (!prevTime) prevTime = currTime
      clearTimeout(timer as NodeJS.Timeout)

      if (currTime - prevTime > delay) {
        prevTime = currTime
        fn.apply(context, args)
        clearTimeout(timer as NodeJS.Timeout)
        return
      }

      timer = setTimeout(function() {
        prevTime = Date.now()
        timer = null
        fn.apply(context, args)
      }, delay)
    }
  }
}

export default LazyLoad
