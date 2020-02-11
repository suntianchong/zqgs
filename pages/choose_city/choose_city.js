// pages/choose_city/choose_city.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    citys: ['北京', '上海', '广州', '深圳', '杭州'],
    chooseCity:0
  },

  chooseCity: function (e) {
    var that = this
    var citys = that.data.citys;
    var index = e.currentTarget.dataset.index;
    var nowCity = citys[index]
    that.setData({
      chooseCity: index,
    })

    var rentCityCache = new Object;
    rentCityCache.nowCity = nowCity;
    rentCityCache.rentCityindex = index;
    wx.setStorageSync('rentCityCache', rentCityCache)


    getApp().globalData.houseChangeCity = true;
    setTimeout(function () {
      wx.switchTab({
        url: '../house/house',
      })
    }, 200)
  },

  onLoad: function (options) {
    var that = this;
    var cityIndex = options.cityIndex;
    that.setData({
      chooseCity: cityIndex
    })
  },


})