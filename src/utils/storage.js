function setItem (k, v) {
  localStorage.setItem(k, JSON.stringify(v))
}

function removeItem (k) {
  localStorage.removeItem(k)
}

export function getItem (k) {
  return JSON.parse(localStorage.getItem(k))
}

export const saveLoginInfo = user => {
  setItem('user', user)
}

export const getLoginUser = () => {
  return getItem('user')
}

export const saveAppInfo = app => {
  setItem('app', app)
}

export const getAppInfo = () => {
  return getItem('app')
}

export const logout = () => {
  removeItem('user')
}
