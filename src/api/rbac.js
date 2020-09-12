import request from '@/utils/request'

export function getApplications() {
  return request({
    url: '/v1/rbac/application/list',
    method: 'get'
  })
}

export function createApplication(data) {
  return request({
    url: '/v1/rbac/application/create',
    method: 'post',
    data
  })
}

export function getRoles(appId) {
  return request({
    url: `/v1/rbac/role/list?app_id=${appId}`,
    method: 'get'
  })
}

export function createRole(data) {
  return request({
    url: '/v1/rbac/role/create',
    method: 'post',
    data
  })
}

export function roleScopesBatchUpdate(data) {
  return request({
    url: '/v1/rbac/role/scope/batch',
    method: 'post',
    data
  })
}

export function getScopes(appId) {
  return request({
    url: `/v1/rbac/scope/list?app_id=${appId}`,
    method: 'get'
  })
}

export function createScope(data) {
  return request({
    url: '/v1/rbac/scope/create',
    method: 'post',
    data
  })
}

export function setDefaultRole(data) {
  return request({
    url: '/v1/rbac/application/role/default',
    method: 'post',
    data
  })
}

export function setDefaultScope(data) {
  return request({
    url: '/v1/rbac/role/scope/default',
    method: 'post',
    data
  })
}

export function setUserRole(data) {
  return request({
    url: '/v1/rbac/user/application/role',
    method: 'post',
    data
  })
}

export function getAppI18nNames(appId) {
  return request({
    url: `/v1/rbac/application/i18n-name?app_id=${appId}`,
    method: 'get'
  })
}

export function setAppI18nNames(data) {
  return request({
    url: '/v1/rbac/application/update-i18n-name',
    method: 'post',
    data
  })
}
