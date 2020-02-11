// pages/tipsOff/tipsOff.js
var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var app = getApp();
var common = require('../../utils/common.js');//定义公共处理函数
var util = require('../../utils/util.js');//定义公共处理函数
var that;//定义全局变量
//定义当前缓存的对象
var user;
//定义举报的类型
var tipsType = "house";//默认为house
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picLength:0,//图片de长度
    fontLength:0,//文字的长度
    tipPic:[],//图片链接列表
    detail: "",//输入的举报内容
    houseId: "",//房源id
    rentId: "",//求租id
    userId: "",//举报人id
    tipUserId: ""//被举报人id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var houseId = options.houseId;//房源id
    var rentId = options.rentId;//求租id
    var userId = options.userId;//举报人id
    var tipUserId = options.tipUserId;//被举报人id
    var typeParam = options.type;
    if (typeParam == "house"){
      tipsType = "house";
      that.setData({
        houseId: houseId,
        userId: userId,
        tipUserId: tipUserId
      }); 
    } else if (typeParam == "rent"){
      tipsType = "rent";
      that.setData({
        rentId: rentId,
        userId: userId,
        tipUserId: tipUserId
      }); 
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
  
  },
  //上传图片方法
  upImg: function () {
    var tipPic = that.data.tipPic;
    wx.chooseImage({
      count: 4,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        //console.log(res)
        var tempFilePaths = res.tempFilePaths
        var file;
        for (let item of tempFilePaths) {
          //console.log('itemn', item)
          file = Bmob.File('tipPic.jpg', item);
        }
        file.save().then(res => {
          for (var i = 0; i < res.length; i++) {
            res[i] = JSON.parse(res[i]);
            tipPic.push(res[i].url)
            //console.log(tipPic)
          }
          // console.log(res.length);
          // console.log(res);
          that.setData({
            tipPic: tipPic,
            picLength: tipPic.length
          })
        })

      }
    })
  },
  //输入举报内容
  inputDetail: function (e) {
    that.setData({
      detail: e.detail.value,
      fontLength: e.detail.value.length
    })
  },
  //删除图片内容
  delete: function (e) {
    var index = e.currentTarget.dataset.index;
    var tipPic = that.data.tipPic;
    tipPic.splice(index, 1);
    that.setData({
      tipPic: tipPic,
      picLength: tipPic.length
    });
  },
  submit: function(e){
    var houseId = that.data.houseId;//房源id
    var rentId = that.data.rentId;//求租id
    var userId = that.data.userId;//举报人id
    var tipUserId = that.data.tipUserId;//被举报人id
    var tipSave = Bmob.Query('tipsOff');
    //房源id house表Pointer对象
    var housePointer = Bmob.Pointer('house');
    const housePId = housePointer.set(houseId);
    //求租id rentHouse表Pointer对象
    var rentPointer = Bmob.Pointer('rentHouse');
    const rentPId = rentPointer.set(rentId);
    //举报人id User表Pointer对象
    var userPointer = Bmob.Pointer('_User');
    const userPId = userPointer.set(userId);
    //被举报人id User表Pointer对象
    var tipUserPointer = Bmob.Pointer('_User');
    const tipUserPId = tipUserPointer.set(tipUserId);
    var content = that.data.detail;//举报的内容
    var tipPic = that.data.tipPic;//举报的图片
    if(content.trim() =="" || content.trim() == undefined || content.trim() == null){
      wx.showToast({
          title: "请填写举报原因",
          icon: 'none',
          duration: 2000
        });
      return false;
    }
    tipSave.set("createUser",userPId);
    if(tipsType == "house"){
      tipSave.set("houseDetail", housePId);
    } else if (tipsType == "rent"){
      tipSave.set("rentDetail", rentPId);
    }
    tipSave.set("offUser",tipUserPId);
    tipSave.set("content",content);
    tipSave.set("tipPic",tipPic);
    wx.showLoading({
      title: '正在拉黑',
      mask: true
    })
    tipSave.save().then(res => {
      wx.hideLoading();
        wx.showToast({
        title: "已成功举报",
        icon: 'success',
        duration: 2000
      });
      //延时调用
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        });
      }, 2000)
    }).catch(err => {
        console.log(err);
        wx.showToast({
        title: "举报失败",
        icon: 'success',
        duration: 2000
      });
    })
  }
})