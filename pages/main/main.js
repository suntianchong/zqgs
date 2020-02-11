var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var app = getApp()
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: false,
    authorize: true,
    nickName: '',
    userPic: '',
    headContent: '点击来完善一下信息吧~',
    showReddot: false,
    sex: ''
  },
  to_publish:function(){
    wx.navigateTo({
      url: '../my_publish/my_publish',
    })
  },
  to_collect:function(){
    wx.navigateTo({
      url: '../myCollect/myCollect',
    })
  },
  goWebview:function(){
    wx.hideTabBarRedDot({
      index: 2,
    })
    wx.setStorageSync('webviewVersion', getApp().globalData.newWebviewVersion);
    getApp().globalData.showReddot = false;
    wx.navigateTo({
      url: '../webView/webView?source=active',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    let current = Bmob.User.current();
    var currentUserId = current.objectId;
    const queryUser = Bmob.Query('_User');
    queryUser.get(currentUserId).then(res => {
      console.log(res)
      var authorize = res.authorize;
      var userInfo = res.userInfo;
      console.log(authorize)
      if (!authorize){
        that.setData({
          authorize: false
        });
      }
      else{
        var nickName = res.nickName;
        var userPic = res.userPic;
        if (!userInfo) {
          that.setData({
            nickName: nickName,
            userPic: userPic
          });
        }
        else{
          var sex = res.sex;
          var age = res.age;
          var university = res.university;
          var company = res.company;
          var position = res.position;
          if (!company){
            position=''
          }

          if (!position) {
            position = ''
          }

         
          
          var headContent = sex + '·' + university + '·' + company + '·' + position;
          that.setData({
            nickName: nickName,
            userPic: userPic,
            headContent: headContent,
            userInfo:true,
            sex: sex,
          });
          
    
        }

        

      }
    }).catch(err => {
      console.log(err)
    })


    const querySetting = Bmob.Query('setting');
    querySetting.get('Rpcq000F').then(res => {
      var openShare = res.openShare;
      that.setData({
        openShare: openShare,
      })
    }).catch(err => {
      console.log(err)
    })

  },


  openAssist:function(){
    wx.setStorageSync('showShareToast', 'false')
    wx.navigateTo({
      url: '../assist_A/assist_A',
    })
  },

  onShow: function (options) {
    var refreshUserInfo = app.globalData.refreshUserInfo
    var showReddot = getApp().globalData.showReddot;
    that.setData({
      showReddot: showReddot,
    });
    if (refreshUserInfo == 1) {
      let current = Bmob.User.current();
      var currentUserId = current.objectId;
      const queryUser = Bmob.Query('_User');
      queryUser.get(currentUserId).then(res => {

        var sex = res.sex;
        var age = res.age;
        var university = res.university;
        var company = res.company;
        var position = res.position;

        if (!company) {
          position = ''
        }

        if (!position) {
          position = ''
        }


       
        var headContent = sex + '·' + university + '·' + company + '·' + position;
        app.globalData.refreshUserInfo = 0;
        that.setData({
          headContent: headContent,
        });
       



      }).catch(err => {
        console.log(err)
      })

    }
  },


  userInfoHandler:function(e){ 
    let current = Bmob.User.current();
    var currentUserId = current.objectId;
    var userInfo = e.detail.userInfo;
    if (!userInfo) {
      wx.showToast({
        title: '哎呀，你拒绝我啦',
        icon: 'none',
        duration: 2000
      })
    }
    else{
      var nickName = userInfo.nickName;
      var userPic = userInfo.avatarUrl;
      const queryUser = Bmob.Query('_User');
      queryUser.set('id', currentUserId) //需要修改的objectId
      queryUser.set('nickName', nickName)
      queryUser.set('userPic', userPic)
      queryUser.set('authorize', true)
      queryUser.save().then(res => {
        that.setData({
          authorize: true,
          nickName: nickName,
          userPic: userPic
        });
      }).catch(err => {

      })
    }
   
  },

  inputPerInfo:function(){
    var userInfo = false;
    let current = Bmob.User.current();
    var currentUserId = current.objectId;
    const queryUser = Bmob.Query('_User');
    queryUser.get(currentUserId).then(res => {
      userInfo = res.userInfo;
      wx.navigateTo({
        url: '../inputPerInfo/inputPerInfo?source=main&userInfo=' + userInfo,
      })
     
    }).catch(err => {
      console.log(err)
    })
  },

  aboutUs:function(){
    wx.navigateTo({
      url: '../aboutUs/aboutUs',
    })
  },

  onShareAppMessage: function () {
    var title = '职前公社，校招实习租房一站式解决'
    return {
      title: title,
      path: '/pages/work/work',
      imageUrl: 'http://bmob-cdn-20509.b0.upaiyun.com/2018/08/22/0f8e89e840c4d900803f6925c823c270.png'
    }
  }


})