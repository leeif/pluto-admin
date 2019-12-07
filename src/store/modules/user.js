import { login, getInfo, refreshToken } from '@/api/user'
import { getAccessToken, getRefreshToken, setAccessToken,
  setRefreshToken, removeAccessToken, removeRefreshToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { parseJWT } from '@/utils/jwt'

const state = {
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  expired: 0,
  userId: -1,
  name: '',
  avatar: '',
  roles: [],
  application: 'pluto'
}

const mutations = {
  SET_ACCESS_TOKEN: (state, token) => {
    state.accessToken = token
  },
  SET_REFRESH_TOKEN: (state, token) => {
    state.refreshToken = token
  },
  SET_ACCESS_TOKEN_EXPIRED: (state, expired) => {
    state.expired = expired
  },
  SET_USER_ID: (state, id) => {
    state.userId = id
  },
  SET_MAIL: (state, mail) => {
    state.mail = mail
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit, state }, userInfo) {
    const { mail, password } = userInfo
    return new Promise((resolve, reject) => {
      login({
        mail: mail.trim(),
        password: password,
        app_id: state.application,
        device_id: 'xxxx'
      }).then(response => {
        const { body } = response
        console.log(response)
        commit('SET_ACCESS_TOKEN', body.jwt)
        setAccessToken(body.jwt)
        commit('SET_REFRESH_TOKEN', body.refresh_token)
        setRefreshToken(body.refresh_token)
        var jwt = parseJWT(body.jwt)
        commit('SET_ACCESS_TOKEN_EXPIRED', jwt.expire_time)
        commit('SET_USER_ID', jwt.userID)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { body } = response

        if (!body) {
          reject('Verification failed, please Login again.')
        }

        const { mail, roles, name, avatar } = body

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_MAIL', mail)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(body)
      }).catch(error => {
        reject(error)
      })
    })
  },

  refreshToken({ commit, state }) {
    console.log('refreshToken')
    return new Promise((resolve, reject) => {
      var jwt = parseJWT(state.accessToken)
      var data = {
        refresh_token: state.refreshToken,
        app_id: jwt.appId,
        device_id: jwt.deviceId,
        user_id: jwt.userId
      }
      console.log(data)
      refreshToken(data).then(response => {
        response = response.data
        commit('SET_ACCESS_TOKEN', response.body.jwt)
        setAccessToken(response.body.jwt)
        var jwt = parseJWT(response.body.jwt)
        commit('SET_ACCESS_TOKEN_EXPIRED', jwt.expire_time)
        commit('SET_USER_ID', jwt.userId)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_ACCESS_TOKEN', '')
      commit('SET_USER_ID', -1)
      commit('SET_ACCESS_TOKEN_EXPIRED', 0)
      commit('SET_REFRESH_TOKEN', '')
      commit('SET_ROLES', [])
      removeAccessToken()
      removeRefreshToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_ACCESS_TOKEN', '')
      commit('SET_REFRESH_TOKEN', '')
      removeAccessToken()
      removeRefreshToken()
      resolve()
    })
  }

  // // dynamically modify permissions
  // changeRoles({ commit, dispatch }, role) {
  //   return new Promise(async resolve => {
  //     const token = role + '-token'

  //     commit('SET_TOKEN', token)
  //     setToken(token)

  //     const { roles } = await dispatch('getInfo')

  //     resetRouter()

  //     // generate accessible routes map based on roles
  //     const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

  //     // dynamically add accessible routes
  //     router.addRoutes(accessRoutes)

  //     // reset visited views and cached views
  //     dispatch('tagsView/delAllViews', null, { root: true })

  //     resolve()
  //   })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
