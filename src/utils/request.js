import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'

axios.defaults.withCredentials = true

const instance = axios.create()

const cancelToken = {}

instance.interceptors.request.use(function (config) {
  const source = axios.CancelToken.source()
  config.cancelToken = source.token

  const fullPath = router.currentRoute.fullPath
  if (!cancelToken[fullPath]) {
    cancelToken[fullPath] = []
  }
  if (!config.isAutoCancel) {
    cancelToken[fullPath].push(source)
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

instance.interceptors.response.use(({ data }) => {
  if (data && data.code && data.code === 'NACK') {
    Message.error(data.message)
    return Promise.reject(data)
  }
  if (data && data.code && data.code === 'UNAUTHORIZED') {
    Message.error('没有访问权限或登录已过期，请重新登录')
    return Promise.reject(data)
  }
  return data
}, function (error) {
  if (error.response && error.response.status === 403) {
    Message.error('没有访问权限或登录已过期，请重新登录')
  }
  if (error.response && error.response.status === 500) {
    Message.error('服务器错误')
  } else if (error.code === 'ECONNABORTED' && /^timeout/.test(error.message)) {
    Message.error('请求超时')
  } else if (error.message === 'Network Error') {
    Message.error('网络错误')
  }
  return Promise.reject(error)
})

router.afterEach((to, from) => {
  if (Array.isArray(cancelToken[from.fullPath])) {
    cancelToken[from.fullPath].forEach(item => item.cancel())
    cancelToken[from.fullPath] = []
  }
})

export default instance
