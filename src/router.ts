import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout/index.vue'

Vue.use(Router)

/*
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    hidden: true                 if true, this route will not show in the sidebar (default is false)
  }
*/

export default new Router({
  // mode: 'history',  // Enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
      meta: { hidden: true }
    },
    {
      path: '/404',
      component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
      meta: { hidden: true }
    },
    {
      path: '/test',
      component: () => import(/* webpackChunkName: "404" */ '@/views/test.vue'),
      meta: { hidden: true }
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
          meta: {
            title: '首页',
            icon: 'dashboard'
          }
        }
      ]
    },
    {
      path: '/echarts',
      component: Layout,
      redirect: '/echarts/pie',
      meta: {
        title: '图表',
        icon: 'example'
      },
      children: [
        {
          path: 'pie',
          component: () => import(/* webpackChunkName: "tree" */ '@/views/charts/PieChart.vue'),
          meta: {
            title: '饼图',
            icon: 'example'
          }
        },
        {
          path: 'bar',
          component: () => import(/* webpackChunkName: "tree" */ '@/views/charts/BarChart.vue'),
          meta: {
            title: '柱状图',
            icon: 'example'
          }
        },
        {
          path: 'line',
          component: () => import(/* webpackChunkName: "tree" */ '@/views/charts/LineChart.vue'),
          meta: {
            title: '折线图',
            icon: 'example'
          }
        }
      ]
    },
    {
      path: '/demo-components',
      component: Layout,
      redirect: '/demo-components/index',
      meta: {
        title: '基础组件',
        icon: 'example'
      },
      children: [
        {
          path: 'bar',
          component: () => import(/* webpackChunkName: "tree" */ '@/views/demo-components/Button.vue'),
          meta: {
            title: 'button',
            icon: 'example'
          }
        },
        {
          path: 'input',
          component: () => import(/* webpackChunkName: "tree" */ '@/views/demo-components/Input.vue'),
          meta: {
            title: '输入框',
            icon: 'example'
          }
        },
        {
          path: 'progress',
          component: () => import(/* webpackChunkName: "tree" */ '@/views/demo-components/progress/index.vue'),
          meta: {
            title: '进度条',
            icon: 'example'
          }
        },
        {
          path: 'msg-scroll',
          component: () => import(/* webpackChunkName: "tree" */ '@/views/demo-components/MsgScroll.vue'),
          meta: {
            title: '事件滚动',
            icon: 'example'
          }
        },
        {
          path: 'number',
          component: () => import(/* webpackChunkName: "tree" */ '@/views/demo-components/number/index.vue'),
          meta: {
            title: '数字动画',
            icon: 'example'
          }
        },
        {
          path: 'loading',
          component: () => import(/* webpackChunkName: "tree" */ '@/views/demo-components/Loading.vue'),
          meta: {
            title: '加载动画',
            icon: 'example'
          }
        },
        {
          path: 'text',
          component: () => import(/* webpackChunkName: "tree" */ '@/views/demo-components/Text.vue'),
          meta: {
            title: '文字动画',
            icon: 'example'
          }
        }
      ]
    },
    {
      path: '/demo',
      component: Layout,
      redirect: '/demo/cesium',
      meta: {
        title: 'demo',
        icon: 'example'
      },
      children: [
        {
          path: 'cesium',
          redirect: '/demo/cesium/test',
          component: () => import(/* webpackChunkName: "tree" */ '@/views/demo/cesium/index.vue'),
          meta: {
            title: 'cesium',
            icon: 'example'
          },
          children: [
            {
              path: 'init',
              component: () => import(/* webpackChunkName: "tree" */ '@/views/demo/cesium/init.vue'),
              meta: {
                title: 'init',
                icon: 'example'
              }
            },
            {
              path: 'test1',
              component: () => import(/* webpackChunkName: "tree" */ '@/views/demo/cesium/test.vue'),
              meta: {
                title: 'test1',
                icon: 'example'
              }
            },
            {
              path: 'event',
              component: () => import(/* webpackChunkName: "tree" */ '@/views/demo/cesium/event.vue'),
              meta: {
                title: '预警demo',
                icon: 'example'
              }
            }
          ]
        },
        {
          path: 'mapview',
          component: () => import(/* webpackChunkName: "tree" */ '@/views/demo/map-view/index.vue'),
          meta: {
            title: '高德地图',
            icon: 'example'
          },
          children: [
            {
              path: 'flagFlow',
              component: () => import(/* webpackChunkName: "tree" */ '@/views/demo/map-view/MinHang.vue'),
              meta: {
                title: '闵行',
                icon: 'example'
              }
            },
            {
              path: 'test1',
              component: () => import(/* webpackChunkName: "tree" */ '@/views/demo/map-view/Gltf.vue'),
              meta: {
                title: 'gltf模型',
                icon: 'example'
              }
            }
          ]
        },
        {
          path: 'magic',
          component: () => import(/* webpackChunkName: "tree" */ '@/views/demo/magic/index.vue'),
          meta: {
            title: '魔方',
            icon: 'example'
          }
        },
        {
          path: 'three',
          component: () => import(/* webpackChunkName: "tree" */ '@/views/demo/three/index.vue'),
          meta: {
            title: 'three',
            icon: 'example'
          },
          children: [
            {
              path: 'flagFlow',
              component: () => import(/* webpackChunkName: "tree" */ '@/views/demo/three/FlagFlow.vue'),
              meta: {
                title: '红旗飘动1',
                icon: 'example'
              }
            },
            {
              path: 'test1',
              component: () => import(/* webpackChunkName: "tree" */ '@/views/demo/three/Webgl.vue'),
              meta: {
                title: '红旗飘动2',
                icon: 'example'
              }
            },
            {
              path: 'shape',
              component: () => import(/* webpackChunkName: "tree" */ '@/views/demo/three/Shape.vue'),
              meta: {
                title: '形状',
                icon: 'example'
              }
            },
            {
              path: 'earth',
              component: () => import(/* webpackChunkName: "tree" */ '@/views/demo/three/Earth.vue'),
              meta: {
                title: '地球',
                icon: 'example'
              }
            },
            {
              path: 'magic',
              component: () => import(/* webpackChunkName: "tree" */ '@/views/demo/three/Magic.vue'),
              meta: {
                title: '魔方',
                icon: 'example'
              }
            },
            {
              path: 'light',
              component: () => import(/* webpackChunkName: "tree" */ '@/views/demo/three/Light.vue'),
              meta: {
                title: '闪电',
                icon: 'example'
              }
            },
            {
              path: 'lizi',
              component: () => import(/* webpackChunkName: "tree" */ '@/views/demo/three/Lizi.vue'),
              meta: {
                title: '粒子',
                icon: 'example'
              }
            }
          ]
        }
      ]
    },
    {
      path: '/form',
      component: Layout,
      children: [
        {
          path: 'index',
          component: () => import(/* webpackChunkName: "form" */ '@/views/form/index.vue'),
          meta: {
            title: '表单',
            icon: 'form'
          }
        }
      ]
    },
    {
      path: '/table',
      component: Layout,
      children: [
        {
          path: 'index',
          component: () => import(/* webpackChunkName: "form" */ '@/views/table/index.vue'),
          meta: {
            title: '表格',
            icon: 'form'
          }
        }
      ]
    },
    {
      path: '/xiaoce',
      component: Layout,
      meta: {
        title: '小册学习',
        icon: 'form'
      },
      children: [
        {
          path: 'point',
          component: () => import(/* webpackChunkName: "form" */ '@/views/xiaoce/Point.vue'),
          meta: {
            title: '点',
            icon: 'form'
          }
        },
        {
          path: 'triangle',
          component: () => import(/* webpackChunkName: "form" */ '@/views/xiaoce/Triangle.vue'),
          meta: {
            title: '三角形',
            icon: 'form'
          }
        },
        {
          path: 'line',
          component: () => import(/* webpackChunkName: "form" */ '@/views/xiaoce/Line.vue'),
          meta: {
            title: '线段',
            icon: 'form'
          }
        },
        {
          path: 'index',
          component: () => import(/* webpackChunkName: "form" */ '@/views/xiaoce/index.vue'),
          meta: {
            title: '小册学习',
            icon: 'form'
          }
        }
      ]
    },
    {
      path: '*',
      redirect: '/404',
      meta: { hidden: true }
    }
  ]
})
