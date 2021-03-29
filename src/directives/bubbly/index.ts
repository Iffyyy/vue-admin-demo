// 按钮或元素点击产生冒泡效果
import './index.scss'

export const bubbly = {
  bind(el:HTMLDivElement, binding:any) {
    el.addEventListener('click', (e:any) => {
      el.classList.add('bubbly-button')

      // e.preventDefault()
      // reset animation
      el.classList.remove('animate')

      el.classList.add('animate')
      setTimeout(function() {
        el.classList.remove('animate')
      }, 700)
    }, false)
  }
}
