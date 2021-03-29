import './index.scss'

const speed = 100

export const table = {

  bind(el:any, binding:any) {
  },
  inserted: function(el:any) {
    // 找到父元素，给父元素添加类
    el.__timer = null as any

    const bodyWrapper = document.getElementsByClassName('el-table__body-wrapper')[0]
    console.log(bodyWrapper)
    const height = bodyWrapper.scrollHeight - bodyWrapper.clientHeight
    const timer:any = null
    console.log(el.scrollHeight, el.clientHeight)

    function startMove() {
      let scrollTop = bodyWrapper.scrollTop
      el.__timer = setInterval(() => {
        if (bodyWrapper.scrollTop >= height) {
          scrollTop = 0
        }
        bodyWrapper.scrollTop = scrollTop
        scrollTop += 0.1
      }, 20)
    }

    if (el.__timer) {
      clearInterval(el.__timer)
    }
    startMove()

    bodyWrapper.addEventListener('mouseover', () => {
      clearInterval(el.__timer)
    })
    bodyWrapper.addEventListener('mouseleave', () => {
      startMove()
    })
  },
  unbind: function(el:any, binding:any) {
    // 销毁时清除定时器
    clearInterval(el.__timer)
  }
}
