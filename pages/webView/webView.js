// pages/webView/webView.js
var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    link:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    wx.showLoading({
      title: '加载中...',
    })
    var source = options.source;
    console.log('source1' + source)
    if (source=='banner'){
      var indexNum = options.indexNum;
      const queryBanner = Bmob.Query("banner");
      queryBanner.order("number");
      queryBanner.find().then(res => {
        that.setData({
          link: res[indexNum].link,
          source: source
        })
        wx.hideLoading()

        queryBanner.get(res[indexNum].objectId).then(res => {
          var clickNumber = res.clickNumber;
          clickNumber++;
          console.log('clickNumber' + clickNumber)
          res.set('clickNumber', clickNumber)
          res.save()
        }).catch(err => {
          console.log(err)
        })

      });
    }
    else if (source == 'active') {
      var linkQuery = Bmob.Query("webview");
      linkQuery.get('47WQ888O').then(res => {
        that.setData({
          link: res.link,
        })
        wx.hideLoading()
        var clickNumber = res.clickNumber;
        clickNumber++;
        res.set('clickNumber', clickNumber)
        res.save()
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})