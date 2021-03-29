// 权限
function checkArray(key:string) {
  const arr = ['1', '2', '3', '4']
  const index = arr.indexOf(key)
  if (index > -1) {
    return true // 有权限
  } else {
    return false // 无权限
  }
}

const permission = {
  inserted: function(el:HTMLDivElement, binding:{value:string}) {
    const permission = binding.value // 获取到 v-permission的值
    if (permission) {
      const hasPermission = checkArray(permission)
      if (!hasPermission) {
        // 没有权限 移除Dom元素
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
}

export default permission
