const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  accessToken: state => state.user.accessToken,
  refreshToken: state => state.user.refreshToken,
  expired: state => state.user.expired,
  userId: state => state.user.userId,
  role: state => state.user.role,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  mail: state => state.user.mail,
  application: state => state.user.application,
  // introduction: state => state.user.introduction,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
