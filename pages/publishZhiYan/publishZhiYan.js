var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var utils = require('../../utils/util.js');
var that;
Page({


  data: {
    textNum:0,
    images:[],
    content:'',
    anonymous:false,
  },

 
  onLoad: function (options) {
    that=this;

    let current = Bmob.User.current();
    var currentUserId = current.objectId;
    const queryUser = Bmob.Query('_User');
    queryUser.get(currentUserId).then(res => {


      var isBlocked = res.isBlocked;
      if (isBlocked == 1) {
        wx.showModal({
          title: '您已被禁言',
          showCancel: false,
          confirmText: '点击复制',
          content: '因您发布虚假或有害信息，管理员对您的账号实施了禁言操作，如有疑问请联系管理员微信17150318664，点击下方按钮复制微信号',
          success: function (res) {
            if (res.confirm) {
              wx.setClipboardData({
                data: '17150318664',
                success: function (res) {
                  wx.getClipboardData({
                    success: function (res) {
                      that.nextQuestion = setTimeout(function () {
                        wx.navigateBack({
                          delta: 1
                        })
                      }, 1000);

                    }
                  })
                }
              })
            }
          }
        })
      }


    }).catch(err => {
      console.log(err)
    })


  },

 
  onShow: function () { 
 
  },

  inputContent:function(e){
    that.setData({
      content: e.detail.value,
      textNum: e.detail.value.length,
    })
  },

  upImg: function () {
    var that = this;
    var images = that.data.images;
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中...',
        })
        var tempFilePaths = res.tempFilePaths
        var file;
        for (let item of tempFilePaths) {
          file = Bmob.File('images.jpg', item);
        }
        file.save().then(res => {
          for (var i = 0; i < res.length; i++) {
            res[i] = JSON.parse(res[i]);
            images.push(res[i].url)
          }
          wx.hideLoading()
          that.setData({
            images: images,
          })
        })

      }
    })

  },

  delete: function (e) {
    var index = e.currentTarget.dataset.index;
    var images = that.data.images;
    images.splice(index, 1);
    that.setData({
      images: images
    });
  },


  choseAnonymous:function(e){
    var choseAnonymous = e.currentTarget.dataset.index;
    if (choseAnonymous=='false'){
      that.setData({
        anonymous: true
      });
    }
    else{
      that.setData({
        anonymous: false
      });
    }
  },


  publish:function(){
    var content = that.data.content;
    var images = that.data.images;
    var anonymous = that.data.anonymous;
    if (!content){
      wx.showToast({
        title: '未输入内容',
        icon: 'none',
        duration: 2000
      })
    }
    else{
      let current = Bmob.User.current();
      var currentUserId = current.objectId;
      const pointer = Bmob.Pointer('_User')
      const poiID = pointer.set(currentUserId)
      const queryZY = Bmob.Query('zhiYan');
      queryZY.set("publisher", poiID)
      queryZY.set("content", content)
      queryZY.set("images", images)
      queryZY.set("commentNum", 0)
      queryZY.set("likeNum", 0)
      queryZY.set("posterNum", 0)
      queryZY.set("clickNum", 0)
      queryZY.set("shareNum", 0)
      queryZY.set("commentList", [])
      queryZY.set("anonymous", anonymous)
      queryZY.save().then(res => {
        console.log(res)
        getApp().globalData.refreshZY=1;
        getApp().globalData.zhiYanSearchText='';

        
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1000
        })

        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 1000)


      }).catch(err => {
        console.log(err)
      })
    }
  },

 
})