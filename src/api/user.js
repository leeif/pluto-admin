import request from '@/utils/request'
import axios from 'axios'

export function login(data) {
  return request({
    url: '/v1/user/login/account',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/v1/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/v1/user/logout',
    method: 'post'
  })
}

export function usersCount() {
  return request({
    url: '/v1/user/summary',
    method: 'get'
  })
}

export function findUser(name) {
  return request({
    url: `/v1/user/search?name=${name}`,
    method: 'get'
  })
}

export function refreshToken(data) {
  return axios.post(`${process.env.VUE_APP_BASE_API}/v1/token/refresh`, data)
}

export function resetPassword(data) {
  return request({
    url: '/v1/user/password/reset/mail',
    method: 'post',
    data
  })
}
