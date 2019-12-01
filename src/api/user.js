import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/user/info/me',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post'
  })
}

export function usersCount() {
  return request({
    url: '/api/user/count',
    method: 'get'
  })
}

export function findUser(name) {
  return request({
    url: `/api/find/user?keyword=${name}`,
    method: 'get'
  })
}

export function refreshToken(data) {
  return request({
    url: '/api/auth/refresh',
    method: 'post',
    data
  })
}
