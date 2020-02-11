var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var util = require('../../utils/util.js')
var that;//定义全局变量
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: 'https://bmob-cdn-21786.bmobcloud.com/2019/03/03/e3c47220409b1b8b8099a4f926c00c68.png',
    btnBg: '#ee8325',
    txt: '',
    assist_AId:0,//被助力者的objectid 
    openId:0,//被助力者的openid
    hasAssisted:false,
    hadNavigationLength: 0,//进度条长度
    assistNum: 0,//助力人数

  msgList: [{pic: "https://wx.qlogo.cn/mmopen/vi_32/oV48aPCUCib6sWJfMXicSS44aEYIuicmlKRwyIwCrHlPZEaTfBYHMPsqiakPNiaMGSziaPckLYkuZRCLaIpNhbzOx5VQ/132", nickName: "乌鸦坐飞机", gift: 'BAT内推资格'},
    { pic: "https://wx.qlogo.cn/mmopen/vi_32/489mc9HUHgPibnoS9rRZWtdb8v4MzEptFK123eicyibYGycB5LloGgpRCgt7glThibQ77AJZiaOn5bmjHBIRCZwVTgA/132", nickName: "Magician", gift: '一对一指导简历'},
 { pic: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKRUQia9hBOIFQKRb10LeqAibYZeouqpvRsNib4oFeFMeI5mlyWqhTggcib4v0yfj3BvjErVhj0BVdpSA/132", nickName: "廖雅君", gift: 'VIP全年追踪式资料包'}]
  },


  
  help(){
    wx.showLoading({
      title: '助力中...',
    })

    console.log('openId' + that.data.openId)

    let id = getApp().globalData.userId;
    let assist_AId = this.data.assist_AId;
    var nowTime = util.getNowTime();
    var nextTime = util.getNextTime();

    const queryAssist = Bmob.Query("assist");
    queryAssist.equalTo("assist_B", "==", id);
    queryAssist.equalTo("createdAt", ">", nowTime);
    queryAssist.equalTo("createdAt", "<", nextTime);
    queryAssist.find().then(res => {
      if(res.length>=3){
        wx.hideLoading()
        wx.showModal({
          title: '助力次数达到上限',
          showCancel: 'false',
          content: '每日最多可为3位好友助力，今日已达到上限，明天再试试吧~',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      else{
        if (assist_AId == 0) {
          wx.showToast({
            title: '不是从分享卡片进入的',
            icon: 'none'
          })
          return;
        }
        const query = Bmob.Query('assist');
        query.set("assist_A", assist_AId)
        query.set("assist_B", id)
        query.save().then(res => {
          console.log(res)
          wx.hideLoading()
          wx.showToast({
            title: '助力成功'
          });
          that.setData({
            hasAssisted: true,
            assistNum: that.data.assistNum + 1,
            img: 'https://bmob-cdn-21786.bmobcloud.com/2019/03/04/566d101140251249806427305f33bd14.png',
          })
          that.computeNavigationLebgth();
          if (that.checkNum()) {
            //助力达到要求可以发送formid
            console.log('达到了')
            that.sendFormid()
          }
        }).catch(err => {
          wx.hideLoading()
          wx.showToast({
            title: '网络不稳定',
            icon: 'none'
          });
        })
      }
    });
    
  },


  finishAssist:function(){
    wx.showToast({
      title: '已经助力过啦',
      icon: 'none'
    });
  },


  //检测是否到达发送formid 的条件
  checkNum(){
    let assistNum = that.data.assistNum;
    console.log(assistNum)
    if(assistNum == 5 || assistNum == 20 || assistNum == 50){
      return true;
    }else{
      return false;
    }
  },
  sendFormid(){
    //先取出被助力者的formid，
    let firstFormData //声明第一条formID数据，后面删除的时候要用
    const query = Bmob.Query("formid");
    query.equalTo("openid", "==", that.data.openId);
    console.log(that.data.openId,'openid')
    query.order("-createdAt")
    query.find().then(res => {
      console.log(res,'res')
      firstFormData = res[0];
      var packageName;
      var assistNum = that.data.assistNum
      if(assistNum==5){
        packageName='初级求职礼包'
      }
      else if (assistNum == 20) {
        packageName = '中级求职礼包'
      }
      else if (assistNum == 50) {
        packageName = '高级求职礼包'
      }
      let modelData = {
        "touser": that.data.openId,
        "template_id": "x3VaC0QEPyy8gTHNHOe0yWYbyvAryTDDPxX7KZFYyGw",
        "page": "/pages/assist_A/assist_A",
        "form_id": firstFormData.formid,
        "data": {
          "keyword1": {
            "value": '你人缘真不错哎，达到'+assistNum+'人给你助力，快去领礼包吧~',
          },
          "keyword2": {
            "value": packageName
          }
        },
        "emphasis_keyword": ""
      }

      Bmob.sendWeAppMessage(modelData).then(function (response) {
        console.log(response);
        //发送成功后需要删除此条formid数据，
        const queryDel = Bmob.Query("formid");
        queryDel.destroy(firstFormData.objectId).then(res => {
          console.log('删除此条formid成功')
        }).catch(err => {
          console.log(err)
        })
      }).catch(function (error) {
        console.log(error);
      });
    });
    
  },


  seeDetail: function () {
    wx.navigateTo({
      url: '../rulesPage/rulesPage'
    })
  },
  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var interval = setInterval(function () {
      var userId = getApp().globalData.userId;
      if (userId) {
        clearInterval(interval);
        if (options.id){
          var assist_AId = options.id;
          var openId = options.openId;

          that.setData({
            assist_AId: options.id,
            openId: options.openId,
          })

          if (assist_AId == userId) {
            wx.hideLoading();
            wx.redirectTo({
              url: '/pages/assist_A/assist_A'
            });
            return;
          }
          else {
            const query = Bmob.Query("assist");
            query.equalTo("assist_A", "==", assist_AId);
            query.equalTo("assist_B", "==", getApp().globalData.userId);
            query.count().then(res => {
              if (res <= 0) {
                that.setData({
                  hasAssisted: false,
                })
                wx.hideLoading();
                that.refresh();
              }
              else {
                wx.hideLoading();
                that.setData({
                  hasAssisted: true,
                  img: 'https://bmob-cdn-21786.bmobcloud.com/2019/03/04/566d101140251249806427305f33bd14.png',
                })
                that.refresh();
              }
            });
          }
        }

        else{
          var scene = decodeURIComponent(options.scene)
          if (scene != null && scene != undefined && scene != "undefined") {
            assist_AId = scene;



            if (assist_AId == userId) {
              wx.hideLoading();
              wx.redirectTo({
                url: '/pages/assist_A/assist_A'
              });
              return;
            }
            else{
              const queryUser = Bmob.Query('_User');
              queryUser.get(assist_AId).then(res => {
                openId = res.authData.weapp.openid;
                that.setData({
                  assist_AId: assist_AId,
                  openId: openId,
                })

                if (assist_AId == userId) {
                  wx.hideLoading();

                  wx.redirectTo({
                    url: '/pages/assist_A/assist_A'
                  });
                  return;
                }
                else {
                  const query = Bmob.Query("assist");
                  query.equalTo("assist_A", "==", assist_AId);
                  query.equalTo("assist_B", "==", getApp().globalData.userId);
                  query.count().then(res => {
                    if (res <= 0) {
                      that.setData({
                        hasAssisted: false,
                      })
                      wx.hideLoading();
                      that.refresh();
                    }
                    else {
                      wx.hideLoading();
                      that.setData({
                        hasAssisted: true,
                        img: 'https://bmob-cdn-21786.bmobcloud.com/2019/03/04/566d101140251249806427305f33bd14.png',
                      })
                      that.refresh();
                    }
                  });
                }



              }).catch(err => {
                console.log(err)
              })
            }

          }
        }

      
      }
    }, 500);
    

  },


  joinToo:function(){
    wx.navigateTo({
      url: '../rulesPage/rulesPage',
    })
  },


  refresh() {
    var nextPackage;
    var lackNum;
    const query = Bmob.Query("assist");
    query.equalTo("assist_A", "==", that.data.assist_AId);
    query.count().then(res => {
  
      for (let i = 0; i <= res; i++) {


        setTimeout(() => {
          console.log(res, '数据');
          that.setData({
            assistNum: i++,
          })
          that.computeNavigationLebgth();
        }, 40 * i)

      }
    })
  },

  computeNavigationLebgth() {
    var assistNum = that.data.assistNum;
    var hadNavigationLength = that.data.assistNum;
    if (assistNum <= 20) {//如果少于20人助力
      hadNavigationLength = 17.5 * assistNum;//每个人的进度条增长17.5像素
    }
    else if (assistNum >= 50) {
      hadNavigationLength = 11.66 * (50 - 20) + 350;//则增长11.66像素
    }
    else {//超过20人
      hadNavigationLength = 11.66 * (assistNum - 20) + 350;//则增长11.66像素
    }
    that.setData({
      hadNavigationLength: hadNavigationLength
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */


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

  }
})