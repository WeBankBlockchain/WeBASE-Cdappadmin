import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const nameKey = 'userName'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserName() {
  return Cookies.get(nameKey)
}

export function setUserName(name) {
  return Cookies.set(nameKey, name)
}