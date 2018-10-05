// 获取Token
export const getToken = () => {
  if (window.localStorage && window.localStorage.Bearer) {
    return window.localStorage.Bearer
  } else {
    return null
  }
}

// 设置Token
export const setToken = (token) => {
  window.localStorage.Bearer = token
}

// 删除Token
export const delToken = () => {
  if (window.localStorage && window.localStorage.Bearer) {
    window.localStorage.removeItem('Bearer')
  }
}
