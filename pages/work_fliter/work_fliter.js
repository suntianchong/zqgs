// pages/city/city.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList: ['运营', '产品', '技术', '设计', '职能', '市场'],
    itemListIndex:[0,0,0,0,0,0],
    choseItemList:[]
  },  


  onLoad: function (options) {
    that = this; 
    var workJobTypeCache = wx.getStorageSync('workJobTypeCache');//拿到选择职位的缓存

    if (workJobTypeCache) {//如果存在缓存，说明用户之前选择过，则把相应的数据赋值上去
      var choseItemList = workJobTypeCache.choseItemList;
      var itemListIndex = workJobTypeCache.itemListIndex;
      that.setData({
        choseItemList: choseItemList,
        itemListIndex: itemListIndex
      })
    }
  },


  choseItem: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var itemList = that.data.itemList;
    var itemListIndex = that.data.itemListIndex;
    var choseItemList = that.data.choseItemList;
    if (!choseItemList) {//为了安全起见再初始化一遍
      choseItemList=[];
    }

    if (itemListIndex[index] == 0) {//如果为0说明没选
      itemListIndex[index]=1;
      choseItemList.push(itemList[index])
      that.setData({
        choseItemList: choseItemList,
        itemList: itemList,
        itemListIndex: itemListIndex
      })
    }
    else {//为1则选了
      for (var i = 0; i < choseItemList.length; i++) {//把已经选的删了
        if (itemList[index]== choseItemList[i]){
          choseItemList.splice(i, 1);
        }
      }
      itemListIndex[index] = 0;
      that.setData({
        choseItemList: choseItemList,
        itemList: itemList,
        itemListIndex: itemListIndex
      })
    }
    console.log(choseItemList)
  },

  clear:function(){
    that.setData({
      itemList: ['运营', '产品', '技术', '设计', '职能', '市场'],
      itemListIndex: [0, 0, 0, 0, 0, 0],
      choseItemList: []
    })
  },

  shure:function(){
    getApp().globalData.refreshWork = 1;//返回后刷新一遍

    var workJobTypeCache = new Object;//存到缓存里
    workJobTypeCache.choseItemList = that.data.choseItemList;
    workJobTypeCache.itemListIndex = that.data.itemListIndex;
    wx.setStorageSync('workJobTypeCache', workJobTypeCache)
    wx.switchTab({
      url: '../work/work',
    })
  },

})