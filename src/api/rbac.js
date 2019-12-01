import request from '@/utils/request'

export function getApplications() {
  return request({
    url: '/api/rbac/application/list',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/api/rbac/role/list',
    method: 'get'
  })
}

export function getScopes() {
  return request({
    url: '/api/rbac/scope/list',
    method: 'get'
  })
}

