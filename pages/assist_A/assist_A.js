var Bmob = require('../../dist/Bmob-1.6.1.min.js');
// pages/assist_A/assist_A.js
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hadNavigationLength: 0,//进度条长度
    assistNum: 0,//助力人数
    giftOne:false,
    giftTwo:false,
    giftThree:false,
    nextPackage:'',
    openPackage1:false,
    openPackage2: false,
    openPackage3: false,
    inputMail:'',
    disabledInputMail:false,
    inputMailTip:'',
  },


  onLoad: function (options) {
    that = this;
    //查询有多少条助力数据
    var nextPackage;
    var lackNum;
    const query = Bmob.Query("assist");
    
    var interval = setInterval(function () {
      var userId = getApp().globalData.userId;
      if (userId) {
        clearInterval(interval);
        query.equalTo("assist_A", "==", getApp().globalData.userId);
        query.count().then(res => {
          console.log('assist_ANum' + res)
          if (res < 5) {
            nextPackage = '初级礼包'
            lackNum = 5 - res;
          }
          else if (res>=5 && res< 20){
            nextPackage='中级礼包'
            lackNum = 20 - res;
          }
          else if (res >= 20 && res < 50){
            nextPackage = '高级礼包'
            lackNum = 50 - res;
          }

          that.setData({
            assistNum: res,
            lackNum: lackNum,
            nextPackage: nextPackage
          })
          that.computeNavigationLebgth();
        });
        that.giftResult();
      }
    }, 500);

  },


  seeDetail:function(){
    wx.navigateTo({
      url: '../rulesPage/rulesPage'
    })
  },

  copyWeChat:function(e){
    var type = e.currentTarget.dataset.type;
    var keyWord;
    if(type==2){
      keyWord='实习信息'
    }
    else if (type == 3) {
      keyWord = '简历密室'
    }
    const querySetting = Bmob.Query('setting');
    querySetting.get('Rpcq000F').then(result => {
      wx.setClipboardData({
        data: result.addWeChat,
        success(res) {
          wx.getClipboardData({
            success(res) {
              wx.showModal({
                title: '复制成功',
                showCancel:'false',
                content: '已复制小助手微信号，将此页面截图，添加小助手微信并发送给她，同时回复关键字“' + keyWord + '”，就可以领取大礼包啦~',
                success(res) {
                  if (res.confirm) {
                    that.setData({
                      openPackage1: false,
                      openPackage2: false,
                      openPackage3: false,
                    });
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        }
      })
    }).catch(err => {
      console.log(err)
    })
  },

  inputMail:function(e){
    that.setData({
      inputMail: e.detail.value
    })
  },

  createPoster:function(){
    wx.navigateTo({
      url: '../assist_poster/assist_poster'
    })
  },

  inputMailSure:function(){
    var disabledInputMail = that.data.disabledInputMail;
    if (disabledInputMail==true){
      wx.showToast({
        title: '不可重复领取',
        icon: 'none',
        duration: 2000
      })
    }
    else{
      var inputMail = that.data.inputMail;
      if (!inputMail) {
        wx.showToast({
          title: '请填写邮箱',
          icon: 'none',
          duration: 2000
        })
      }
      else {
        wx.showLoading({
          title: '传输中...',
          mask: true
        })
        const queryAR = Bmob.Query('assist_result');
        queryAR.equalTo("user", "==", getApp().globalData.userId);
        queryAR.find().then(res => {
          queryAR.get(res[0].objectId).then(resAR => {
            resAR.set('email_address', inputMail)

            wx.request({
              url: 'https://www.accright.com/mail/send',
              data: {
                mailAddress: inputMail
              },
              dataType: '其他',
              success: function (res) {
                wx.hideLoading()
                console.log(res.data)
                var redData = JSON.parse(res.data)
                console.log(redData.status)
                if (redData.status==200){
                  console.log('111')
                  resAR.set('open_package1', true)
                  resAR.save()
                  wx.showModal({
                    title: '发送成功',
                    showCancel: false,
                    content: '我们将会向您的邮箱内发送求职资料包，请注意查收~若未收到，请确认是否被归为垃圾邮件',
                    success(res) {
                      if (res.confirm) {

                        that.setData({
                          inputMailTip: '已经领取，不可重复领取',
                          disabledInputMail: true,
                          openPackage1: false,
                          openPackage2: false,
                          openPackage3: false,
                          giftOne: true,
                          inputMail: '',
                        });

                       
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }
                else{
                  console.log('222')
                  wx.showModal({
                    title: '发送失败',
                    showCancel: false,
                    content: '请确认邮箱格式是否正确，或联系小助手微信lx199722，并回复“资源包”手动领取，点击确定将自动复制小助手微信号',
                    success(res) {
                      if (res.confirm) {
                        wx.setClipboardData({
                          data: 'lx199722',
                          success(res) {
                            wx.getClipboardData({
                              success(res) {
                                wx.showToast({
                                  icon:'none',
                                  title: '复制成功，快去加微信吧~',
                                })
                              }
                            })
                          }
                        })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }
              },
              complete: function () {

              }
            })
          }).catch(err => {
            wx.hideLoading()
            wx.showModal({
              title: '发送失败',
              showCancel: false,
              content: '请确认邮箱格式是否正确，或联系小助手微信lx199722，并回复“资源包”手动领取，点击确定将自动复制小助手微信号',
              success(res) {
                if (res.confirm) {
                  wx.setClipboardData({
                    data: 'lx199722',
                    success(res) {
                      wx.getClipboardData({
                        success(res) {
                          wx.showToast({
                            title: '复制成功，快去加微信吧~',
                            icon:'none'
                          })
                        }
                      })
                    }
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            console.log(err)
          })

        });
      }
    }
    
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
  //刷新进度
  refresh(){
    var nextPackage;
    var lackNum;
    const query = Bmob.Query("assist");
    query.equalTo("assist_A", "==", getApp().globalData.userId);
    query.count().then(res => {
      if (res < 5) {
        nextPackage = '初级礼包'
        lackNum = 5 - res;
      }
      else if (res >= 5 && res < 20) {
        nextPackage = '中级礼包'
        lackNum = 20 - res;
      }
      else if (res >= 20 && res < 50) {
        nextPackage = '高级礼包'
        lackNum = 50 - res;
      }
      for(let i=0;i<=res;i++){

      that.setData({
        lackNum: lackNum,
        nextPackage: nextPackage
      })

      setTimeout(() => {
        console.log(res, '数据');
        that.setData({
          assistNum: i++,
        })
        that.computeNavigationLebgth();
      },40*i)
       
      }
    })
  },
  //点击邀请好友
  getFormid(e){
    let formId = e.detail.formId;
    let openId = getApp().globalData.openId;
    console.log(formId)
    if(formId.startsWith('the')){
      //如果是开发工具不会生成formid，直接return；
      return;
    }
    const query = Bmob.Query('formid');
    query.set("openid", openId)
    query.set("formid", formId)
    query.save().then(res => {
      
    }).catch(err => {
      wx.showToast({
        title: '网络不稳定',
      })
    })
  },
  //领取礼包

  //礼包领取情况
  giftResult(){
    //获取礼包领取情况
    const query = Bmob.Query("assist_result");
    query.equalTo("user", "==", getApp().globalData.userId);
    query.find().then(res => {
      if(res.length != 0){
        //有领礼包记录
        that.setData({
          giftOne: res[0].open_package1 || false,
          giftTwo: res[0].open_package2 || false,
          giftThree: res[0].open_package3 || false,
        });
      }
    });
  },

  closePackage:function(){
    that.setData({
      openPackage1: false,
      openPackage2: false,
      openPackage3: false,
    });
  },

  openPackage:function(e){
    var type = e.currentTarget.dataset.type;
    var hadget = e.currentTarget.dataset.hadget;
    console.log(hadget)
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    if(type==1){
      if (hadget=='true'){
        that.setData({
          inputMailTip: '已经领取，不可重复领取',
          disabledInputMail: true,
          openPackage1: true,
          openPackage2: false,
          openPackage3: false,
          giftOne: true,
        });
      }
      else{
        that.setData({
          inputMailTip: '请输入您的邮箱',
          disabledInputMail: false,
          openPackage1: true,
          openPackage2: false,
          openPackage3: false,
        });
      }

      const queryAR = Bmob.Query('assist_result');
      queryAR.equalTo("user", "==", getApp().globalData.userId);
      queryAR.find().then(res => {
        if(res.length==0){
          const pointer = Bmob.Pointer('_User')
          const poiID = pointer.set(getApp().globalData.userId) 
          queryAR.set("user", poiID)
          queryAR.set("get_assist_num", that.data.assistNum)
          queryAR.save().then(res => {
            console.log(res)
          }).catch(err => {
            console.log(err)
          })
        }
        else{
          queryAR.get(res[0].objectId).then(res2 => {
            res2.set("get_assist_num", that.data.assistNum)
            res2.save()
          }).catch(err => {
            console.log(err)
          })
        }
      });
    }
    else if (type == 2) {
      that.setData({
        openPackage1: false,
        openPackage2: true,
        openPackage3: false,
        giftTwo: true,
      });
      const queryAR = Bmob.Query('assist_result');
      queryAR.equalTo("user", "==", getApp().globalData.userId);
      queryAR.find().then(res => {
        if (res.length == 0) {
          const pointer = Bmob.Pointer('_User')
          const poiID = pointer.set(getApp().globalData.userId)
          queryAR.set("user", poiID)
          queryAR.set("open_package2", true)
          queryAR.set("get_assist_num", that.data.assistNum)
          queryAR.save().then(res => {
            console.log(res)
          }).catch(err => {
            console.log(err)
          })
        }
        else {
          queryAR.get(res[0].objectId).then(res2 => {
            res2.set('open_package2', true)
            res2.set("get_assist_num", that.data.assistNum)
            res2.save()
          }).catch(err => {
            console.log(err)
          })
        }
      });
    }

    else if (type == 3) {
      that.setData({
        openPackage1: false,
        openPackage2: false,
        openPackage3: true,
        giftThree: true,
      });
      const queryAR = Bmob.Query('assist_result');
      queryAR.equalTo("user", "==", getApp().globalData.userId);
      queryAR.find().then(res => {
        if (res.length == 0) {
          const pointer = Bmob.Pointer('_User')
          const poiID = pointer.set(getApp().globalData.userId)
          queryAR.set("user", poiID)
          queryAR.set("open_package3", true)
          queryAR.set("get_assist_num", that.data.assistNum)
          queryAR.save().then(res => {
            console.log(res)
          }).catch(err => {
            console.log(err)
          })
        }
        else {
          queryAR.get(res[0].objectId).then(res2 => {
            res2.set('open_package3', true)
            res2.set("get_assist_num", that.data.assistNum)
            res2.save()
          }).catch(err => {
            console.log(err)
          })
        }
      });
    }

  
  },
  
  
  onShareAppMessage: function () {
    let id = getApp().globalData.userId;
    let openId = getApp().globalData.openId;
    return{
      title: '职前公社大礼包太难抢啦',
      path: `/pages/assist_B/assist_B?id=${id}&openId=${openId}`,
      imageUrl:'https://bmob-cdn-21786.bmobcloud.com/2019/03/04/20aadb1b40f931f0805db796e483a4b5.png'
    }
   


  }
})