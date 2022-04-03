Page({
  data: {
      cardData: [
          {id: 0},
          {id: 1},
          {id: 2},
          {id: 3},
          {id: 4}
      ],
      currentIndex: 0,
      currentCard: {},
      imgUrls:[
        'https://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=8b20fba45e6034a829b7b087fb23656c/14ce36d3d539b60028f67d12eb50352ac65cb75e.jpg',
        'https://gss0.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=3386e39a49fbfbeddc0c3e7948c0db0e/32fa828ba61ea8d3943606a1950a304e251f587a.jpg',
        'http://img04.sogoucdn.com/app/a/100520093/ca86e620b9e623ff-d72d635343d5bade-dcf2acda7a45cb44f172db138bdf8d2d.jpg',
       ]
      },
      //事件处理函数
      toupper:function(){
       console.log("触发了toupper");
  }
})



// Page({
//   data: {
//    imgUrls:[
//     'https://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=8b20fba45e6034a829b7b087fb23656c/14ce36d3d539b60028f67d12eb50352ac65cb75e.jpg',
//     'https://gss0.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=3386e39a49fbfbeddc0c3e7948c0db0e/32fa828ba61ea8d3943606a1950a304e251f587a.jpg',
//     'http://img04.sogoucdn.com/app/a/100520093/ca86e620b9e623ff-d72d635343d5bade-dcf2acda7a45cb44f172db138bdf8d2d.jpg',
//    ]
//   },
//   //事件处理函数
//   toupper:function(){
//    console.log("触发了toupper");
//   }
//  })