var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var utils = require('../../utils/util.js');
var houseQuery = Bmob.Query('house')
var rentQuery = Bmob.Query('rentHouse')
var app = getApp()
var size = 10
var that;
Page({

  data: {
    searchText:'',
    searchHistoryContent:[], 
    hideChoseColumn:false,

  },

  
  onLoad: function (options) {
    that=this;
    var searchHistoryContent = wx.getStorageSync('searchHistoryContent')
    console.log(searchHistoryContent)
    if (!searchHistoryContent) {
      searchHistoryContent =[];
    }
    
    
    that.setData({
      searchHistoryContent: searchHistoryContent,
    })
  },

  searchCom: function (e) {
    that.setData({
      searchText: e.detail.value,
      hideChoseColumn: false,
    })
  },



  choseInpComText:function(){
    var searchText = that.data.searchText;
    getApp().globalData.houseSearchText = searchText;
    var searchHistoryContent = wx.getStorageSync('searchHistoryContent');
    if (!searchHistoryContent) {
      searchHistoryContent = new Array();
      searchHistoryContent.unshift(searchText);
    }
    else {
      for (var i = 0; i < searchHistoryContent.length; i++) {
        if (searchHistoryContent[i] == searchText) {
          console.log('i=' + i)
          searchHistoryContent.splice(i, 1);
          break;
        }
      }
      if (searchHistoryContent.length==10){
        searchHistoryContent.splice(9, 1)
      }
      searchHistoryContent.unshift(searchText);
    }
    wx.setStorageSync('searchHistoryContent', searchHistoryContent);
    wx.navigateBack({
      delta: 1
    })

  },


  clickSearchHistory:function(e){
    var index = e.currentTarget.dataset.index;
    var searchText = that.data.searchHistoryContent[index];
    getApp().globalData.houseSearchText = searchText;


    var searchHistoryContent = wx.getStorageSync('searchHistoryContent');
    if (!searchHistoryContent) {
      searchHistoryContent = new Array();
      searchHistoryContent.unshift(searchText);
    }
    else {
      for (var i = 0; i < searchHistoryContent.length; i++) {
        if (searchHistoryContent[i] == searchText) {
          console.log('i=' + i)
          searchHistoryContent.splice(i, 1);
          break;
        }
      }
      if (searchHistoryContent.length == 10) {
        searchHistoryContent.splice(9, 1)
      }
      searchHistoryContent.unshift(searchText);
    }
    wx.setStorageSync('searchHistoryContent', searchHistoryContent);
    wx.navigateBack({
      delta: 1
    })
  },


  clearSearchInput:function(){
    that.setData({
      searchText :'',
    });
  },


  clearSearchHistory:function(){
    that.setData({
      searchHistoryContent: []
    });
    wx.setStorageSync('searchHistoryContent', [])
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