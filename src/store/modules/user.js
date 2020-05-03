import { login, getInfo, refreshToken } from '@/api/user'
import { getAccessTokenExpired, setAccessTokenExpired, getAccessToken, getRefreshToken, setAccessToken,
  setRefreshToken, removeAccessToken, removeRefreshToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { parseJWT } from '@/utils/jwt'

const state = {
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  expired: getAccessTokenExpired(),
  userId: -1,
  name: '',
  avatar: '',
  role: '',
  application: process.env.VUE_APP_PLUTO_ADMIN_APPLICATION
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
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  // user login
  login({ commit, state }, userInfo) {
    const { account, password } = userInfo
    return new Promise((resolve, reject) => {
      login({
        account: account.trim(),
        password: password,
        app_id: state.application,
        device_id: 'xxxx'
      }).then(response => {
        const { body } = response
        console.log(response)
        commit('SET_ACCESS_TOKEN', body.access_token)
        setAccessToken(body.access_token)
        commit('SET_REFRESH_TOKEN', body.refresh_token)
        setRefreshToken(body.refresh_token)
        var jwt = parseJWT(body.access_token)
        commit('SET_ACCESS_TOKEN_EXPIRED', jwt.exp)
        setAccessTokenExpired(jwt.exp)
        commit('SET_USER_ID', jwt.sub)
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

        const { mail, role, name, avatar } = body

        if (role !== process.env.VUE_APP_PLUTO_ADMIN_ROLE && role !== process.env.VUE_APP_PLUTO_USER_ROLE) {
          reject(`Role: ${role} is not supported.`)
        }

        commit('SET_ROLE', role)
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
      var data = {
        refresh_token: state.refreshToken,
        app_id: state.application
      }
      console.log(data)
      refreshToken(data).then(response => {
        response = response.data
        commit('SET_ACCESS_TOKEN', response.body.access_token)
        setAccessToken(response.body.access_token)
        commit('SET_REFRESH_TOKEN', response.body.refresh_token)
        setRefreshToken(response.body.refresh_token)
        var jwt = parseJWT(response.body.access_token)
        commit('SET_ACCESS_TOKEN_EXPIRED', jwt.exp)
        setAccessTokenExpired(jwt.exp)
        commit('SET_USER_ID', jwt.sub)
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
      commit('SET_ROLE', '')
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
