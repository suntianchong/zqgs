// pages/locMap/locMap.js
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 0,
    longitude: 0,
    markers: [{
      id: 1,
      latitude: 0,
      longitude: 0,
      title: '',
      callout:{}
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    that = this;
    var lat = options.lat;
    var lng = options.lng;
    var address = options.address;
    if (lat != null && lat != undefined && lat != "" && lat != null && lat != undefined && lat != ""){
      that.setData({
        latitude: lat,
        longitude:lng,
        markers: [{
          id: 1,
          latitude: lat,
          longitude: lng,
          title: address,
          callout: {
            content: address +" \n ",
            borderRadius: 10,
            padding: 10,
            display: 'ALWAYS',
            textAlign: 'left',
            bgColor:"#ffffff"
          }
        }]
      });
    }else{
      wx.showToast({
        title: "加载地图失败",
        icon: 'none',
        duration: 2000
      });
      //退出本界面
      //延时调用
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        });
      }, 2000);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

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