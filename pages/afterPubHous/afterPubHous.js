var that;
Page({

  
  data: {
    objectId:''
  },

  
  onLoad: function (options) {
    that=this;
    var objectId = options.objectId;
    var sharePic = options.sharePic;
    that.setData({
      objectId: objectId,
      sharePic: sharePic
    });
  },

  comeBack:function(){
    wx.switchTab({
      url: '../house/house'
    });
  },

  onShareAppMessage: function () {
    var publishType = getApp().globalData.publishType;
    if (publishType=='房源'){
      var title = getApp().globalData.publishHouse.title; 
      return { 
        title: title,
        path: '/pages/publishdetail/publishdetail?object=' + that.data.objectId + "&shared=true",
        imageUrl: that.data.sharePic
      }
    }
    else if (publishType == '求租') {
      var title = '【求租】' + getApp().globalData.publishHouse2.cityName + getApp().globalData.publishHouse2.cityArea + '的房间，有合适的房源求推荐'
      return {
        title: title,
        path: '/pages/renddetail/renddetail?object=' + that.data.objectId + "&shared=true",
        imageUrl: 'http://bmob-cdn-20509.b0.upaiyun.com/2018/08/22/0f8e89e840c4d900803f6925c823c270.png'
      }
    }
  },

  onUnload: function () {
    getApp().globalData.publishType = '';
    getApp().globalData.publishHouse = { tenancyType: '', houseType: '', cityName: '', address: { addressName: '', lat: '', lng: '' }, cityArea: '', rentFee: null, contact: {}, conmanyLabel: [], title: '', detail: '' };
    getApp().globalData.publishHouse2 = { enterTime: '', tenancyType: '', sexType: '', cityName: '', cityArea: '', address: { addressName: '', lat: '', lng: '' }, rentFee: null, contact: {}, conmanyLabel: [], detail: '' };
  }
})