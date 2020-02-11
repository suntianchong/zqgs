var Bmob = require('dist/Bmob-1.6.1.min.js');
//为了可以拉黑用户 传入MasterKey
// Bmob.initialize("1d37bf954a13cc03c48589834943f707", "cab447fcea0aa01ed41a7e01d12d56ae","d0957f31920531c9aab00aa732af6fc1");
Bmob.initialize("1d37bf954a13cc03c48589834943f707", "cab447fcea0aa01ed41a7e01d12d56ae", "d0957f31920531c9aab00aa732af6fc1");
App({



  onLaunch: function () {
    var that=this;

    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.screenWidth = res.windowWidth;
        that.screenHeight = res.windowHeight;
        that.pixelRatio = res.pixelRatio;
      }
    });


    Bmob.User.auth().then(res => {
      console.log(res)
      that.globalData.userId = res.objectId;
      that.globalData.openId = res.authData.weapp.openid;
      console.log('一键登陆成功')
    }).catch(err => {
      console.log(err);
    });
    console.log(that.globalData)
 
  },

  globalData: {
    workSearchText: '',
    houseSearchText:'',
    newWebviewVersion:'',
    showReddot: false,
    houseChangeCity:false,
    workChangeCity: false,
    companyName: '请输入公司名称',
    companyLogo: '',
    userId:'',
    openId:'',
    refreshWork:0 ,
    refreshHouse:0,
    refreshUserInfo: 0,
    refreshZY:0,
    publishType:'',
    publishHouse: { tenancyType: '', houseType: '', cityName: '', address: { addressName: '', lat: '', lng: '' }, cityArea: '', rentFee: null, contact: {}, conmanyLabel: [], title: '', detail:''},
    publishHouse2: { enterTime: '', tenancyType: '', sexType: '', cityName: '', cityArea: '', address: { addressName: '', lat: '', lng: '' }, rentFee: null, contact: {}, conmanyLabel: [], detail: '' },
    likeZYIndex:'',
    unLikeZYIndex: '',
    commentZYIndex: '',
    zhiYanSearchText:'',
  }
})