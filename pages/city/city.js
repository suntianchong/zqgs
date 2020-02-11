// pages/city/city.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityName: ["全国", "北京", "上海", "广州", "深圳", "杭州","其他"],
    cityClick:0
  },


  selectCityName:function(e){
    var that = this;
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    var city = that.data.cityName[index]
    
    var workCityCache = new Object;
    workCityCache.city = city;
    workCityCache.index = index;
    console.log(city)
    that.setData({
      cityClick: index 
    })


    wx.setStorageSync('workCityCache', workCityCache)

    getApp().globalData.workChangeCity = true;

    setTimeout(function(){
        wx.switchTab({
          url:'../work/work',
        })
    },200)
  },


  onLoad: function (options) {
  
  },

  onShow: function () {
    var that = this;

    var workCityCache = wx.getStorageSync('workCityCache')

    var index = workCityCache.index
    if (!index) {
      index = 0;
    }

    that.setData({
      cityClick: index
    })
  },

  onShareAppMessage: function () {
  
  }
})