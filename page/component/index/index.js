Page({
    data: {
        name: 'Q',
        uid: '19307130092',
        contact: '19821237137'
    },
    onLoad() {
        var self = this;
        wx.getStorage({
            //需要在登录功能中调用wx.setStorage并把 key 设置为info
            key: 'info',
            success: function (res) {
                self.setData({
                    name: res.data['username'],
                    admin: res.data['admin'] === 1 ? '管理员' : '普通用户',
                    uid: res.data['uid']
                })
            }
        })
    }
})