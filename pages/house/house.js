// pages/house/house.js
var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var QQMapWX = require('../../libs/qqmap-wx-jssdk');
var houseQuery = Bmob.Query('house')
var rentQuery = Bmob.Query('rentHouse')
var cityareaQuery = Bmob.Query('cityArea')
var app = getApp()
var size = 10
var that 
Page({  
 
  /** 
   * 页面的初始数据 
   */ 
  data: { 
    cityArr: ['北京', '上海', '广州', '深圳', '杭州'],
    city: '',
    rentName: "租金",
    areaName: "区域",
    tendencyName: '类型',
    textColor: false,
    textColor1: false,
    mark: true,
    publishTypeArr: ['房源', '求租'],
    publishTypeIndex: 0,
    more: false,
    pageIndex: 0,
    tendencyDisplay: false,
    areaDisplay: false,
    rentDisplay: false,
    tendency: ['不限', '合租', '整租'],
    chooseTendency: '',
    area: [],
    chooseArea: '',
    rents: ['不限', '1000元以下', '1000-2000元', '2000-3000元', '3000元以上'],
    chooseRent: '',
    house: [],
    rent: [],
    noRentSearchResult:false,
    showCityBubble: 'false',
    showHouseTypeBubble: 'false',
    searchText:'',
    searchColumnWidth:522,
    attractTop: false,
  },



  onLoad: function (options) {
    that = this;
    var publishType = wx.getStorageSync('publishTypeCache')
    if (!publishType) {
      var publishTypeIndex = 0;
    }
    else if (publishType=='房源'){
      var publishTypeIndex = 0;
    }
    else if (publishType == '求租') {
      var publishTypeIndex = 1;
    } 
  


    var rentCityCache = wx.getStorageSync('rentCityCache')
    var city = rentCityCache.nowCity
    if (!rentCityCache.nowCity){
      city = '北京';
    }
    that.setData({
      publishTypeIndex: publishTypeIndex,
      more: false,
      pageIndex: 0,
      city: city,
    })

    that.search();
    cityareaQuery.equalTo('cityName', '==', city)
      cityareaQuery.find().then(res => {
        that.setData({
          area: res[0].area,
        })
      })
    // if (publishTypeIndex == 0) {
    //   houseQuery.equalTo('cityName', '==', city)
    //   houseQuery.equalTo("del_flag", "==", '0');
    //   houseQuery.order("-top", "-createdAt")
    //   houseQuery.limit(size)
    //   houseQuery.include('publisher')
    //   houseQuery.find().then(res => {
    //     var noRentSearchResult = false;
    //     if (res.length == 0) {
    //       noRentSearchResult = true
    //     }
    //     for (let i = 0; i < res.length; i++) {
    //       //查询发布的状态点
    //       var now = new Date().getTime();
    //       var pubishT = Date.parse(new Date(res[i].createdAt.replace(/-/g, "/")));
    //       //计算出小时数
    //       var fromT = now - pubishT;//时间差
    //       var hours = Math.floor(fromT / (3600 * 1000))
    //       if (hours >= 0 && hours <= 1) {
    //         res[i].publishTime = '刚刚发布'
    //       } else if (hours > 1 && hours <= 24) {
    //         res[i].publishTime = '今日发布'
    //       } else if (hours > 24 && hours <= 36) {
    //         res[i].publishTime = '1天前发布'
    //       } else {
    //         var pubArray = res[i].createdAt.split(" ");
    //         var tArrar = pubArray[0].split("-");
    //         res[i].publishTime = tArrar[1] + '月' + tArrar[2] + '日发布'
    //       }
    //     }
    //     console.log('noRentSearchResult' + noRentSearchResult)
    //     console.log('onLoad结果数量' + res.length)
    //     console.log(res)
    //     that.setData({
    //       house: res,
    //       noRentSearchResult: noRentSearchResult
    //     })
    //     cityareaQuery.equalTo('cityName', '==', city)
    //     cityareaQuery.find().then(res => {
    //       that.setData({
    //         area: res[0].area,
    //       })
    //     })
    //   })
    // }
    // else if (publishTypeIndex == 1) {
    //   rentQuery.equalTo('cityName', '==', that.data.city)
    //   rentQuery.equalTo("del_flag", "==", '0');
    //   rentQuery.order("-top", "-createdAt")
    //   rentQuery.limit(size)
    //   rentQuery.include('publisher')
    //   rentQuery.find().then(res => {
    //     console.log(res)
    //     var noRentSearchResult=false;
    //     if (res.length==0){
    //       noRentSearchResult=true
    //     }
    //     for (let i = 0; i < res.length; i++) {
    //       //查询发布的状态点
    //       var now = new Date().getTime();
    //       var pubishT = Date.parse(new Date(res[i].createdAt.replace(/-/g, "/")));
    //       //计算出小时数
    //       var fromT = now - pubishT;//时间差
    //       var hours = Math.floor(fromT / (3600 * 1000))
    //       if (hours >= 0 && hours <= 1) {
    //         res[i].publishTime = '刚刚发布'
    //       } else if (hours > 1 && hours <= 24) {
    //         res[i].publishTime = '今日发布'
    //       } else if (hours > 24 && hours <= 36) {
    //         res[i].publishTime = '1天前发布'
    //       } else {
    //         var pubArray = res[i].createdAt.split(" ");
    //         var tArrar = pubArray[0].split("-");
    //         res[i].publishTime = tArrar[1] + '月' + tArrar[2] + '日发布'
    //       }
    //     }
    //     cityareaQuery.equalTo('cityName', '==', city)
    //     cityareaQuery.find().then(res => {
    //       that.setData({
    //         area: res[0].area,
    //       })
    //     })
    //     that.setData({
    //       rent: res,
    //       noRentSearchResult: noRentSearchResult
    //     })
    //   })
    // }


    // var locationCityCache = wx.getStorageSync('locationCityCache');
    // if (!locationCityCache){
    //   var qqmapsdk = new QQMapWX({
    //     key: 'JLJBZ-E2MW4-GJJUD-XZUP2-Q6DS6-3NBLT'
    //   });

    //   wx.getLocation({
    //     type: 'wgs84',
    //     success: function (res) {
    //       var latitude = res.latitude
    //       var longitude = res.longitude
    //       qqmapsdk.reverseGeocoder({
    //         location: {
    //           latitude: latitude,
    //           longitude: longitude
    //         },
    //         success: function (res) {
    //           console.log(res)
    //           wx.setStorageSync('locationCityCache', 'noShow')
    //           var matchCity = false;
    //           var rentCityindex;
    //           var locationCity = res['result']['address_component']['city']
    //           locationCity = locationCity.replace("市", "");
    //           var cityArr = that.data.cityArr;
    //           for (var i = 0; i < cityArr.length; i++) {
    //             if (locationCity == cityArr[i]) {
    //               matchCity = true;
    //               rentCityindex=i;
    //               break
    //             }
    //           }

    //           if (matchCity == true && locationCity != city) {
    //             wx.showModal({
    //               title: '是否切换至' + locationCity,
    //               confirmText: '切换',
    //               cancelText: '不切换',
    //               content: '当前' + city + ',' + '检测到您所在城市为' + locationCity,
    //               success: function (res) {
    //                 if (res.confirm) {
    //                   that.setData({
    //                     city: locationCity,
    //                   })
    //                   var rentCityCache = new Object;
    //                   rentCityCache.nowCity = locationCity;
    //                   rentCityCache.rentCityindex = rentCityindex;
    //                   wx.setStorageSync('rentCityCache', rentCityCache);
    //                   that.search();
    //                 } else if (res.cancel) {
    //                   console.log('用户点击取消')
    //                 }
    //               }
    //             })
    //           }

    //         },

    //         fail: function (res) {
    //           console.log(res);
    //         },
    //         complete: function (res) {
    //           console.log(res);
    //         }
    //       })
    //     }
    //   })
    // }
  },

  onShow: function () {
    wx.getStorageSync('publishTypeCache')
    var publishType = wx.getStorageSync('publishTypeCache')
    if (!publishType) {
      var publishTypeIndex = 0;
    }
    else if (publishType == '房源') {
      var publishTypeIndex = 0;
    }
    else if (publishType == '求租') {
      var publishTypeIndex = 1;
    }
    var rentCityCache = wx.getStorageSync('rentCityCache')
    var city = rentCityCache.nowCity
    if (!city) {
       city = '北京';
    }


    var showCityBubble = wx.getStorageSync('showCityBubble')
    if (!showCityBubble) {
      showCityBubble = 'true';
    }
    else {
      var showHouseTypeBubble = wx.getStorageSync('showHouseTypeBubble')
      if (!showHouseTypeBubble) {
        console.log('showHouseTypeBubble' + showHouseTypeBubble)
        showHouseTypeBubble = 'true';
      }
    }
    

    that.setData({
      city: city,
      showCityBubble: showCityBubble,
      showHouseTypeBubble: showHouseTypeBubble
    })
    var refreshHouse = app.globalData.refreshHouse;

    if (refreshHouse == 1) {
      that.setData({
        publishTypeIndex: publishTypeIndex,
        tendencyName: '类型',
        searchText: '',
      })
      var page = getCurrentPages().pop()
      app.globalData.refreshHouse = 0
      // page.onLoad();
      that.search();
    }
    else if (refreshHouse == 0) {

      if (getApp().globalData.houseChangeCity==true){
        cityareaQuery.equalTo('cityName', '==', city)
        cityareaQuery.find().then(res => {
          that.setData({
            area: res[0].area,
          })
        })
        that.search();
        getApp().globalData.houseChangeCity = false;
      }

      var searchText = getApp().globalData.houseSearchText;

      if (searchText){
        that.setData({
          searchText: searchText,
        })
        console.log('searchText' + searchText)
        that.search();
      }
    }
  },

  onPageScroll: function (e) {

    console.log(e.scrollTop)
    if (e.scrollTop > 203) {
      that.setData({
        attractTop: true,
      })

    }
    else {
      that.setData({
        attractTop: false,
      })
    }


  },


  cancelSearch:function(){
    getApp().globalData.houseSearchText = '';
    that.setData({
      searchText: '',
    })
    that.search();
  },


  cityBubble: function () {
    that.setData({
      showCityBubble: 'false' ,
      showHouseTypeBubble: 'true' 
    })
    wx.setStorageSync('showCityBubble', 'false')
  },


  houseTypeBubble:function(){
    that.setData({
      showHouseTypeBubble: 'false'
    })
    wx.setStorageSync('showHouseTypeBubble', 'false')
  },




  //选择城市
  chooseCity: function () {
    that.setData({
      showCityBubble: 'false'
    })
    wx.setStorageSync('showCityBubble', 'false')
    var cityIndex;
    var cityArr = that.data.cityArr;
    var city = that.data.city;
    for (var i = 0; i < cityArr.length;i++){
      if (city == cityArr[i]){
        cityIndex=i;
        break;
      }
    }

    wx.navigateTo({
      url: '../choose_city/choose_city?cityIndex=' + cityIndex
    })
  },

  // 去发布
  issue: function (e) {

    var cityIndex;
    var cityArr = that.data.cityArr;
    var city = that.data.city;
    for (var i = 0; i < cityArr.length; i++) {
      if (city == cityArr[i]) {
        cityIndex = i;
        break;
      }
    }


    var showCityBubble = wx.getStorageSync('showCityBubble')
    if (!showCityBubble) {
      showCityBubble = 'true'; 
    }

    var wxUserInfo = e.detail.userInfo;
    if (!wxUserInfo) {
      wx.showToast({
        title: '哎呀，你拒绝我啦',
        icon: 'none',
        duration: 2000
      })
    }
    else {
      let current = Bmob.User.current();
      var currentUserId = current.objectId;
      const queryUser = Bmob.Query('_User');
      queryUser.get(currentUserId).then(res => {
        var authorize = res.authorize;
        var userInfo = res.userInfo;
        if (!authorize) {
          var nickName = wxUserInfo.nickName;
          var userPic = wxUserInfo.avatarUrl;
          res.set('nickName', nickName);
          res.set('userPic', userPic);
          res.set('authorize', true);
          res.save();
          if (!userInfo) {
            wx.navigateTo({
              url: '../inputPerInfo/inputPerInfo?source=pubHous' + "&cityIndex=" + cityIndex
            })
          }
          else {
            wx.navigateTo({
              url: '../publishHouse1/publishHouse1?cityIndex=' + cityIndex
            })
          }
        }
        else {
          if (!userInfo) {
            wx.navigateTo({
              url: '../inputPerInfo/inputPerInfo?source=pubHous' + "&cityIndex=" + cityIndex
            })
          }
          else {
            wx.navigateTo({
              url: '../publishHouse1/publishHouse1?cityIndex=' + cityIndex
            })
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },

  //选择房源还是求租
  chooseClick: function (e) { 
    wx.pageScrollTo({
      scrollTop: 0, 
      duration: 0
    })

    console.log(that.data.publishTypeIndex)
    if (that.data.publishTypeIndex == 0) {
      that.setData({
        publishTypeIndex: 1
      })
    }
    else if (that.data.publishTypeIndex == 1) {
      that.setData({
        publishTypeIndex: 0
      })
    }

    var id = e.currentTarget.dataset.index;
    that.setData({
      // publishTypeIndex: id,
      pageIndex: 0,
      areaName: "区域",
      tendencyName: '类型',
      textColor: false,
      chooseTendency: '0',
      chooseArea: '',
      chooseRent: '',
      rentName: '租金'
    })
    if (that.data.publishTypeIndex == 0) {
      var page = getCurrentPages().pop();
      wx.setStorageSync('pubTypeIndexCache', 0);
      wx.setStorageSync('publishTypeCache', '房源')
      that.search();
      // page.onLoad()
    }
    if (that.data.publishTypeIndex == 1) { 
      rentQuery.equalTo('cityName', '==', that.data.city)
      rentQuery.equalTo("del_flag", "==", '0');
      rentQuery.order("-top", "-createdAt")
      rentQuery.limit(size)
      rentQuery.include('publisher')
      rentQuery.find().then(res => {
        var noRentSearchResult = false;
        if (res.length == 0) {
          console.log('第二个')
          noRentSearchResult = true
        }
        for (let i = 0; i < res.length; i++) {
          //查询发布的状态点
          var now = new Date().getTime();
          var pubishT = Date.parse(new Date(res[i].createdAt.replace(/-/g, "/")));
          //计算出小时数
          var fromT = now - pubishT;//时间差
          var hours = Math.floor(fromT / (3600 * 1000))
          if (hours >= 0 && hours <= 1) {
            res[i].publishTime = '刚刚发布'
          } else if (hours > 1 && hours <= 24) {
            res[i].publishTime = '今日发布'
          } else if (hours > 24 && hours <= 36) {
            res[i].publishTime = '1天前发布'
          } else {
            var pubArray = res[i].createdAt.split(" ");
            var tArrar = pubArray[0].split("-");
            res[i].publishTime = tArrar[1] + '月' + tArrar[2] + '日发布'
          }
        }
        that.setData({
          rent: res,
          noRentSearchResult: noRentSearchResult
        })
        wx.setStorageSync('publishTypeCache', '求租')
      })
    }
    that.setData({
      showHouseTypeBubble: 'false',
      searchText: '',
    })
    getApp().globalData.houseSearchText='',
    wx.setStorageSync('showHouseTypeBubble', 'false')

  },




  //区域箭头旋转动画
  rotaTriangle: function (e) {
    var rotaType=e.currentTarget.dataset.rotatype;
    if (that.data.mark == true) {
      if (rotaType=='tendency'){
        that.setData({
          mark: false,
          tendencyDisplay: true,
          areaDisplay: false,
          rentDisplay: false,
        })
      }
      else if (rotaType == 'area') {
        that.setData({
          mark: false,
          tendencyDisplay: false,
          areaDisplay: true,
          rentDisplay: false,
        })
      }
      else if (rotaType == 'rentFee') {
        that.setData({
          mark: false,
          tendencyDisplay: false,
          areaDisplay: false,
          rentDisplay: true,
        })
      }
    } 
    else {
      if (rotaType == 'tendency') {
        if (that.data.tendencyDisplay != true) {
          that.setData({
            mark: true,
            tendencyDisplay: true,
            areaDisplay: false,
            rentDisplay: false,
          })
        }
        else {
          that.setData({
            mark: true,
            tendencyDisplay: false,
            areaDisplay: false,
            rentDisplay: false,
          })
        }
      }
      else if (rotaType == 'area') {
        if (that.data.areaDisplay != true) {
          that.setData({
            mark: true,
            tendencyDisplay: false,
            areaDisplay: true,
            rentDisplay: false,
          })
        }
        else {
          that.setData({
            mark: true,
            tendencyDisplay: false,
            areaDisplay: false,
            rentDisplay: false,
          })
        }
      }
      else if (rotaType == 'rentFee') {
        if (that.data.rentDisplay != true) {
          that.setData({
            mark: true,
            tendencyDisplay: false,
            areaDisplay: false,
            rentDisplay: true,
          })
        }
        else {
          that.setData({
            mark: true,
            tendencyDisplay: false,
            areaDisplay: false,
            rentDisplay: false,
          })
        }
      }
    }
  },

  //查看房源详情
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


  chooseTendency: function (e) {
    var index = e.currentTarget.dataset.index;
    var tendency = that.data.tendency[index]
    if (tendency == '不限') {
      that.setData({
        chooseTendency: index,
        tendencyName: '类型',
        tendencyDisplay: false,
      })
    }
    else{
      that.setData({
        chooseTendency: index,
        tendencyName: tendency,
        tendencyDisplay: false,
      })
    }
    that.search();
  },


  chooseArea:function(e){
    var index = e.currentTarget.dataset.index;
    var area = that.data.area[index]
    if (area == '不限') {
      that.setData({
        areaDisplay: false,
        areaName: '区域',
        chooseArea: index,
        // textColor1: true
      })
    } else {
      that.setData({
        areaDisplay: false,
        chooseArea: index,
        areaName: area,
        // textColor1: true
      })
    }
    that.search();
  },

  chooseRent:function(e){
    var index = e.currentTarget.dataset.index;
    var rents = that.data.rents[index]
    if (rents=='不限'){
      that.setData({
        chooseRent: index,
        rentName: '租金',
        rentDisplay: false,
      })
    }
    else{
      that.setData({
        chooseRent: index,
        rentName: rents,
        rentDisplay: false,
      })
    }
    that.search();
  },


  openSearchPage:function(){
    wx.navigateTo({
      url: '../searchPage/searchPage?city=' + that.data.city + "&publishTypeIndex=" + that.data.publishTypeIndex
    })
  },


  search: function (searchText){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    var publishTypeIndex = that.data.publishTypeIndex;
    var searchDataSheet;
    if (publishTypeIndex == 0){
      searchDataSheet = houseQuery;

    }
    else if(publishTypeIndex == 1){
      searchDataSheet = rentQuery;
    }
 

    var searchText = getApp().globalData.houseSearchText;
    console.log('AAAAsearchText=' + searchText)

    if (searchText) {
      console.log('检测是否还留存搜索词')
      const query1 = searchDataSheet.equalTo("address", "==", { "$regex": "" + searchText + ".*" });
      const query2 = searchDataSheet.equalTo("title", "==", { "$regex": "" + searchText + ".*" });
      const query3 = searchDataSheet.equalTo("detail", "==", { "$regex": "" + searchText + ".*" });
      const query4 = searchDataSheet.equalTo("cityArea", "==", { "$regex": "" + searchText + ".*" });
      const query5 = searchDataSheet.equalTo("conmanyLabel1", "==", { "$regex": "" + searchText + ".*" });
      const query6 = searchDataSheet.equalTo("conmanyLabel2", "==", { "$regex": "" + searchText + ".*" });
      const query7 = searchDataSheet.equalTo("conmanyLabel3", "==", { "$regex": "" + searchText + ".*" });
      searchDataSheet.or(query1, query2, query3, query4, query5,query6,query7);

    }

  
    searchDataSheet.equalTo('cityName', '==', that.data.city)
    searchDataSheet.equalTo("del_flag", "==", '0');


    if (that.data.tendencyName == '类型' && that.data.areaName == '区域' && that.data.rentName == '1000元以下') {
      searchDataSheet.equalTo('rentFee', '<', 1000)
    }
    if (that.data.tendencyName == '类型' && that.data.areaName == '区域' && that.data.rentName == '1000-2000元') {
      searchDataSheet.equalTo('rentFee', '>=', 1000)
      searchDataSheet.equalTo('rentFee', '<=', 2000)
    }

    if (that.data.tendencyName == '类型' && that.data.areaName == '区域' && that.data.rentName == '2000-3000元') {
      searchDataSheet.equalTo('rentFee', '>=', 2000)
      searchDataSheet.equalTo('rentFee', '<=', 3000)
    }

    if (that.data.tendencyName == '类型' && that.data.areaName == '区域' && that.data.rentName == '3000元以上') {
      searchDataSheet.equalTo('rentFee', '>', 3000)
    }

    if (that.data.tendencyName != '类型' && that.data.areaName == '区域' && that.data.rentName == '租金') {
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
    }

    if (that.data.tendencyName != '类型' && that.data.areaName == '区域' && that.data.rentName == '1000元以下') {
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
      searchDataSheet.equalTo('rentFee', '<', 1000)
    }

    if (that.data.tendencyName != '类型' && that.data.areaName == '区域' && that.data.rentName == '1000-2000元') {
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
      searchDataSheet.equalTo('rentFee', '>=', 1000)
      searchDataSheet.equalTo('rentFee', '<=', 2000)

    }

    if (that.data.tendencyName != '类型' && that.data.areaName == '区域' && that.data.rentName == '2000-3000元') {
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
      searchDataSheet.equalTo('rentFee', '>=', 2000)
      searchDataSheet.equalTo('rentFee', '<=', 3000)
    }

    if (that.data.tendencyName != '类型' && that.data.areaName == '区域' && that.data.rentName == '3000元以上') {
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
      searchDataSheet.equalTo('rentFee', '>', 3000)
    }

    if (that.data.tendencyName == '类型' && that.data.areaName != '区域' && that.data.rentName == '租金') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
    }

    if (that.data.tendencyName == '类型' && that.data.areaName != '区域' && that.data.rentName == '1000元以下') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo('rentFee', '<', 1000)

    }

    if (that.data.tendencyName == '类型' && that.data.areaName != '区域' && that.data.rentName == '1000-2000元') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo('rentFee', '>=', 1000)
      searchDataSheet.equalTo('rentFee', '<=', 2000)
    }

    if (that.data.tendencyName == '类型' && that.data.areaName != '区域' && that.data.rentName == '2000-3000元') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo('rentFee', '>=', 2000)
      searchDataSheet.equalTo('rentFee', '<=', 3000)
    }

    if (that.data.tendencyName == '类型' && that.data.areaName != '区域' && that.data.rentName == '3000元以上') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo('rentFee', '>', 3000)
    }

    if (that.data.tendencyName != '类型' && that.data.areaName != '区域' && that.data.rentName == '租金') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
    }

    if (that.data.tendencyName != '类型' && that.data.areaName != '区域' && that.data.rentName == '1000元以下') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
      searchDataSheet.equalTo('rentFee', '<', 1000)
    }

    if (that.data.tendencyName != '类型' && that.data.areaName != '区域' && that.data.rentName == '1000-2000元') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
      searchDataSheet.equalTo('rentFee', '>=', 1000)
      searchDataSheet.equalTo('rentFee', '<=', 2000)
    }

    if (that.data.tendencyName != '类型' && that.data.areaName != '区域' && that.data.rentName == '2000-3000元') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
      searchDataSheet.equalTo('rentFee', '>=', 2000)
      searchDataSheet.equalTo('rentFee', '<=', 3000)
    }

    if (that.data.tendencyName != '类型' && that.data.areaName != '区域' && that.data.rentName == '3000元以上') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
      searchDataSheet.equalTo('rentFee', '>', 3000)
    }

    searchDataSheet.order("-top", "-createdAt")
    searchDataSheet.include('publisher')
    searchDataSheet.limit(size);
    searchDataSheet.find().then(res => {
      console.log(res)
      if (publishTypeIndex==0){
        console.log('结果数量' + res.length)
        var noRentSearchResult = false;
        if (res.length == 0) {
          console.log('第三个')
          noRentSearchResult = true;
        }
		//发布时间更改
		    for (let i = 0; i < res.length; i++) {
          //查询发布的状态点
          var now = new Date().getTime();
          var pubishT = Date.parse(new Date(res[i].createdAt.replace(/-/g, "/")));
          //计算出小时数
          var fromT = now - pubishT;//时间差
          var hours = Math.floor(fromT / (3600 * 1000))
          if (hours >= 0 && hours <= 1) {
            res[i].publishTime = '刚刚发布'
          } else if (hours > 1 && hours <= 24) {
            res[i].publishTime = '今日发布'
          } else if (hours > 24 && hours <= 36) {
            res[i].publishTime = '1天前发布'
          } else {
            var pubArray = res[i].createdAt.split(" ");
            var tArrar = pubArray[0].split("-");
            res[i].publishTime = tArrar[1] + '月' + tArrar[2] + '日发布'
          }
        }
        that.setData({
          house: res,
          pageIndex: 0,
          tendencyDisplay: false,
          areaDisplay: false,
          rentDisplay: false,
          noRentSearchResult: noRentSearchResult
        })
      }
      else if (publishTypeIndex == 1) {
        var noRentSearchResult = false;
        if (res.length == 0) {
          console.log('第四个')
          noRentSearchResult = true
        }
        for (let i = 0; i < res.length; i++) {
          //查询发布的状态点
          var now = new Date().getTime();
          var pubishT = Date.parse(new Date(res[i].createdAt.replace(/-/g, "/")));
          //计算出小时数
          var fromT = now - pubishT;//时间差
          var hours = Math.floor(fromT / (3600 * 1000))
          if (hours >= 0 && hours <= 1) {
            res[i].publishTime = '刚刚发布'
          } else if (hours > 1 && hours <= 24) {
            res[i].publishTime = '今日发布'
          } else if (hours > 24 && hours <= 36) {
            res[i].publishTime = '1天前发布'
          } else {
            var pubArray = res[i].createdAt.split(" ");
            var tArrar = pubArray[0].split("-");
            res[i].publishTime = tArrar[1] + '月' + tArrar[2] + '日发布'
          }
        }
        that.setData({
          rent: res,
          noRentSearchResult: noRentSearchResult,
          pageIndex: 0,
          tendencyDisplay: false,
          areaDisplay: false,
          rentDisplay: false,
        })
      }

    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: "加载数据出错，请检查网络",
        icon: 'none',
        mask: true,
        duration: 2000
      });
    })
  },




  onReachBottom: function () {

    var searchDataSheet;
    var publishTypeIndex = that.data.publishTypeIndex
    if (publishTypeIndex == 0) {
      searchDataSheet = houseQuery;
    }
    else if (publishTypeIndex == 1) {
      searchDataSheet = rentQuery;
    }



    var searchText = getApp().globalData.houseSearchText;
    console.log('searchText=' + searchText)

    if (searchText) {
      const query1 = searchDataSheet.equalTo("address", "==", { "$regex": "" + searchText + ".*" });
      const query2 = searchDataSheet.equalTo("title", "==", { "$regex": "" + searchText + ".*" });
      const query3 = searchDataSheet.equalTo("detail", "==", { "$regex": "" + searchText + ".*" });
      const query4 = searchDataSheet.equalTo("cityArea", "==", { "$regex": "" + searchText + ".*" });
      const query5 = searchDataSheet.equalTo("conmanyLabel1", "==", { "$regex": "" + searchText + ".*" });
      const query6 = searchDataSheet.equalTo("conmanyLabel2", "==", { "$regex": "" + searchText + ".*" });
      const query7 = searchDataSheet.equalTo("conmanyLabel3", "==", { "$regex": "" + searchText + ".*" });
      searchDataSheet.or(query1, query2, query3, query4, query5, query6, query7);

    }


    searchDataSheet.equalTo('cityName', '==', that.data.city)
    searchDataSheet.equalTo("del_flag", "==", '0');

    if (that.data.tendencyName == '类型' && that.data.areaName == '区域' && that.data.rentName == '1000元以下') {
      searchDataSheet.equalTo('rentFee', '<', 1000)
    }
    if (that.data.tendencyName == '类型' && that.data.areaName == '区域' && that.data.rentName == '1000-2000元') {
      searchDataSheet.equalTo('rentFee', '>=', 1000)
      searchDataSheet.equalTo('rentFee', '<=', 2000)
    }

    if (that.data.tendencyName == '类型' && that.data.areaName == '区域' && that.data.rentName == '2000-3000元') {
      searchDataSheet.equalTo('rentFee', '>=', 2000)
      searchDataSheet.equalTo('rentFee', '<=', 3000)
    }

    if (that.data.tendencyName == '类型' && that.data.areaName == '区域' && that.data.rentName == '3000元以上') {
      searchDataSheet.equalTo('rentFee', '>', 3000)
    }

    if (that.data.tendencyName != '类型' && that.data.areaName == '区域' && that.data.rentName == '租金') {
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
    }

    if (that.data.tendencyName != '类型' && that.data.areaName == '区域' && that.data.rentName == '1000元以下') {
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
      searchDataSheet.equalTo('rentFee', '<', 1000)
    }

    if (that.data.tendencyName != '类型' && that.data.areaName == '区域' && that.data.rentName == '1000-2000元') {
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
      searchDataSheet.equalTo('rentFee', '>=', 1000)
      searchDataSheet.equalTo('rentFee', '<=', 2000)

    }

    if (that.data.tendencyName != '类型' && that.data.areaName == '区域' && that.data.rentName == '2000-3000元') {
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
      searchDataSheet.equalTo('rentFee', '>=', 2000)
      searchDataSheet.equalTo('rentFee', '<=', 3000)
    }

    if (that.data.tendencyName != '类型' && that.data.areaName == '区域' && that.data.rentName == '3000元以上') {
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
      searchDataSheet.equalTo('rentFee', '>', 3000)
    }

    if (that.data.tendencyName == '类型' && that.data.areaName != '区域' && that.data.rentName == '租金') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
    }

    if (that.data.tendencyName == '类型' && that.data.areaName != '区域' && that.data.rentName == '1000元以下') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo('rentFee', '<', 1000)

    }

    if (that.data.tendencyName == '类型' && that.data.areaName != '区域' && that.data.rentName == '1000-2000元') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo('rentFee', '>=', 1000)
      searchDataSheet.equalTo('rentFee', '<=', 2000)
    }

    if (that.data.tendencyName == '类型' && that.data.areaName != '区域' && that.data.rentName == '2000-3000元') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo('rentFee', '>=', 2000)
      searchDataSheet.equalTo('rentFee', '<=', 3000)
    }

    if (that.data.tendencyName == '类型' && that.data.areaName != '区域' && that.data.rentName == '3000元以上') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo('rentFee', '>', 3000)
    }

    if (that.data.tendencyName != '类型' && that.data.areaName != '区域' && that.data.rentName == '租金') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
    }

    if (that.data.tendencyName != '类型' && that.data.areaName != '区域' && that.data.rentName == '1000元以下') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
      searchDataSheet.equalTo('rentFee', '<', 1000)
    }

    if (that.data.tendencyName != '类型' && that.data.areaName != '区域' && that.data.rentName == '1000-2000元') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
      searchDataSheet.equalTo('rentFee', '>=', 1000)
      searchDataSheet.equalTo('rentFee', '<=', 2000)
    }

    if (that.data.tendencyName != '类型' && that.data.areaName != '区域' && that.data.rentName == '2000-3000元') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
      searchDataSheet.equalTo('rentFee', '>=', 2000)
      searchDataSheet.equalTo('rentFee', '<=', 3000)
    }

    if (that.data.tendencyName != '类型' && that.data.areaName != '区域' && that.data.rentName == '3000元以上') {
      searchDataSheet.equalTo('cityArea', '==', that.data.areaName)
      searchDataSheet.equalTo("tenancyType", "==", that.data.tendencyName);
      searchDataSheet.equalTo('rentFee', '>', 3000)
    }

    if (publishTypeIndex == 0) {
      if (that.data.house.length >= that.data.pageIndex * size) {
        that.data.pageIndex++;
        wx.showLoading({
          title: '加载中...',
        })
      }
      searchDataSheet.order("-top", "-createdAt")
      searchDataSheet.skip(that.data.pageIndex * size);
      searchDataSheet.limit(size);
      searchDataSheet.include('publisher')
      searchDataSheet.find().then(res => {
        if (res.length == 0) {
          that.setData({
            more: true
          })
        }
        var arrConcat = that.data.house.concat(res)
        that.setData({
          house: arrConcat
        })
        wx.hideLoading()
      }).catch(err => {
        console.log(err);
        wx.showToast({
          title: "加载数据出错，请检查网络",
          icon: 'none',
          mask: true,
          duration: 2000
        });
      })
    }

    if (publishTypeIndex == 1) {
      if (that.data.rent.length >= that.data.pageIndex * size) {
        that.data.pageIndex++;
        wx.showLoading({
          title: '加载中...',
        })
      }
      searchDataSheet.order("-top", "-createdAt")
      searchDataSheet.skip(that.data.pageIndex * size);
      searchDataSheet.limit(size);
      searchDataSheet.include('publisher');
      searchDataSheet.find().then(res => {
        if (res.length == 0) {
          that.setData({
            more: true
          })
        }
        for (let i = 0; i < res.length; i++) {
          //查询发布的状态点
          var now = new Date().getTime();
          var pubishT = Date.parse(new Date(res[i].createdAt.replace(/-/g, "/")));
          //计算出小时数
          var fromT = now - pubishT;//时间差
          var hours = Math.floor(fromT / (3600 * 1000))
          if (hours >= 0 && hours <= 1) {
            res[i].publishTime = '刚刚发布'
          } else if (hours > 1 && hours <= 24) {
            res[i].publishTime = '今日发布'
          } else if (hours > 24 && hours <= 36) {
            res[i].publishTime = '1天前发布'
          } else {
            var pubArray = res[i].createdAt.split(" ");
            var tArrar = pubArray[0].split("-");
            res[i].publishTime = tArrar[1] + '月' + tArrar[2] + '日发布'
          }
        }
        var arrConcat = that.data.rent.concat(res)
        that.setData({
          rent: arrConcat
        })
        wx.hideLoading()
      }).catch(err => {
        console.log(err);
        wx.showToast({
          title: "加载数据出错，请检查网络",
          icon: 'none',
          mask: true,
          duration: 2000
        });
      })
    }
  },
  
  onShareAppMessage: function () {
    var title = '职前公社，校招实习租房一站式解决'
    return {
      title: title,
      path: '/pages/work/work',
      imageUrl: 'http://bmob-cdn-20509.b0.upaiyun.com/2018/08/22/0f8e89e840c4d900803f6925c823c270.png'
    }
  },

  onPullDownRefresh: function () {
    var page = getCurrentPages().pop()
    page.onLoad();
    wx.stopPullDownRefresh()
  } ,
  
  //防止穿透触摸
  on_move(){
      return ;
  }

}) 