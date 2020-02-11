var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var utils = require('../../utils/util.js');
var jobQuery = Bmob.Query('zhiYan')
var app = getApp()
var size = 10
var that;
Page({

  data: {
    searchText: '',
    searchHistoryContent_zhiYan: [],
    hideChoseColumn: false,

  },


  onLoad: function (options) {
    that = this;
    var searchHistoryContent_zhiYan = wx.getStorageSync('searchHistoryContent_zhiYan')
    console.log(searchHistoryContent_zhiYan)
    if (!searchHistoryContent_zhiYan) {
      searchHistoryContent_zhiYan = [];
    }

    that.setData({
      searchHistoryContent_zhiYan: searchHistoryContent_zhiYan,
    })
  },

  searchCom: function (e) {
    that.setData({
      searchText: e.detail.value,
      hideChoseColumn: false,
    })
  },



  choseInpComText: function () {
    var searchText = that.data.searchText;
    getApp().globalData.zhiYanSearchText = searchText;
    getApp().globalData.refreshZY = 1;
    var searchHistoryContent_zhiYan = wx.getStorageSync('searchHistoryContent_zhiYan');
    if (!searchHistoryContent_zhiYan) {
      searchHistoryContent_zhiYan = new Array();
      searchHistoryContent_zhiYan.unshift(searchText);
    }
    else {
      for (var i = 0; i < searchHistoryContent_zhiYan.length; i++) {
        if (searchHistoryContent_zhiYan[i] == searchText) {
          console.log('i=' + i)
          searchHistoryContent_zhiYan.splice(i, 1);
          break;
        }
      }
      if (searchHistoryContent_zhiYan.length == 10) {
        searchHistoryContent_zhiYan.splice(9, 1)
      }
      searchHistoryContent_zhiYan.unshift(searchText);
    }
    wx.setStorageSync('searchHistoryContent_zhiYan', searchHistoryContent_zhiYan);
    wx.navigateBack({
      delta: 1
    })

  },


  clickSearchHistory: function (e) {
    var index = e.currentTarget.dataset.index;
    var searchText = that.data.searchHistoryContent_zhiYan[index];
    getApp().globalData.zhiYanSearchText = searchText;
    getApp().globalData.refreshZY = 1;

    var searchHistoryContent_zhiYan = wx.getStorageSync('searchHistoryContent_zhiYan');
    if (!searchHistoryContent_zhiYan) {
      searchHistoryContent_zhiYan = new Array();
      searchHistoryContent_zhiYan.unshift(searchText);
    }
    else {
      for (var i = 0; i < searchHistoryContent_zhiYan.length; i++) {
        if (searchHistoryContent_zhiYan[i] == searchText) {
          console.log('i=' + i)
          searchHistoryContent_zhiYan.splice(i, 1);
          break;
        }
      }
      if (searchHistoryContent_zhiYan.length == 10) {
        searchHistoryContent_zhiYan.splice(9, 1)
      }
      searchHistoryContent_zhiYan.unshift(searchText);
    }
    wx.setStorageSync('searchHistoryContent_zhiYan', searchHistoryContent_zhiYan);
    wx.navigateBack({
      delta: 1
    })
  },


  clearSearchInput: function () {
    that.setData({
      searchText: '',
    });
  },


  clearSearchHistory: function () {
    that.setData({
      searchHistoryContent_zhiYan: []
    });
    wx.setStorageSync('searchHistoryContent_zhiYan', [])
  },



  onShareAppMessage: function () {

  }
})