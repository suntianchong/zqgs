var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var utils = require('../../utils/util.js');
var that;
Page({

 
  data: {
    publishtype: '',
    label1:"#标签1",
    label2: "#标签2",
    label3: "#标签3",
    title:'',
    detail:'',
    detail2: '', 
    housePic:[],
    rentCityindex:null,
    houseId:'',
  },

 
  onLoad: function (options) {
    
    that=this;
    if(options.id){
      console.log(options)
      that.setData({
        houseId:options.id
      })
      if(options.type==1){
        //房源
        const queryG = Bmob.Query('house');
        queryG.get(options.id).then(res => {
          console.log(res);
          that.setData({
            title: res.title,
            detail: res.detail,
            housePic: res.housePic,
            label1: res.conmanyLabel1,
            label2: res.conmanyLabel2,
            label3: res.conmanyLabel3,
          })
          getApp().globalData.publishHouse.conmanyLabel = res.conmanyLabel;

        }).catch(err => {
          console.log(err)
        })
      }else if(options.type==2){
       
          //求租
        const queryG = Bmob.Query('rentHouse');
        queryG.get(options.id).then(res => {
          console.log(res);
          that.setData({
            detail2: res.detail,
            housePic: res.housePic,
            label1: res.conmanyLabel1,
            label2: res.conmanyLabel2,
            label3: res.conmanyLabel3,
          })
          getApp().globalData.publishHouse2.conmanyLabel = res.conmanyLabel;

        }).catch(err => {
          console.log(err)
        })
      }
      
    }
    var publishtype = getApp().globalData.publishType;
    var rentCityindex = options.rentCityindex;

    that.setData({
      publishtype: publishtype,
      rentCityindex: rentCityindex 
    })
  },

  onShow:function(){
    var publishtype = getApp().globalData.publishType;
    if (publishtype=='房源'){
      var conmanyLabel = getApp().globalData.publishHouse.conmanyLabel;
    }
    else if (publishtype == '求租') {
      var conmanyLabel = getApp().globalData.publishHouse2.conmanyLabel;
    }
    
    if (conmanyLabel.length==1){
      that.setData({
        label1: conmanyLabel[0]
      })
    }
    else if (conmanyLabel.length == 2) {
      that.setData({
        label1: conmanyLabel[0],
        label2: conmanyLabel[1]
      })
    }
    else if (conmanyLabel.length == 3) {
      that.setData({
        label1: conmanyLabel[0],
        label2: conmanyLabel[1],
        label3: conmanyLabel[2]
      })
    }
  },


  upImg: function () {
    var that = this;
    var housePic = that.data.housePic;
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中...',
        })
        var tempFilePaths = res.tempFilePaths
        var file;
        for (let item of tempFilePaths) {
          file = Bmob.File('housePic.jpg', item);
        }
        file.save().then(res => {
          for(var i=0;i<res.length;i++){
            res[i]=JSON.parse(res[i]);
            housePic.push(res[i].url)
          }
          wx.hideLoading()
          that.setData({
            housePic: housePic,
          })
        })

      }
    })

  },


  delete: function (e) {
    var index = e.currentTarget.dataset.index;
    var housePic = that.data.housePic;
    housePic.splice(index, 1);
    that.setData({
      housePic: housePic
    });
  },

  searchCompany:function(){
    var conmanyLabel=getApp().globalData.publishHouse.conmanyLabel;
    var conmanyLabelNumber = conmanyLabel.length;
    if (conmanyLabelNumber==3){
      wx.showToast({
        title: '最多添加3个哦',
        icon: 'none',
        duration: 2000
      })
    }
    else{
      wx.navigateTo({
        url: '../searchCompany/searchCompany?source=publishHouse1'
      });
    }
  },

  searchCompany2: function () {
    var conmanyLabel = getApp().globalData.publishHouse2.conmanyLabel;
    var conmanyLabelNumber = conmanyLabel.length;
    if (conmanyLabelNumber == 3) {
      wx.showToast({
        title: '最多添加3个哦',
        icon: 'none',
        duration: 2000
      })
    }
    else {
      wx.navigateTo({
        url: '../searchCompany/searchCompany?source=publishHouse2'
      });
    }
  },

  clearLabel:function(){
    getApp().globalData.publishHouse.conmanyLabel=[];
    getApp().globalData.publishHouse2.conmanyLabel = [];
    that.setData({
      label1: "#标签1",
      label2: "#标签2",
      label3: "#标签3",
    })
  },

  inputTitle: function (e) {
    that.setData({
      title: e.detail.value,
    })
  },

  inputDetail: function (e) {
    that.setData({
      detail: e.detail.value,
    })
  },

  inputDetail2: function (e) {
    that.setData({
      detail2: e.detail.value,
    })
  },

  publishHouse:function(){
    var title = that.data.title;
    var detail = that.data.detail;
    var housePic = that.data.housePic;
    var publishTime = utils.getNowDay();
    if (!title){
      wx.showToast({
        title: '请输入房源标题',
        icon: 'none',
        duration: 2000
      })
    }
    else if (!detail) {
      wx.showToast({
        title: '请输入房源详情',
        icon: 'none',
        duration: 2000
      })
    }
    else if (housePic.length==0) {
      wx.showToast({
        title: '请上传几张房源图片吧~',
        icon: 'none',
        duration: 2000
      })
    }
    else{
      wx.showLoading({
        title: '上传中...',
      })
      getApp().globalData.publishHouse.title = title;
      getApp().globalData.publishHouse.detail = detail;

      var conmanyLabel = getApp().globalData.publishHouse.conmanyLabel;
      let current = Bmob.User.current();
      var currentUserId = current.objectId;
      const pointer = Bmob.Pointer('_User')
      const poiID = pointer.set(currentUserId) 
      const queryHouse = Bmob.Query('house');
      if(that.data.houseId!=''){
        queryHouse.set('id', that.data.houseId);
      }
      queryHouse.set('tenancyType', getApp().globalData.publishHouse.tenancyType);
      queryHouse.set('houseType', getApp().globalData.publishHouse.houseType);
      queryHouse.set('cityName', getApp().globalData.publishHouse.cityName);
      queryHouse.set('cityArea', getApp().globalData.publishHouse.cityArea);
      queryHouse.set('address', getApp().globalData.publishHouse.address.addressName);
      queryHouse.set('lat', getApp().globalData.publishHouse.address.lat);
      queryHouse.set('lng', getApp().globalData.publishHouse.address.lng);
      queryHouse.set('rentFee', parseInt(getApp().globalData.publishHouse.rentFee));
      queryHouse.set('contact', getApp().globalData.publishHouse.contact);
      queryHouse.set('conmanyLabel', conmanyLabel);
      if (conmanyLabel.length==1){
        queryHouse.set('conmanyLabel1', conmanyLabel[0]);
        queryHouse.set('conmanyLabel2', '');
        queryHouse.set('conmanyLabel3', '');
      }
      else if (conmanyLabel.length == 2) {
        queryHouse.set('conmanyLabel1', conmanyLabel[0]);
        queryHouse.set('conmanyLabel2', conmanyLabel[1]);
        queryHouse.set('conmanyLabel3', '');
      }
      else if (conmanyLabel.length == 3) {
        queryHouse.set('conmanyLabel1', conmanyLabel[0]);
        queryHouse.set('conmanyLabel2', conmanyLabel[1]);
        queryHouse.set('conmanyLabel3', conmanyLabel[2]);
      }
      queryHouse.set('title', title)
      queryHouse.set('detail', detail)
      queryHouse.set('housePic', housePic)
      queryHouse.set('publisher', poiID)
      queryHouse.set("top", "0");
      queryHouse.set("publishTime", publishTime);
      queryHouse.set("del_flag", '0');

      queryHouse.save().then(res => {

        var objectId = res.objectId;


        getApp().globalData.refreshHouse = 1;
        getApp().globalData.houseSearchText = '';

        var rentCityCache = new Object;
        rentCityCache.nowCity = getApp().globalData.publishHouse.cityName;
        rentCityCache.rentCityindex = that.data.rentCityindex;
        wx.setStorageSync('rentCityCache', rentCityCache)


        wx.setStorageSync('pubTypeIndexCache', 0);
        wx.setStorageSync('publishTypeCache', '房源')


        wx.hideLoading();
        wx.navigateTo({
          url: '../afterPubHous/afterPubHous?objectId=' + objectId + "&sharePic=" + housePic[0]
        });
      }).catch(err => {
        console.log(err)
      })
    }
  },

  publishHouse2: function () {
    var detail = that.data.detail2;
    var publishTime = utils.getNowDay();
    if (!detail) {
      wx.showToast({
        title: '请输入求租备注',
        icon: 'none',
        duration: 2000
      })
    }
    else {
      wx.showLoading({
        title: '上传中...',
      })
      getApp().globalData.publishHouse2.detail = detail;

      var conmanyLabel = getApp().globalData.publishHouse2.conmanyLabel;
      let current = Bmob.User.current();
      var currentUserId = current.objectId;
      const pointer = Bmob.Pointer('_User') 
      const poiID = pointer.set(currentUserId)
      const queryHouse = Bmob.Query('rentHouse');
      if(that.data.houseId!=''){
        queryHouse.set('id', that.data.houseId);  
      }
      queryHouse.set('enterTime', getApp().globalData.publishHouse2.enterTime);
      queryHouse.set('tenancyType', getApp().globalData.publishHouse2.tenancyType);
      queryHouse.set('sexType', getApp().globalData.publishHouse2.sexType);
      queryHouse.set('cityName', getApp().globalData.publishHouse2.cityName);
      queryHouse.set('cityArea', getApp().globalData.publishHouse2.cityArea);
      queryHouse.set('address', getApp().globalData.publishHouse2.address.addressName);
      queryHouse.set('lat', getApp().globalData.publishHouse2.address.lat);
      queryHouse.set('lng', getApp().globalData.publishHouse2.address.lng);
      queryHouse.set('rentFee', parseInt(getApp().globalData.publishHouse2.rentFee));
      queryHouse.set('contact', getApp().globalData.publishHouse2.contact);
      queryHouse.set('conmanyLabel', conmanyLabel);
      if (conmanyLabel.length == 1) {
        queryHouse.set('conmanyLabel1', conmanyLabel[0]);
        queryHouse.set('conmanyLabel2', '');
        queryHouse.set('conmanyLabel3', '');
      }
      else if (conmanyLabel.length == 2) {
        queryHouse.set('conmanyLabel1', conmanyLabel[0]);
        queryHouse.set('conmanyLabel2', conmanyLabel[1]);
        queryHouse.set('conmanyLabel3', '');
      }
      else if (conmanyLabel.length == 3) {
        queryHouse.set('conmanyLabel1', conmanyLabel[0]);
        queryHouse.set('conmanyLabel2', conmanyLabel[1]);
        queryHouse.set('conmanyLabel3', conmanyLabel[2]);
      }
      queryHouse.set('detail', detail)
      queryHouse.set('publisher', poiID)
      queryHouse.set("top", "0");
      queryHouse.set("publishTime", publishTime);
      queryHouse.set("del_flag", '0');
 
      var rentTag=new Array();
      if (getApp().globalData.publishHouse2.tenancyType=='合租'){
        rentTag.push(getApp().globalData.publishHouse2.tenancyType);
        rentTag.push(getApp().globalData.publishHouse2.sexType);
        rentTag.push(getApp().globalData.publishHouse2.enterTime);
      }
      else{
        rentTag.push(getApp().globalData.publishHouse2.tenancyType);
        rentTag.push(getApp().globalData.publishHouse2.enterTime);
      }
      queryHouse.set("rentTag", rentTag);
      queryHouse.save().then(res => {
        var objectId = res.objectId;
        getApp().globalData.refreshHouse = 1;

        getApp().globalData.houseSearchText = '';



        var rentCityCache = new Object;
        rentCityCache.nowCity = getApp().globalData.publishHouse2.cityName;
        rentCityCache.rentCityindex = that.data.rentCityindex;
        wx.setStorageSync('rentCityCache', rentCityCache)


        wx.setStorageSync('pubTypeIndexCache', 1);
        wx.setStorageSync('publishTypeCache', '求租')

        wx.hideLoading()
        wx.navigateTo({
          url: '../afterPubHous/afterPubHous?objectId=' + objectId
        });
      }).catch(err => {
        console.log(err)
      })
    }
  }


  
})