Page({
    data: {
        pid: null
    },
    //可获取路由中参数
    onLoad: function(options) {
        console.log(options['id'])
        //this.data['pid'] = options['id']
        this.setData({
            pid: options['id']
        })
    },
    onShow: function() {

    }
})