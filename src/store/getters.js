const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  certificate_Id: state => state.user.certificate_Id,
  step: state => state.user.step,
  loading: state => state.user.loading
}
export default getters
