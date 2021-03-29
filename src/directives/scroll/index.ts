// 事件滚动，横向或纵向都可，默认纵向滚动

import './scroll.scss'

const speed = 100

export const scroll = {

  bind(el:any, binding:any) {
    let value = 'vertical'
    if (binding.value) {
      value = binding.value
    }
    el.__timer = null as any
    el.direction = value
    const sourceChildren = [...el.children]

    // 给元素设置类
    el.classList.add(`wrap-scroll${value === 'horizontal' ? '-' + value : ''}`)

    const listEle = document.createElement('div')
    listEle.className = 'v-scroll-list'
    sourceChildren.forEach(element => {
      listEle.appendChild(element)
    })
    // el.appendChild(listEle)

    const wrapEle = document.createElement('div')
    wrapEle.className = 'v-scroll-wrap'
    wrapEle.appendChild(listEle)

    el.appendChild(wrapEle)

    el.addEventListener('mouseover', () => {
      clearInterval(el.__timer)
    })
    el.addEventListener('mouseleave', () => {
      startScroll(el)
    })
  },
  inserted: function(el:any) {
    // 找到父元素，给父元素添加类
    startScroll(el)
  },
  unbind: function(el:any, binding:any) {
    // 销毁时清除定时器
    clearInterval(el.__timer)
  }
}

function startScroll(el:any) {
  clearInterval(el.__timer)
  let fn:any
  const ele = el.children[0]
  if (el.direction === 'vertical') {
    fn = () => {
      ele.scrollTop++
      if (ele.scrollTop >= ((ele.scrollHeight - ele.clientHeight) / 2 + ele.clientHeight / 2)) {
        ele.scrollTop = 0
      }
    }
  } else {
    fn = () => {
      ele.scrollLeft++
      if (ele.scrollLeft >= ((ele.scrollWidth - ele.clientWidth) / 2 + ele.clientWidth / 2)) {
        ele.scrollLeft = 0
      }
    }
  }
  el.__timer = setInterval(() => {
    fn()
  }, speed)
}
