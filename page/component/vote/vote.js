const app = getApp();

Page({
  data: {
    cardData: [],
    currentIndex: [],
    LeftShow: [], //控制左箭头的显示与否
    RightShow: [], //控制右箭头的显示与否
    flag: [], //按钮是否能调用
    Plength: [], //每个候选人有多少图片
    // 用于详情界面的展示
    maskflag: false,
    loading: false,
    // 属性展示
    name: '',
    intro: '',
    reason: '',
    detailData: [],
    // 动态控制页面是否能滑动
    visible: true,
    // 搜索内容
    searchkey: '',
    // 用户信息
    username: '',
    uid: '',
    leftvotes: '',
    userid: ''
  },
  onLoad: function (options) {
    this.getLeft();
    this.getVotes();
  },
  getLeft: function () {
    this.setData({
    //   username: app.globalData.username,
      uid: app.globalData.uid,
    //   userid: app.globalData.userid
    })
    wx.request({
      url: 'https://tuanyi.fudan.edu.cn/getleft',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      data: {
        key: app.globalData.uid
      },
      success: (res) => {
        // console.log(res.data)
        this.setData({
          leftvotes: res.data.leftvotes
        })
        if (this.data.leftvotes == 0) {
          wx.showToast({
            title: '今日投票次数用完',
            icon: 'none'
          })
        }
      },
      fail: function () {
        console.log('出现小bug...')
      }
    })
    // console.log(that.data.leftvotes)
  },
  openMask: function (e) {
    var index = e.target.id
    var obj = this.data.cardData[index]
    this.setData({
      maskflag: true,
      visible: false,
      name: obj.name,
      intro: obj.intro,
      reason: obj.reason,
      detailData: obj.img
    })
  },
  closeMask: function () {
    this.setData({
      maskflag: false,
      visible: true
    })
  },
  onPullDownRefresh: function () {
    wx.reLaunch({
      url: '../vote/vote',
    })
  },
  getVotes() {
    //向后端接口发请求
    this.setData({
      loading: true
    });
    wx.request({
      url: 'https://tuanyi.fudan.edu.cn/getvotes',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      success: (res) => {
        var psize = Object.keys(res.data).length
        var tmparray = []
        var tmplength = []
        //数据设置
        if (Object.keys(res.data).length > 0) {
          tmparray = new Array(psize)
          tmplength = new Array(psize)
          var i = 0
          for (var key in res.data) {
            tmplength[i] = res.data[key]['img'].length
            tmparray[i] = (tmplength[i] > 1)
            i = i + 1
          }
          this.setData({
            loading: false,
            cardData: res.data,
            LeftShow: Array(psize).fill(false),
            RightShow: tmparray,
            currentIndex: Array(psize).fill(0),
            flag: Array(psize).fill(true),
            Plength: tmplength,
          })
        //   console.log(that.data.Plength)
        //   console.log(that.data.RightShow)
        } else {
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
  },
  // 阻止用户手动滑动
  stopTouchMove: function () {
    return false;
  },
  //动画全部完成
  changeFinish: function (e) {
    var index = e.target.id //获取是哪个card滑完了
    this.setData({
      ['flag[' + index + ']']: true
    })
    console.log(this.data.flag[index])
  },
  //左滑控制
  toLeft: function (e) {
    var index = e.target.id //获取是哪个card调用了
    // 动画还未完成，不执行
    if (!this.data.flag[index]) {
      return
    } else {
      // 修改按钮为不可用
      this.setData({
        ['flag[' + index + ']']: false
      })
      var id = this.data.currentIndex[index] //获取当前卡片的索引
      // 是否解放右按钮
      if ((!this.data.RightShow[index]) && id < this.data.Plength[index]) {
        this.setData({
          ['RightShow[' + index + ']']: true
        })
      }
      // 是否隐藏左按钮
      if ((this.data.LeftShow[index]) && id == 1) {
        this.setData({
          ['LeftShow[' + index + ']']: false
        })
      }
      // 下一页
      this.setData({
        ['currentIndex[' + index + ']']: id - 1
      })
    }
  },
  //右滑控制
  toRight: function (e) {
    var index = e.target.id //获取是哪个card调用了
    // 动画还未完成，不执行
    if (!this.data.flag[index]) {
      return
    } else {
      // 修改按钮为不可用
      this.setData({
        ['flag[' + index + ']']: false
      })
      console.log(this.data.flag[index])
      var id = this.data.currentIndex[index] //获取当前卡片的索引
      // 是否解放左按钮
      if (id == 0) {
        this.setData({
          ['LeftShow[' + index + ']']: true
        })
        console.log(this.data.LeftShow[index])
      }
      // 是否隐藏右按钮
      if (id == this.data.Plength[index] - 2) {
        this.setData({
          ['RightShow[' + index + ']']: false
        })
        console.log(this.data.RightShow[index])
      }
      // 下一页
      this.setData({
        ['currentIndex[' + index + ']']: id + 1
      })
      console.log(this.data.currentIndex[index])
    }
  },
  // 投票
  vote: function (e) {
    var index = e.target.id //获取是哪个card调用了
    var obj = this.data.cardData[index] //获取对象
    // var cur = obj.votes //获取当前投票数
    var curleft = this.data.leftvotes //获取当前剩余票数
    if (curleft > 0) {
      wx.request({
        url: 'https://tuanyi.fudan.edu.cn/vote',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'chartset': 'utf-8'
        },
        data: {
          card: obj.id,
          votes: this.data.uid
        },
        success: (res) => {
            // console.log("daad")
          this.setData({
            leftvotes: curleft - 1
          })
          this.getVotes()
        },
        fail: res => {
        //   console.log('投票失败')
        }
      })
    } else {
      wx.showToast({
        title: '今日投票次数用完',
        icon: 'none'
      })
    }
  },
  // 搜索
  searchInput: function (e) {
    this.data.searchkey = e.detail.value
  },
  search: function (e) {
    if (this.data.searchkey == '' || this.data.searchkey === undefined) {
      wx.showToast({
        title: '请输入关键词',
        icon: 'none'
      })
    } else {
      wx.request({
        url: 'https://tuanyi.fudan.edu.cn/searchkey',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'chartset': 'utf-8'
        },
        data: {
          key: this.data.searchkey
        },
        success: (res) => {
          var psize = Object.keys(res.data).length
          var tmparray = []
          var tmplength = []
          //数据设置
          if (Object.keys(res.data).length > 0) {
            tmparray = new Array(psize)
            tmplength = new Array(psize)
            var i = 0
            for (var key in res.data) {
              tmplength[i] = res.data[key]['img'].length
              tmparray[i] = (tmplength[i] > 1)
              i = i + 1
            }
            this.setData({
              cardData: res.data,
              LeftShow: Array(psize).fill(false),
              RightShow: tmparray,
              currentIndex: Array(psize).fill(0),
              flag: Array(psize).fill(true),
              Plength: tmplength,
            })
            // console.log(that.data.Plength)
            // console.log(that.data.RightShow)
          } else {
            wx.showToast({
              title: '无搜索结果',
              icon: 'none'
            })
          }
        },
        fail: (res) => {
          console.log('搜索失败', res)
        }
      })
    }
    // console.log(that.data.searchkey)
    that.setData({
      searchkey: ''
    })
  }
})