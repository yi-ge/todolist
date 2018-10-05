// 配置API接口地址
export const DevBaseUrl = '//todolist.local/api'
export const ProdBaseUrl = '//xxx/api'
export const BASE_URL = process.env.NODE_ENV !== 'production' ? DevBaseUrl : ProdBaseUrl

export let wxConfig = {
  appid: ''
}
