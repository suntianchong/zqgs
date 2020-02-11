var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var utils = require('../../utils/util.js');
var that;
Page({

  data: {
    authorizeLocal:true,

    publishTypeArr: ['房源', '求租'],
    publishTypeIndex: null,
    tenancyType:['合租','整租'], 
    tenancyTypeIndex:0,
    tenancyType2: ['合租', '整租'],
    tenancyTypeIndex2: 0,

    city:'选择房源所在城市',
    city2: '选择求租城市',

    cityArea: '选择房源所在区域',
    cityArea2: '选择求租区域',


    cityAreaArr:[],
    cityAreaArrIndex: 0,
    cityAreaArrIndex2: 0,

    cityAreaDisplay: false, 
    mark: true,

    cityArray: ['北京', '上海', '广州', '深圳', '杭州'],
    cityIndex:0,

    houseType: ['一室', '二室', '三室', '四室+'],
    houseTypeIndex: 0,
    sexType: ['限男生', '限女生', '男女不限'],
    sexTypeIndex: 0,
    addressName: '选择房源位置（点击开启地图）',
    addressName2: '选择求租地点（点击开启地图）',
    latitude: '',
    latitude2: '',
    longitude: '',
    longitude2: '',
    choseContactType:'weChat',
    choseContactType2: 'weChat',
    rentFee:null,
    rentFee2: null,
    contact:'',
    contact2: '',
    nowTime:'',
    getNowDayPlusYear:'',
    enterTime:'选择你的入住时间',
    showTab:true,
    houseId:''//看是否从编辑调过来的
  },


  onLoad: function (options) {
  
    that=this;

    var cityIndex = options.cityIndex;
    console.log('cityIndex' + cityIndex)

    wx.getStorageSync('publishTypeCache')
    var publishType = wx.getStorageSync('publishTypeCache')
    if (!publishType) {
      var publishTypeIndex = 0;
      that.setData({
        cityIndex: cityIndex,
        city: that.data.cityArray[cityIndex]
      })
    }
    else if (publishType == '房源') {
      var publishTypeIndex = 0;
      that.setData({
        cityIndex: cityIndex,
        city: that.data.cityArray[cityIndex]
      })

    }
    else if (publishType == '求租') {
      var publishTypeIndex = 1;
      that.setData({
        cityIndex: cityIndex,
        city2: that.data.cityArray[cityIndex]
      })
    } 

    that.setData({
      publishTypeIndex: publishTypeIndex,
    })
    if (options.id!=''&&options.id!=null&&options.id!=undefined&&options.id!="undefined") {
      console.log(options)
      that.setData({
        houseId: options.id,
      })
      if (options.publishTypeIndex == 0) {
        that.setData({
          publishTypeIndex: 0,
          showTab: false,
        });
        //房源
        const query = Bmob.Query('house');
        query.get(options.id).then(res => {
          console.log(res);
          let houseTypeIndex;
          switch (houseTypeIndex) {
            case '一室': houseTypeIndex = 1;
            case '二室': houseTypeIndex = 2;
            case '三室': houseTypeIndex = 3;
            case '四室+': houseTypeIndex = 4;
          }
          that.setData({
            tenancyTypeIndex: res.tenancyTypeIndex == '合租' ? 0 : 1,
            houseTypeIndex: houseTypeIndex,
            addressName: res.address,
            cityArea: res.cityArea,
            city: res.cityName,
            rentFee: res.rentFee,
            latitude: res.lat,
            longitude: res.lng,
          })
        }).catch(err => {
          console.log(err)
        })
      } else if (options.publishTypeIndex == 1) {
        that.setData({
          publishTypeIndex: 1,
          showTab: false,
        })
        //求租
        const query = Bmob.Query('rentHouse');
        query.get(options.id).then(res => {
          console.log(res);
          let sexTypeIndex;
          switch (res.sexType) {
            case "": sexTypeIndex = 0;
            case "限男生": sexTypeIndex = 0;
            case "限女生": sexTypeIndex = 1;
            case "男女不限": sexTypeIndex = 2;
          }
          that.setData({
            enterTime: res.enterTime,
            tenancyTypeIndex2: res.tenancyType == '整租' ? 1 : 0,
            sexTypeIndex: sexTypeIndex,
            city2: res.cityName,
            cityArea2: res.cityArea,
            addressName2: res.address,
            latitude2: res.lat,
            longitude2: res.lng,
            rentFee2: res.rentFee
          })
        }).catch(err => {
          console.log(err)
        })
      }      
    }

    var nowTime = utils.getNowDay();
    var getNowDayPlusYear = utils.getNowDayPlusYear();

    let current = Bmob.User.current();
    var currentUserId = current.objectId;
    const queryUser = Bmob.Query('_User');
    queryUser.get(currentUserId).then(res => {
      var choseContactType = res.contact.contactType;
      var contact = res.contact.contactContent;
      that.setData({
        nowTime: nowTime,
        getNowDayPlusYear: getNowDayPlusYear,
        choseContactType: choseContactType,
        choseContactType2: choseContactType,
        contact: contact,
        contact2: contact,
      })

      var isBlocked = res.isBlocked;
      if (isBlocked == 1) {
        wx.showModal({
          title: '您已被禁言',
          showCancel: false,
          confirmText: '点击复制',
          content: '因您发布虚假或有害信息，管理员对您的账号实施了禁言操作，如有疑问请联系管理员微信17150318664，点击下方按钮复制微信号',
          success: function (res) {
            if (res.confirm) {
              wx.setClipboardData({
                data: '17150318664',
                success: function (res) {
                  wx.getClipboardData({
                    success: function (res) {
                      that.nextQuestion = setTimeout(function () {
                        wx.navigateBack({
                          delta: 1
                        })
                      }, 2000);

                    }
                  })
                }
              })
            }
          }
        })
      }


    }).catch(err => {
      console.log(err)
    })
  },


  choseCity: function (e) {
    var publishtype = e.currentTarget.dataset.publishtype;
    var choseCity = that.data.cityArray[e.detail.value];
    if (publishtype=='FY'){
      this.setData({
        city: choseCity,
        cityIndex: e.detail.value,
        cityAreaArr: [],
        cityAreaArrIndex: 0,
        cityArea: '选择房源所在区域'
      })
    }
    else if (publishtype == 'QZ') {
      this.setData({
        city2: choseCity,
        cityIndex: e.detail.value,
        cityAreaArr: [],
        cityAreaArrIndex2: 0,
        cityArea2: '选择求租区域'
      })
    }
  },


  chooseCityArea:function(e){
    var publishtype = e.currentTarget.dataset.publishtype;
    var city = that.data.city;
    var city2 = that.data.city2;
    if (publishtype == 'FY') {
      if (city == '选择房源所在城市') {
        wx.showToast({
          title: '请先选择房源所在城市',
          icon: 'none',
          duration: 2000
        })
      }
      else {
        if (that.data.mark == true) {
          that.setData({
            mark: false,
            cityAreaDisplay: true
          })
          const queryCityArea = Bmob.Query("cityArea");
          queryCityArea.equalTo("cityName", "==", city);
          queryCityArea.find().then(res => {
            var cityAreaArr = res[0].area.splice(1)
            console.log(cityAreaArr)
            that.setData({
              cityAreaArr: cityAreaArr
            })
          });
        } else {
          that.setData({
            mark: true,
            cityAreaDisplay: false
          })
        }
      }
    }
    else if (publishtype == 'QZ') {
      if (city2 == '选择求租城市') {
        wx.showToast({
          title: '请先选择求租城市',
          icon: 'none',
          duration: 2000
        })
      }
      else {
        if (that.data.mark == true) {
          that.setData({
            mark: false,
            cityAreaDisplay: true
          })
          const queryCityArea = Bmob.Query("cityArea");
          queryCityArea.equalTo("cityName", "==", city2);
          queryCityArea.find().then(res => {
            var cityAreaArr = res[0].area.splice(1)
            that.setData({
              cityAreaArr: cityAreaArr
            })
          });
        } 
        else {
          that.setData({
            mark: true,
            cityAreaDisplay: false
          })
        }
      }
    }


  },

  selectArea: function (e) {
    if (that.data.mark == true) {
      that.setData({
        mark: false,
        cityAreaDisplay: true
      })
    } else {
      that.setData({
        mark: true,
        cityAreaDisplay: false
      })
    }
  },

  chooseArea: function (e) {
    var publishtype = e.currentTarget.dataset.publishtype;
    var index = e.currentTarget.dataset.index;
    var cityArea = that.data.cityAreaArr[index]


    if (publishtype == 'FY') {
      that.setData({
        cityAreaArrIndex: index,
        cityArea: cityArea,
        mark: true,
        cityAreaDisplay: false
      })
    }
    else if (publishtype == 'QZ') {
      that.setData({
        cityAreaArrIndex2: index,
        cityArea2: cityArea,
        mark: true,
        cityAreaDisplay: false
      })
    }
  },

  choseEnterTime: function (e) {
    this.setData({
      enterTime: e.detail.value
    })
  },

  authorizeLocal:function(e){
    // console.log(e.detail.authSetting.['scope.userLocation'])
    that.setData({
      authorizeLocal: true,
    })
  },

  openMap:function(e){
    var publishtype = e.currentTarget.dataset.publishtype;
    wx.getSetting({
      success(res) {
        console.log(res)
          wx.chooseLocation({
            success: function (res) {
              console.log('333333')
              console.log(res)
              if (publishtype == 'FY') {
                that.setData({
                  addressName: res.name,
                  latitude: res.latitude,
                  longitude: res.longitude,
                })
              }
              else if (publishtype == 'QZ') {
                that.setData({
                  addressName2: res.name,
                  latitude2: res.latitude,
                  longitude2: res.longitude,
                })
              }

            },
            fail: function (e) {
              console.log(e)
              if (e.errMsg == 'chooseLocation:fail auth deny' || e.errMsg == 'chooseLocation:fail:auth denied' || e.errMsg == 'chooseLocation:fail auth denied'){
                that.setData({
                  authorizeLocal: false
                })
              }
             
            }
          })
          
      }
    })
  },

 

  choseTenancyType:function(e){
    var publishtype = e.currentTarget.dataset.publishtype;
    var index = e.currentTarget.dataset.index;
    console.log(publishtype);
    console.log(index);
    if (publishtype == 'FY') {
      that.setData({
        tenancyTypeIndex: index
      })
    }
    else if (publishtype == 'QZ') {
      that.setData({
        tenancyTypeIndex2: index
      })
    }
  },



  chosehouseType: function (e) {
    var index = e.currentTarget.dataset.index;
    that.setData({
      houseTypeIndex: index
    })
  },

  choseSexType: function (e) {
    var index = e.currentTarget.dataset.index;
    that.setData({
      sexTypeIndex: index
    })
  },


  choseContactType:function(e){
    var index = e.currentTarget.dataset.index;
    that.setData({
      choseContactType: index
    })
  },

  choseContactType2: function (e) {
    var index = e.currentTarget.dataset.index;
    that.setData({
      choseContactType2: index
    })
  },

  rentFee:function(e){
    that.setData({
      rentFee: e.detail.value,
    })
    var publishtype = e.currentTarget.dataset.publishtype;
    if (publishtype == 'FY') {
      that.setData({
        rentFee: e.detail.value,
      })
    }
    else if (publishtype == 'QZ') {
      that.setData({
        rentFee2: e.detail.value,
      })
    }
  },



  contact: function (e) {
    var publishtype = e.currentTarget.dataset.publishtype;
    if (publishtype == 'FY') {
      that.setData({
        contact: e.detail.value,
      })
    }
    else if (publishtype == 'QZ') {
      that.setData({
        contact2: e.detail.value,
      })
    }
  },


  chooseClick: function (e) {
    var that = this
    var id = e.currentTarget.dataset.index;
    that.setData({
      publishTypeIndex: id
    })
  },

  nextStep:function(e){
    var publishtype = e.currentTarget.dataset.publishtype;
//////////////////////////////房源发布/////////////////////////////////
    if (publishtype == 'FY') {
      var tenancyType = that.data.tenancyType[that.data.tenancyTypeIndex];
      var houseType = that.data.houseType[that.data.tenancyTypeIndex];
      var cityName = that.data.city;
      var addressName = that.data.addressName;
      var cityArea = that.data.cityArea;
      var rentFee = that.data.rentFee;
      var contact = new Object;
      contact.contactType = that.data.choseContactType;
      contact.contactContent = that.data.contact
      var address = new Object;
      address.addressName = that.data.addressName;
      address.lat = that.data.latitude;
      address.lng = that.data.longitude
      if (cityName == '选择房源所在城市') {
        wx.showToast({
          title: '请选择房源所在城市',
          icon: 'none',
          duration: 2000
        })
      }
      else if (cityArea == '选择房源所在区域') {
        wx.showToast({
          title: '请选择房源所在区域',
          icon: 'none',
          duration: 2000
        })
      }
      else if (addressName == '选择房源位置（点击开启地图）') {
        wx.showToast({
          title: '请选择房源位置',
          icon: 'none',
          duration: 2000
        })
      }
      else if (!rentFee) {
        wx.showToast({
          title: '请输入租金',
          icon: 'none',
          duration: 2000
        })
      }
      else if (!contact.contactContent) {
        wx.showToast({
          title: '请输入联系方式',
          icon: 'none',
          duration: 2000
        })
      }
      else {
        getApp().globalData.publishType = that.data.publishTypeArr[that.data.publishTypeIndex];
        var publishHouse = getApp().globalData.publishHouse;
        publishHouse.tenancyType = tenancyType;
        publishHouse.houseType = houseType;
        publishHouse.cityArea = cityArea;
        publishHouse.cityName = cityName;
        publishHouse.address = address;
        publishHouse.rentFee = rentFee;
        publishHouse.contact = contact;
        getApp().globalData.publishHouse = publishHouse;

        if(that.data.houseId==''){//没有带id走发布
          wx.navigateTo({
            url: '../publishHouse2/publishHouse2?rentCityindex=' + that.data.cityIndex
          });
        }else{
          //走编辑
          wx.navigateTo({
            url: '../publishHouse2/publishHouse2?id='+that.data.houseId+'&type=1'
          });
        }
      }
    }
//////////////////////////////求租发布/////////////////////////////////
    else if (publishtype == 'QZ') {
      var enterTime = that.data.enterTime;
      var cityName = that.data.city2;
      var cityArea = that.data.cityArea2;
      var tenancyType = that.data.tenancyType2[that.data.tenancyTypeIndex2];
      if (tenancyType == '合租') {
        var sexType = that.data.sexType[that.data.sexTypeIndex];
      }
      else {
        var sexType = '';
      }
      var addressName = that.data.addressName2;
      var rentFee = that.data.rentFee2;
      var contact = new Object;
      contact.contactType = that.data.choseContactType2;
      contact.contactContent = that.data.contact2;
      var address = new Object;
      address.addressName = addressName;
      address.lat = that.data.latitude2;
      address.lng = that.data.longitude2;
      if (enterTime == '选择你的入住时间') {
        wx.showToast({
          title: '请选择入住时间',
          icon: 'none',
          duration: 2000
        })
      }
      else if (cityName == '选择求租城市') {
        wx.showToast({
          title: '请选择求租城市',
          icon: 'none',
          duration: 2000
        })
      }
      else if (cityArea == '选择求租区域') {
        wx.showToast({
          title: '请选择求租区域',
          icon: 'none',
          duration: 2000
        })
      }
      else if (addressName == '选择求租地点（点击开启地图）') {
        wx.showToast({
          title: '选择求租地点',
          icon: 'none',
          duration: 2000
        })
      }
      else if (!rentFee) {
        wx.showToast({
          title: '请输入租金',
          icon: 'none',
          duration: 2000
        })
      }
      else if (!contact.contactContent) {
        wx.showToast({
          title: '请输入联系方式',
          icon: 'none',
          duration: 2000
        })
      }
      else {
        getApp().globalData.publishType = that.data.publishTypeArr[that.data.publishTypeIndex];
        var publishHouse = getApp().globalData.publishHouse2;
        publishHouse.enterTime = enterTime;
        publishHouse.tenancyType = tenancyType;
        publishHouse.sexType = sexType;
        publishHouse.cityName = cityName;
        publishHouse.cityArea = cityArea;
        publishHouse.address = address;
        publishHouse.rentFee = rentFee;
        publishHouse.contact = contact;
        getApp().globalData.publishHouse2 = publishHouse;

        if(that.data.houseId!=''){
          wx.navigateTo({
            url: '../publishHouse2/publishHouse2?id='+that.data.houseId+'&type=2'
          });
        }else{
          wx.navigateTo({
            url: '../publishHouse2/publishHouse2?rentCityindex=' + that.data.cityIndex
          });
        }
      }
    }

  },



 



  
})