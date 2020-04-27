import Cookies from 'js-cookie'

const RefreshTokenKey = 'Admin-RefreshToken'
const AccessTokenKey = 'Admin-AccessToken'
const AccessTokenExpiredKey = 'Admin-AccessTokenExpired'

export function getAccessTokenExpired() {
  return Cookies.get(AccessTokenExpiredKey)
}

export function setAccessTokenExpired(expired) {
  return Cookies.set(AccessTokenExpiredKey, expired)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshTokenKey, token)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}

export function getAccessToken() {
  return Cookies.get(AccessTokenKey)
}

export function setAccessToken(token) {
  return Cookies.set(AccessTokenKey, token)
}

export function removeAccessToken() {
  return Cookies.remove(AccessTokenKey)
}
