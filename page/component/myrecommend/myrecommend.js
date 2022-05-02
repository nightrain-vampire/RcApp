const app = getApp();

Page({
    data: {
        avatar: 'https://tuanyi.fudan.edu.cn/static//avatar.png',
        username: 'XXXX',
        subtitle: 'xxxxxxxxxxxxxxxxxxxxxx',
        cardData: {},
        currentIndex: [],
        LeftShow: [], //控制左箭头的显示与否
        RightShow: [], //控制右箭头的显示与否
        flag: [], //按钮是否能调用
        Plength: [], //每个候选人有多少图片
        loading: false,
        // 用户信息
        username: '',
        uid: '',
        userid: ''
    },
    onLoad: function () {
        var that = this;
        that.setData({
            // userid: app.globalData.userid,
            uid: app.globalData.uid,
            username: app.globalData.username
        })
        that.getMyVotes();
    },
    toEdit(e) {
        var id = e.target.id
        // console.log(id)
        wx.navigateTo({
          url: '../modifyrecommend/modifyrecommend?id=' + id
        })
    },
    getMyVotes() {
        var that = this
        this.setData({
            loading: true
        })
        //向后端接口发请求
        wx.request({
            url: 'https://tuanyi.fudan.edu.cn/getmyvotes',
            method: "POST",
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'chartset': 'utf-8'
            },
            data: {
                id : that.data.uid
            },
            success: function (res) {
                // console.log(res.data)
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
                    that.setData({
                        cardData: res.data,
                        LeftShow: Array(psize).fill(false),
                        RightShow: tmparray,
                        currentIndex: Array(psize).fill(0),
                        flag: Array(psize).fill(true),
                        Plength: tmplength,
                        loading: false
                    })
                    // console.log(that.data.Plength)
                    // console.log(that.data.RightShow)
                } else {
                    that.setData({
                        loading: false
                    })
                    wx.showToast({
                        title: '目前没有提名',
                        icon: 'none'
                    })
                }
            },
            fail: res => {
                console.log('加载失败', res)
                this.setData({
                    loading: false
                })
            }
        })
    },
    // 阻止用户手动滑动
    stopTouchMove: function () {
        return false;
    },
    //动画全部完成
    changeFinish: function (e) {
        var that = this
        var index = e.target.id //获取是哪个card滑完了
        that.setData({
            ['flag[' + index + ']']: true
        })
        console.log(that.data.flag[index])
    },
    //左滑控制
    toLeft: function (e) {
        var that = this
        var index = e.target.id //获取是哪个card调用了
        // 动画还未完成，不执行
        if (!that.data.flag[index]) {
            return
        } else {
            // 修改按钮为不可用
            that.setData({
                ['flag[' + index + ']']: false
            })
            console.log(that.data.flag[index])
            var id = that.data.currentIndex[index] //获取当前卡片的索引
            // 是否解放右按钮
            if ((!that.data.RightShow[index]) && id < that.data.Plength[index]) {
                that.setData({
                    ['RightShow[' + index + ']']: true
                })
                console.log(that.data.RightShow[index])
            }
            // 是否隐藏左按钮
            if ((that.data.LeftShow[index]) && id == 1) {
                that.setData({
                    ['LeftShow[' + index + ']']: false
                })
                console.log(that.data.LeftShow[index])
            }
            // 下一页
            that.setData({
                ['currentIndex[' + index + ']']: id - 1
            })
            console.log(that.data.currentIndex[index])
        }
    },
    //右滑控制
    toRight: function (e) {
        var that = this
        var index = e.target.id //获取是哪个card调用了
        // 动画还未完成，不执行
        if (!that.data.flag[index]) {
            return
        } else {
            // 修改按钮为不可用
            that.setData({
                ['flag[' + index + ']']: false
            })
            console.log(that.data.flag[index])
            var id = that.data.currentIndex[index] //获取当前卡片的索引
            // 是否解放左按钮
            if (id == 0) {
                that.setData({
                    ['LeftShow[' + index + ']']: true
                })
                console.log(that.data.LeftShow[index])
            }
            // 是否隐藏右按钮
            if (id == that.data.Plength[index] - 2) {
                that.setData({
                    ['RightShow[' + index + ']']: false
                })
                console.log(that.data.RightShow[index])
            }
            // 下一页
            that.setData({
                ['currentIndex[' + index + ']']: id + 1
            })
            console.log(that.data.currentIndex[index])
        }
    }
})