const app = getApp();

Page({
  data: {
    presentee: {}, //保存表单除图片以外的字段
    imgList: [], //图片列表
    compImgList: [],
    imgMaxNumber: 4, //上传图片的最大数量
    name: null, //当前登录用户的姓名
    admin: "user", //当前登录用户的角色
    uid: null, //当前登录用户的学号
    contact: null, //当前登录用户的联系方式
    fileIndex: 0, //图片索引

    loading: false,
    picList: [], //返回给后端的url列表
    temppic: [],//临时本地位置

    picsize: '5MB', //照片的文件大小

    // 用户信息
    username: '',
    uid: '',
    userid: '',

    // 要修改的提名者的id
    targetid: ''
  },
  onLoad(option) {
    // console.log(option.id)
    this.setData({
      userid: app.globalData.userid,
      uid: app.globalData.uid,
    //   username: app.globalData.username,
      targetid: option.id
    })
    this.getCurrent(option.id)
  },
  getCurrent(Id) {
    var that = this;
    var id = Id
    wx.request({
      url: 'https://tuanyi.fudan.edu.cn/getcurrent',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      data: {
        id: id
      },
      success: (res) => {
        console.log(res)
        this.setData({
          presentee: {
            rname: res.data.name,
            reason: res.data.reason,
            details: res.data.intro,
          },
        //   for (var index = 0; index < array.length; index++) {
        //       const element = array[index]
              
        //   }
          imgList: res.data.img,
          compImgList: res.data.img
        })
        for (let j = 0; j < res.data.img.length; j++) {
            // console.log('测试'+res.data.img[j])
            that.setData({
                temppic:[]
            })
            wx.downloadFile({
              url: res.data.img[j],
              success:function(_res){
                  console.log(_res)
                //   that.setData({
                      that.data.temppic = that.data.temppic.concat(_res.tempFilePath)
                //   })
                //   console.log(that.data.temppic)
                  that.data.imgList = that.data.temppic
                  that.data.compImgList = that.data.temppic
                //   console.log(that.data.imgList)
              }
            })
            
        }
        // console.log(this.data.presentee)
        // console.log(this.data.imgList)
      },
      fail: (e) => {
        console.log('出现小bug')
      }
    })
  }, 
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
    wx.chooseImage({
      count: this.data.imgMaxNumber,
      sizeType: 'compressed', //压缩图
      sourceType: ['album'], //从相册选择
      success: (res) => {
        for (let file of res.tempFiles) {
        //   console.log(file.size)
          if(file.size >= 5000000) {
            wx.showToast({
              title:'上传图片不能大于5M!',  //标题
              icon:'none'       //图标 none不使用图标，详情看官方文档
            })
            return
          }
        }
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        //   console.log('添加'+this.data.imgList)
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      },
      complete: e => {
        //   console.log('添加压缩前'+this.data.imgList)
          for (let p = 0; p < this.data.imgList.length; p++) {
        //   let path of this.data.imgList
        //   console.log('压缩地址'+this.data.imgList[p])
          this.data.compImgList = []
          wx.compressImage({
            quality: 80,
            src: this.data.imgList[p],
            success: res => {
            //   console.log('未push'+res.tempFilePath)
              this.data.compImgList.push(res.tempFilePath)
            //   console.log('添加并压缩'+this.data.compImgList)
            },
            fail: e => {
            //   console.log(e)
              this.data.compImgList.push(path)
            }
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
    //   console.log('删除'+e.currentTarget.dataset.index)
    wx.showModal({
      title: '确定删除这张图片吗？',
      cancelText: '再看看',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
        //   console.log('删除之后0'+this.data.imgList)
        //   console.log('删除之后1'+this.data.compImgList)
        //   this.data.compImgList.splice(e.currentTarget.dataset.index, 1);
        //   console.log('删除之后2'+this.data.compImgList)
          this.setData({
            imgList: this.data.imgList,
            compImgList: this.data.compImgList
          })
        //   console.log('删除之后'+this.data.imgList)
        //   console.log('删除之后'+this.data.compImgList)
        }
      }
    })
  },
  //上传图片
  uploadImgs(pInfo) {
    this.setData({
      loading: true
    });
    // console.log(this.data.compImgList[this.data.fileIndex])
    wx.uploadFile({
      filePath: this.data.compImgList[this.data.fileIndex],
      name: 'file',
      url: 'https://tuanyi.fudan.edu.cn/uploadImg',
      success: (res) => {
        this.data.picList.push(res.data)
        // console.log(this.data.picList)
        this.data.fileIndex = this.data.fileIndex + 1
        if (this.data.fileIndex == this.data.compImgList.length) {
          this.data.fileIndex = 0 //传完，归零
          this.uploadInfo(pInfo)
        } else {
          this.uploadImgs(pInfo)
        }
      },
      fail: (res) => {
        // console.log(res)
        this.setData({
          loading: false
        });
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
    param['uid'] = this.data.uid
    //保存图片
    param['pic'] = this.data.picList
    //目标id
    param['targetid'] = this.data.targetid
    // console.log(param['pic'])
    //发起请求
    wx.request({
      url: 'https://tuanyi.fudan.edu.cn/editInfo', //待定
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      data: {
        pinfo: JSON.stringify(param)
      },
      success: (res) =>  {
        // console.log(res)
        this.setData({
          loading: false
        });
        wx.showToast({
          title: '修改成功，等待审核',
          icon: 'success'
        })
        wx.redirectTo({
            url: '/page/component/myrecommend/myrecommend',
          })
      },
      fail: (res) => {
        // console.log(res)
        this.setData({
          loading: false
        });
        wx.showToast({
          title: '修改失败',
          icon: 'error'
        })
      }
    })
  },
  submit: function () {
    // console.log(this.data.presentee)
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
            // console.log('操作已终止')
          } else if (res.confirm) {
            // console.log(666)
            // 进行图片的上传
            if (that.data.imgList.length == 0) {
                wx.showModal({
                    cancelColor: '#999', //取消按钮的文字颜色
                    title: '提示',
                    content: '请填写必填字段'
            })
            }else if(that.data.imgList.length > 0){
            //   console.log('在上传图片')
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