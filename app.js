App({
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    uid: '',
    hasLogin: false,
    username: '',
    gender: '',
    admin: 0,
    nickname: '',
    passwd: ''
  }
})