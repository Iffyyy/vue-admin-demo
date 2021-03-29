// 防抖，防止重复提交
const debounce = {
  inserted: function(el:HTMLDivElement, binding:{value:Function}) {
    let timer:NodeJS.Timeout|null = null
    el.addEventListener('click', () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        binding.value()
      }, 1000)
    })
  }
}

export default debounce
