const app = getApp();

Page({
  data: {
    presentee: {}, //保存表单除图片以外的字段
    imgList: [], //图片列表
    imgMaxNumber: 4, //上传图片的最大数量
    name: null, //当前登录用户的姓名
    admin: "user", //当前登录用户的角色
    uid: null, //当前登录用户的学号
    contact: null, //当前登录用户的联系方式
    fileIndex: 0, //图片索引

    picList: [], //返回给后端的url列表

    picsize: '10MB', //照片的文件大小
    picPPI: '72PPI', //照片清晰度限制

    // 用户信息
    username: '',
    uid: '',
    userid: ''
  },
  onLoad() {
    var that = this;
    that.setData({
      userid: app.globalData.userid,
      uid: app.globalData.uid,
      username: app.globalData.username
    })
  },
  //主要是检查有无完善联系方式
  // checkName: function () {
  //   if (this.data.contact == null) {
  //     wx.showModal({
  //       title: '提示',
  //       content: '请先完善个人信息',
  //       showCancel: false,
  //       duration: 2000
  //     })
  //     setTimeout(() => {
  //       wx.switchTab({
  //         url: '../user/user',
  //       })
  //     }, 1500)
  //   }
  // },
  nameInput: function (e) {
    this.data.presentee['rname'] = e.detail.value;
  },
  reasonBlur: function (e) {
    this.data.presentee['reason'] = e.detail.value;
  },
  bindTextAreaBlur: function (e) {
    this.data.presentee['details'] = e.detail.value;
  },
  ChooseImage() {
    //从本地相册选择图片或使用相机拍照
    wx.chooseImage({
      count: this.data.imgMaxNumber,
      sizeType: 'compressed', //压缩图
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
            //tempFilePaths: 图片的本地临时文件路径列表 (本地路径)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
        //console.log(res.tempFilePaths)
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '确定删除这张图片吗？',
      cancelText: '再看看',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  //上传图片
  uploadImgs(pInfo) {
    console.log(this.data.imgList)
    var that = this
    // 注意下面的that 不能换成this，不然要出事...
    // 小程序只能循环上传图片, 但直接for循环会出事情...
    wx.uploadFile({
      filePath: that.data.imgList[that.data.fileIndex],
      name: 'file',
      url: 'http://127.0.0.1:5000/uploadImg', //待定
      success(res) {
        console.log(res.data)
        //pInfo['pic'] = pInfo['pic'] + res.data 
        that.data.picList.push(res.data)
        console.log(that.data.picList)
        that.data.fileIndex = that.data.fileIndex + 1
        if (that.data.fileIndex == that.data.imgList.length) {
          that.data.fileIndex = 0 //传完，归零
          that.uploadInfo(pInfo)
        } else {
          that.uploadImgs(pInfo)
        }
      },
      fail(res) {
        console.log(res)
        //显示消息提示框
        wx.showToast({
          title: '上传图片错误', //提示内容
          icon: 'error' //图标
        })
      }
    })
  },
  //上传信息
  uploadInfo(info) {
    var param = info
    //保存操作者的基本信息
    param['userid'] = this.data.userid
    //保存图片
    param['pic'] = this.data.picList
    //发起请求
    wx.request({
      url: 'http://127.0.0.1:5000/uploadInfo', //待定
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      data: {
        pinfo: JSON.stringify(param)
      },
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: '上传成功，请等待审核结果',
          icon: 'success'
        })
        // wx.reLaunch({
        //   url: '../vote/vote', //刷新提名页
        // })
      },
      fail(res) {
        console.log(res)
        wx.showToast({
          title: '上传失败',
          icon: 'error'
        })
      }
    })
  },
  submit: function () {
    console.log(this.data.presentee)
    var pInfo = this.data.presentee
    //pInfo['pic'] = ''
    var that = this
    if (pInfo['rname'] === '' || pInfo['details'] === '' || pInfo['rname'] === undefined || pInfo['details'] === undefined || pInfo['reason'] === '' || pInfo['reason'] === undefined) {
      wx.showModal({
        cancelColor: '#999', //取消按钮的文字颜色
        title: '提示',
        content: '请填写必填字段'
      })
    } else {
      wx.showModal({
        cancelColor: '#999',
        title: '提示',
        content: '确定提交?',
        success(res) {
          if (res.cancel) {
            console.log('操作已终止')
          } else if (res.confirm) {
            console.log(666)
            // 进行图片的上传
            if (that.data.imgList.length > 0) {
              that.uploadImgs(pInfo)
            } else {
              that.uploadInfo(pInfo)
            }
          }
        }
      })
    }
  },
  clear: function () {
    this.setData({
      presentee: {},
      imgList: [],
      imgMaxNumber: 4,
      picList: []
    })
  }
})