Page({
  data: {
    presentee: {},
    imgList: [],
    imgMaxNumber: 4,
    name: null,
    admin: "user",
    uid: null,
    contact: null
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
  uploadImgs(pInfo) {},
  submit: function () {},
  clear: function () {
    this.setData({
      presentee: {},
      imgList: [],
      imgMaxNumber: 4,
    })
  }
})