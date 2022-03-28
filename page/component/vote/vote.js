Page({
  data: {
      cardData: {},
      currentIndex: 0,
      currentCard: {}
  },
  onLoad: function(options) {
    this.getVotes();
  },
  onPullDownRefresh: function() {
    wx.reLaunch({
      url: '../vote/vote',
    })
  },
  getVotes() {
    var that = this
    //向后端接口发请求
    wx.request({
      url: 'http://127.0.0.1:5000/getvotes',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      success: function(res) {
        console.log(res.data)
        //数据设置
        if(Object.keys(res.data).length > 0){
          that.setData({
            cardData: res.data,
            currentCard: res.data[0]
          })
        }else {
          wx.showToast({
            title: '目前没有人被提名',
            icon: 'none'
          })
        }
      },
      fail: res => {
        console.log('加载失败', res)
      }
    })
  }
})