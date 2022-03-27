Page({
  data: {
    presentee: {}, //保存表单除图片以外的字段
    imgList: [], //图片列表
    imgMaxNumber: 4, //上传图片的最大数量
    name: null, //当前登录用户的姓名
    admin: "user", //当前登录用户的角色
    uid: null, //当前登录用户的学号
    contact: null //当前登录用户的联系方式
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
        self.checkName()
      }
    })
  },
  //主要是检查有无完善联系方式
  checkName: function () {
    if (this.data.contact == null) {
      wx.showModal({
        title: '提示',
        content: '请先完善个人信息',
        showCancel: false,
        duration: 2000
      })
      setTimeout(() => {
        wx.switchTab({
          url: '../user/user',
        })
      }, 1500)
    }
  },
  nameInput: function (e) {
    this.data.presentee['username'] = e.detail.value;
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
  uploadImgs(pInfo) {
    console.log(this.data.imgList)
    var that = this
    wxxwx.uploadFile({
      filePath: this.data.imgList[0],
      name: 'file',
      url: 'url', //待定
      success(res) {
        console.log(res.data)
        pInfo['pic'] = res.data
        that.uploadInfo(pInfo)
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
  uploadInfo(info) {
    var param = info
    //保存操作者的基本信息
    param['uid'] = this.data.uid
    param['name'] = this.data.name
    param['contact'] = this.data.contact
    //发起请求
    wx.request({
      url: 'url', //待定
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
        wx.reLaunch({
          url: '../vote/vote', //刷新提名页
        })
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
    var that = this
    if (pInfo['username'] === '' || pInfo['details'] === '' || pInfo['username'] === undefined || pInfo['details'] === undefined) {
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
          //to be continued...
        }
      })
    }
  },
  clear: function () {
    this.setData({
      presentee: {},
      imgList: [],
      imgMaxNumber: 4,
    })
  }
})