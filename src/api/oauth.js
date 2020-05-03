import request from '@/utils/request'

export function getClients() {
  return request({
    url: '/v1/oauth/client',
    method: 'get'
  })
}

export function newClient(data) {
  return request({
    url: '/v1/oauth/client',
    method: 'post',
    data
  })
}

export function updateClientStatus(data) {
  return request({
    url: '/v1/oauth/client/status',
    method: 'PUT',
    data
  })
}
