// export * from './waves/index'
// export * from './scroll/index'

const modulesFiles = require.context('./', true, /.ts$/)
export const directives = modulesFiles
  .keys()
  .reduce((modules, modulePath) => {
    const value = modulesFiles(modulePath)
    for (const k in value) {
      if (k !== '__esModule' && k !== 'directives') {
        modules[k] = value[k]
      }
    }
    return modules
  }, {} as { [key: string]: any})

export default {
  install(Vue:any) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  }
}
