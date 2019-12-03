import request from '@/utils/request'
import axios from 'axios'

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

export function findUser(keyword) {
  return request({
    url: `/api/find/user?keyword=${keyword}`,
    method: 'get'
  })
}

export function refreshToken(data) {
  return axios.post(`${process.env.VUE_APP_BASE_API}/api/auth/refresh`, data)
}

export function resetPassword(mail) {
  return request({
    url: '/api/user/password/reset/mail',
    method: 'post'
  })
}
