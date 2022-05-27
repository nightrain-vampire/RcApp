const app = getApp()
Page({
    data: {
        name: '',
        uid: '',
        // contact: '19821237137'
    },
    onLoad() {
    },
    //分享给好友
    onShareAppMessage: function () {
        // 获取当前页面路径
        // const pages = getCurrentPages(); 
        // const currentPage = pages[pages.length - 1].route;
        // 构造分享页面显示内容
        //在path中可通过在页面路径添加?可传递参数
        return {
          title: '复旦团艺',
          path: '',
          imageUrl: ''
        }
      },
      //分享到朋友圈
      onShareTimeline: function () {
        // 构造分享页面显示内容
        //query：自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分
        return {
          title: '复旦团艺',
          imageUrl: '',
        //   path: 'page/component/index/index.html',
        }
      },
    //uis
    uisTorec: function () {
        var that = this;
        wx.getStorage({
            //需要在登录功能中调用wx.setStorage并把 key 设置为info
            key: 'info',
            success: function (res) {
                console.log('index的数据：' + JSON.stringify(res.data))
                    // that.name= JSON.stringify(res.data['user_name']),
                    that.uid= JSON.stringify(res.data['user_id'])
                    // console.log('缓存'+res.data['user_name'])
                    // app.globalData.username = res.data['user_name']
                    app.globalData.uid = res.data['user_id']
                if (that.uid) {
                    wx.request({
                      url: 'https://tuanyi.fudan.edu.cn/register',
                      method:'POST',
                      header: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'chartset': 'utf-8'
                      },
                      data:{
                        //   username: that.name,
                          uid: that.uid
                      },
                      success : function(res){
                        // wx.showToast({
                        //     title: '登录成功！',
                        //     icon: 'success',
                        //     duration: 1000 //持续的时间
                        //   })
                      },fail:function(res){
                        // wx.showToast({
                        //     title: '登录失败！',
                        //     icon: 'fail',
                        //     duration: 1000 //持续的时间
                        //   })
                      }
                    })

                    wx.navigateTo({
                      url: '/page/component/recommend/recommend',
                    })
                }
            },
            fail: function () {
                wx.navigateTo({
                    url: '/page/component/uis/uis',
                  })
              },
        })
      },
      uisTomyr: function () {
        var that = this;
        wx.getStorage({
            //需要在登录功能中调用wx.setStorage并把 key 设置为info
            key: 'info',
            success: function (res) {
                // console.log('index的数据：' + JSON.stringify(res.data))
                    // that.name= JSON.stringify(res.data['user_name']),
                    that.uid= JSON.stringify(res.data['user_id'])
                    // console.log('缓存'+res.data['user_name'])
                    // app.globalData.username = res.data['user_name']
                    app.globalData.uid = res.data['user_id']
                if (that.uid) {
                    wx.request({
                        url: 'https://tuanyi.fudan.edu.cn/register',
                        method:'POST',
                        header: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'chartset': 'utf-8'
                        },
                        data:{
                            // username: that.name,
                            uid: that.uid
                        },
                        success : function(res){
                          // wx.showToast({
                          //     title: '登录成功！',
                          //     icon: 'success',
                          //     duration: 1000 //持续的时间
                          //   })
                        },fail:function(res){
                          // wx.showToast({
                          //     title: '登录失败！',
                          //     icon: 'fail',
                          //     duration: 1000 //持续的时间
                          //   })
                        }
                      })
                      wx.navigateTo({
                        url: '/page/component/myrecommend/myrecommend',
                      })
                  }
            },
            fail: function () {
                wx.navigateTo({
                    url: '/page/component/uis/uis',
                  })
              },
        })
      },
      uisTovot: function () {
        var that = this;
        wx.getStorage({
            //需要在登录功能中调用wx.setStorage并把 key 设置为info
            key: 'info',
            success: function (res) {
                // console.log('index的数据：' + JSON.stringify(res.data))
                    // that.name= JSON.stringify(res.data['user_name']),
                    that.uid= JSON.stringify(res.data['user_id'])
                    // app.globalData.username = res.data['user_name']
                    app.globalData.uid = res.data['user_id']
                if (that.uid) {
                    wx.request({
                        url: 'https://tuanyi.fudan.edu.cn/register',
                        method:'POST',
                        header: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'chartset': 'utf-8'
                        },
                        data:{
                            // username: that.name,
                            uid: that.uid
                        },
                        success : function(res){
                          // wx.showToast({
                          //     title: '登录成功！',
                          //     icon: 'success',
                          //     duration: 1000 //持续的时间
                          //   })
                        },fail:function(res){
                          // wx.showToast({
                          //     title: '登录失败！',
                          //     icon: 'fail',
                          //     duration: 1000 //持续的时间
                          //   })
                        }
                      })
                      wx.navigateTo({
                        url: '/page/component/vote/vote',
                      })
                  }
            },
            fail: function () {
                wx.navigateTo({
                    url: '/page/component/uis/uis',
                  })
              },
        })
      },
})