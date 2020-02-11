var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var app = getApp()
var that;
Page({

  data: {
    sexType: ['男生', '女生'],
    sexIndex: 0,

    ageType: ['90后', '95后', '00后', '95前'],
    ageIndex: 0,

    university:'',
    company:'',
    position:'',

    contact: '',
    choseContactType: 'weChat',

    source:'',

    cityIndex:0
  },


  onLoad: function (options) {
    that = this;
    console.log(options)
    var source = options.source;
    var userInfo = options.userInfo;
    var cityIndex = options.cityIndex;
    that.setData({
      source: source,
    })
    if (source == 'main' && userInfo=='true'){
      let current = Bmob.User.current();
      var currentUserId = current.objectId;
      const queryUser = Bmob.Query('_User');
      queryUser.get(currentUserId).then(res => {
        var sexIndex;
        // var ageIndex;
        var sex = res.sex;
        // var age = res.age;
        var university = res.university;
        var company = res.company;
        var position = res.position;
        var choseContactType = res.contact.contactType;
        var contact = res.contact.contactContent;
        if (sex =='男生'){
          sexIndex=0;
        }
        else if (sex == '女生') {
          sexIndex = 1;
        }

        // if (age == '90后') {
        //   ageIndex = 0;
        // }
        // else if (age == '95后') {
        //   ageIndex = 1;
        // }
        // else if (age == '00后') {
        //   ageIndex = 2;
        // }
        // else if (age == '95前') {
        //   ageIndex = 3;
        // }

        that.setData({
          sexIndex: sexIndex,
          // ageIndex: ageIndex,

          university: university,
          position: position,
          company: company,
          choseContactType: choseContactType,
          contact: contact,
          source: source,
        })


      }).catch(err => {
        console.log(err)
      })
    }

    else if (source == 'pubHous'){
      that.setData({
        cityIndex: cityIndex,
        source: source,
      })
    }
  },

  choseSexType: function (e) {
    var index = e.currentTarget.dataset.index;
    that.setData({
      sexIndex: index
    })
  },

  // choseAgeType: function (e) {
  //   var index = e.currentTarget.dataset.index;
  //   that.setData({
  //     ageIndex: index
  //   })
  // },

  inputUniversity: function (e) {
    that.setData({
      university: e.detail.value,
    })
  },


  inputCompany: function (e) {

    that.setData({
      company: e.detail.value,
    })
  },

  inputPosition: function (e) {

    that.setData({
      position: e.detail.value,
    })
  },





  choseContactType: function (e) {
    var index = e.currentTarget.dataset.index;
    that.setData({
      choseContactType: index
    })
  },



  contact: function (e) {
    that.setData({
      contact: e.detail.value,
    })
  },




  nextStep: function () {
    let current = Bmob.User.current();
    var currentUserId = current.objectId;

    var sex = that.data.sexType[that.data.sexIndex];
    // var age = that.data.ageType[that.data.ageIndex];
    var university = that.data.university;
    var company = that.data.company;
    var position = that.data.position;


    var contactType = that.data.choseContactType;
    var contactContent = that.data.contact;
    if (!university){
      wx.showToast({
        title: '请输入您的学校',
        icon: 'none',
        duration: 2000
      })
    }
    else if (!contactContent) {
      wx.showToast({
        title: '请输入您的联系方式',
        icon: 'none',
        duration: 2000
      })
    }
    else{
      var contact = new Object;
      contact.contactType = contactType;
      contact.contactContent = contactContent;

      console.log(contact)


      const queryUser = Bmob.Query('_User');
      queryUser.get(currentUserId).then(res => {
        res.set('sex', sex);
        // res.set('age', age);
        res.set('university', university);
        res.set('company', company);
        res.set('position', position);
        res.set('contact', contact);
        res.set('userInfo', true);
        res.save()
        console.log('source' + that.data.source)
        if (that.data.source == 'pubHous') {
          app.globalData.refreshUserInfo = 1;
          wx.redirectTo({
            url: '../publishHouse1/publishHouse1?cityIndex=' + that.data.cityIndex
          })
        }

        else if (that.data.source == 'pubZhiYan') {
          app.globalData.refreshUserInfo = 1;
          wx.redirectTo({
            url: '../publishZhiYan/publishZhiYan?'
          })
        }

      
        else if (that.data.source == 'main') {
          app.globalData.refreshUserInfo = 1;
          wx.navigateBack({
            delta: 1
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

 






})