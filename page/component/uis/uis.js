var app = getApp()
Page({
    data: {
        tokenurl:'',
        accessurl:''
    },
    onLoad() {

    },
    handleGetMessage: function (e) {
        // debugger;
        console.log("从WebView返回的数据为：" + JSON.stringify(e.detail.data[0]['tokenUrl']));
        this.data.tokenurl = e.detail.data[0]['tokenUrl']
        var that = this
        wx.showLoading({
            title: '加载中',
          })
        wx.request({
          url: this.data.tokenurl,
          method:'GET',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'chartset': 'utf-8'
          },
          success:function(res){
              console.log(res.data)
              that.data.accessurl = 'https://tac.fudan.edu.cn/resource/userinfo.act?access_token='+res.data.access_token
            //   }) 
              wx.request({
                url: that.data.accessurl,
                method:'GET',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'chartset': 'utf-8'
                },
               success:function(_res){
                   app.globalData.username = _res.data.user_name,
                   app.globalData.uid = _res.data.user_id,
                //    console.log('全局'+app.globalData.username)
                   wx.setStorage({
                    key: 'info',
                    data: _res.data,
                    success: function () {
                      console.log("Storage--success");
                    }
                   })
                   wx.hideLoading()
                }
              })
          }

        })
      }
})