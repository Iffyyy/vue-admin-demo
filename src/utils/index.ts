// Parse the time to string
export const parseTime = (
  time?: object | string | number | null,
  cFormat?: string
): string | null => {
  if (time === undefined || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: Date
  if (typeof time === 'object') {
    date = time as Date
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: { [key: string]: number } = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}

export const requestAllFile = (modulesFiles:__WebpackModuleApi.RequireContext, type:string = '.vue') => {
  const modules:{ [key: string]: any} = modulesFiles
    .keys()
    .reduce((modules, modulePath) => {
      const moduleName: string = modulePath.replace(new RegExp(`^./(.*)\\${type}`), '$1')
      const value = modulesFiles(modulePath)
      modules[moduleName] = value.default
      return modules
    }, {} as { [key: string]: any})
  return modules
}

// Format and filter json data using filterKeys array
export const formatJson = (filterKeys: any, jsonData: any) =>
  jsonData.map((data: any) => filterKeys.map((key: string) => {
    if (key === 'timestamp') {
      return parseTime(data[key])
    } else {
      return data[key]
    }
  }))

/**
  * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
  * @return {*}
 */
export function debounce(func:Function, wait:number, immediate:boolean) {
  let timeout:NodeJS.Timeout|null, args:IArguments|null, context:any, timestamp:number, result:any

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  // @ts-ignore
  return function(...args) {
    // @ts-ignore
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      // @ts-ignore
      context = args = null
    }

    return result
  }
}

export function throttle(fn: Function, delay: number) {
  // last为上一次触发回调的时间, timer是定时器
  let last = 0
  let timer: any = null
  // 将throttle处理结果当作函数返回
  return function() {
    // 保留调用时的this上下文
    // @ts-ignore
    const context = this
    // 保留调用时传入的参数

    // eslint-disable-next-line prefer-rest-params
    const args = arguments
    // 记录本次触发回调的时间
    const now = +new Date()
    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
      // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
      clearTimeout(timer)
      timer = setTimeout(function() {
        last = now
        fn.apply(context, args)
      }, delay)
    } else {
      // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
      last = now
      fn.apply(context, args)
    }
  }
}

// Check if an element has a class
export const hasClass = (ele: HTMLElement, className: string) => {
  return !!ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

// Add class to element
export const addClass = (ele: HTMLElement, className: string) => {
  if (!hasClass(ele, className)) ele.className += ' ' + className
}

// Remove class from element
export const removeClass = (ele: HTMLElement, className: string) => {
  if (hasClass(ele, className)) {
    const reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// Toggle class for the selected element
export const toggleClass = (ele: HTMLElement, className: string) => {
  if (!ele || !className) {
    return
  }
  let classString = ele.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  ele.className = classString
}

/**
 * 取数组对象一个属性的最大值，返回数字
 * @param {Array} array
 * @param {string} preporty
 * @returns {Array}
 */
export function getMax(array:any, preporty:string) {
  if (!Array.isArray(array)) return 0
  if (!array.length) return 0
  return array.map((item:any) => Number(item[preporty])).reduce((pre:any, cur:any) => {
    return Math.max(pre, cur)
  })
}

/**
 * 取数组对象一个属性的值的和，返回数字
 * @param {Array} array
 * @param {string} preporty
 * @returns {Array}
 */
export function getTotal(array:any, preporty:string = 'value') {
  if (!Array.isArray(array)) return 0
  if (!array.length) return 0
  return array.map((item:any) => Number(item[preporty])).reduce((pre:any, cur:any) => {
    return pre + cur
  })
}
