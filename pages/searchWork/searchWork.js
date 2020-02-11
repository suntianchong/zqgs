var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var utils = require('../../utils/util.js');
var jobQuery = Bmob.Query('job')
var app = getApp()
var size = 10
var that;
Page({

  data: {
    searchText: '',
    searchHistoryContent_work: [],
    hideChoseColumn: false,

  },


  onLoad: function (options) {
    that = this;
    var searchHistoryContent_work = wx.getStorageSync('searchHistoryContent_work')
    console.log(searchHistoryContent_work)
    if (!searchHistoryContent_work) {
      searchHistoryContent_work = [];
    }


    that.setData({
      searchHistoryContent_work: searchHistoryContent_work,
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
    getApp().globalData.workSearchText = searchText;
    var searchHistoryContent_work = wx.getStorageSync('searchHistoryContent_work');
    if (!searchHistoryContent_work) {
      searchHistoryContent_work = new Array();
      searchHistoryContent_work.unshift(searchText);
    }
    else {
      for (var i = 0; i < searchHistoryContent_work.length; i++) {
        if (searchHistoryContent_work[i] == searchText) {
          console.log('i=' + i)
          searchHistoryContent_work.splice(i, 1);
          break;
        }
      }
      if (searchHistoryContent_work.length == 10) {
        searchHistoryContent_work.splice(9, 1)
      }
      searchHistoryContent_work.unshift(searchText);
    }
    wx.setStorageSync('searchHistoryContent_work', searchHistoryContent_work);
    wx.navigateBack({
      delta: 1
    })

  },


  clickSearchHistory: function (e) {
    var index = e.currentTarget.dataset.index;
    var searchText = that.data.searchHistoryContent_work[index];
    getApp().globalData.workSearchText = searchText;


    var searchHistoryContent_work = wx.getStorageSync('searchHistoryContent_work');
    if (!searchHistoryContent_work) {
      searchHistoryContent_work = new Array();
      searchHistoryContent_work.unshift(searchText);
    }
    else {
      for (var i = 0; i < searchHistoryContent_work.length; i++) {
        if (searchHistoryContent_work[i] == searchText) {
          console.log('i=' + i)
          searchHistoryContent_work.splice(i, 1);
          break;
        }
      }
      if (searchHistoryContent_work.length == 10) {
        searchHistoryContent_work.splice(9, 1)
      }
      searchHistoryContent_work.unshift(searchText);
    }
    wx.setStorageSync('searchHistoryContent_work', searchHistoryContent_work);
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
      searchHistoryContent_work: []
    });
    wx.setStorageSync('searchHistoryContent_work', [])
  },







  goHousedetail: function (e) {
    var index = e.currentTarget.dataset.index;
    var objectId = that.data.house[index].objectId
    wx.navigateTo({
      url: '../publishdetail/publishdetail?object=' + objectId,
    })
  },

  goRentdetail: function (e) {
    var index = e.currentTarget.dataset.index;
    var objectId = that.data.rent[index].objectId
    wx.navigateTo({
      url: '../renddetail/renddetail?object=' + objectId,
    })
  },







  onShareAppMessage: function () {

  }
})