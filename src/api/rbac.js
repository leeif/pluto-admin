import request from '@/utils/request'

export function getApplications() {
  return request({
    url: '/api/rbac/application/list',
    method: 'get'
  })
}

export function createApplication(data) {
  return request({
    url: '/api/rbac/application/create',
    method: 'post',
    data
  })
}

export function getRoles(appId) {
  return request({
    url: `/api/rbac/role/list?app_id=${appId}`,
    method: 'get'
  })
}

export function createRole(data) {
  return request({
    url: '/api/rbac/application/create',
    method: 'post',
    data
  })
}

export function getScopes(appId) {
  return request({
    url: `/api/rbac/scope/list?app_id=${appId}`,
    method: 'get'
  })
}

export function createScope(data) {
  return request({
    url: '/api/rbac/application/create',
    method: 'post',
    data
  })
}
