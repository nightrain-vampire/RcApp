Page({
    data: {
        pid: null,
        intro: null
    },
    //可获取路由中参数
    onLoad: function(options) {
        console.log(options['id'])
        //this.data['pid'] = options['id']
        this.setData({
            pid: options['id'],
            intro: options['intro']
        })
    },
    onShow: function() {

    }
})