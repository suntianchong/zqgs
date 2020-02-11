// pages/renddetail/renddetail.js
/**
 * @author Jeff.Wang
 * @date 20180821
 * @desc 详情页面
 */
var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var app = getApp();
var common = require('../../utils/common.js');//定义公共处理函数
var util = require('../../utils/util.js');//定义公共处理函数
var that;//定义全局变量
var id;//定义全局变量用于分享
//定义当前缓存的对象
var user;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},//详情信息
    userInfo:{},//用户信息
    hasCollect: false,//是否已收藏
    collectId: "",//收藏id
    isAdmin: false,//是否为管理员 true 是 false 否
    houseId: '',
    pubText: '刚刚发布',
    sharedIn: false//是否由分享或扫码进入  true显示回到主页按钮
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;//全局变量赋值
    //加载框
    wx.showLoading({
      title: '职位详情加载中',
      mask: true
    })
    //传递参数objectid
    id = options.object;
    var shared = options.shared;
    if (shared != null && shared != undefined && shared != "") {
      that.setData({
        sharedIn: true
      })
    } else {
      that.setData({
        sharedIn: false
      })
    }
    var scene = decodeURIComponent(options.scene)
    if (scene != null && scene != undefined && scene != "undefined") {
      id = scene;
      that.setData({
        sharedIn: true
      })
    }
    //id = options.id||"cbc8f76cef";
    user = Bmob.User.current();//获取当前用户
    that.setData({
      houseId: id
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var houseQuery = Bmob.Query("rentHouse");
    houseQuery.order("createdAt");
    houseQuery.include("publisher");
    console.log(id)
    if (id != null && id != undefined && id != "") {
      //查询职位详情
      houseQuery.get(id).then(res => {
        wx.hideLoading();
        console.log(res)
        that.setData({
          detail: res,
          userInfo: res.publisher
        });
        //查询发布的状态点
        var now = new Date().getTime();
        var pubishT = Date.parse(new Date(res.createdAt.replace(/-/g, "/")));
        //计算出小时数
        var fromT = now - pubishT;//时间差
        var hours = Math.floor(fromT / (3600 * 1000))
        console.log("now is ", hours);
        if (hours >= 0 && hours <= 1) {
          that.setData({
            pubText: '刚刚发布'
          });
        } else if (hours > 1 && hours <= 24) {
          that.setData({
            pubText: '今日发布'
          });
        } else if (hours > 24 && hours <= 36) {
          that.setData({
            pubText: '1天前发布'
          });
        } else { 
          var pubArray = res.createdAt.split(" ");
          var tArrar = pubArray[0].split("-");
          that.setData({
            pubText: tArrar[1] + '月' + tArrar[2] + '日发布'
          });
        }
        //查询是否管理员 鉴权
        if (user && user.isAdmin && user.isAdmin == 1) {
          that.setData({
            isAdmin: true
          });
        } else {
          that.setData({
            isAdmin: false
          });
        }

        //查询是否已收藏
        if (user != null && user != undefined
          && user.objectId != null && user.objectId != undefined && user.objectId != "") {
          var houseCollectQuery = Bmob.Query("houseCollect");
          var house = Bmob.Pointer('rentHouse')
          var houseId = house.set(id);
          //根据houseId和userId确定唯一的收藏值   ---可以封装为函数 暂不封装 20180726
          houseCollectQuery.equalTo("userId", "==", user.objectId);
          houseCollectQuery.equalTo("rentDetail", "==", houseId);
          houseCollectQuery.equalTo("stateflag", "==", "0");  //---物理删除方式
          houseCollectQuery.find().then(res => {
            //已经收藏  取第一条收藏值   应当只有一条
            if (res.length > 0) {
              that.setData({
                hasCollect: true,
                collectId: res[0].objectId
              });
            } else {
              that.setData({
                hasCollect: false,
                collectId: ""
              });
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
        } 
      }).catch(err => {
        wx.hideLoading();
        console.log(err);
        //加载数据出错 提示
        wx.showToast({
          title: "加载数据出错，请检查网络",
          icon: 'none',
          mask: true,
          duration: 2000
        });
      });
    } else {
      wx.hideLoading();
      wx.showToast({
        title: "加载数据出错，请重新进入",
        icon: 'none',
        mask: true,
        duration: 2000
      });
      //延时调用
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        });
      }, 2000)
      return false;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const queryRH = Bmob.Query('rentHouse');
    queryRH.get(that.data.houseId).then(res => {
      var clickNumber = res.clickNumber;
      if (!clickNumber) {
        clickNumber = 1;
      }
      else {
        clickNumber++;
      }
      res.set('clickNumber', clickNumber)
      res.save()
    }).catch(err => {
      console.log(err)
    })
  },


  onShareAppMessage: function () { 
    var title = '【求租】' + that.data.detail.cityName + that.data.detail.cityArea +'的房间，有合适的房源求推荐'
    return {
      title: title,
      path: '/pages/renddetail/renddetail?object=' + that.data.houseId + "&shared=true",
      imageUrl: 'http://bmob-cdn-20509.b0.upaiyun.com/2018/08/22/0f8e89e840c4d900803f6925c823c270.png'
    }
  },
  /**
   * 收藏
   */
  collectHouse: function (e) {
    var hasCollect = that.data.hasCollect;
    var collectId = that.data.collectId;
    if (hasCollect && collectId != "") {
      //加载框
      wx.showLoading({
        title: '正在取消收藏',
      })
      var delCollect = Bmob.Query('houseCollect');
      delCollect.destroy(collectId).then(res => {
        wx.hideLoading();
        console.log(res)
        if (res.msg == "ok") {
          that.setData({
            hasCollect: false,
            collectId: ""
          });
          wx.showToast({
            title: "已取消收藏",
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: "取消收藏失败",
            icon: 'none',
            mask: true,
            duration: 2000
          });
        }
      }).catch(err => {
        wx.hideLoading();
        console.log(err)
        wx.showToast({
          title: "取消收藏失败",
          icon: 'none',
          mask: true,
          duration: 2000
        });
      })
    } else {
      //加载框
      wx.showLoading({
        title: '正在收藏',
      })
      if (id == null || id == undefined || id == "") {
        wx.showToast({
          title: "加载数据出错，请重新进入",
          icon: 'none',
          mask: true,
          duration: 2000
        });
        //延时调用
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 2000)
        return false;
      }
      var houseDetail = that.data.detail;//获取当前house详情
      var curUser = Bmob.User.current();//获取当前用户
      var saveCollect = Bmob.Query("houseCollect");
      var housePointer = Bmob.Pointer('rentHouse').set(houseDetail.objectId);//houseDetail的Pointer
      saveCollect.set("title", "这是求租收藏")
      saveCollect.set("userId", curUser.objectId)
      saveCollect.set("type", "1")
      saveCollect.set("rentDetail", housePointer)
      saveCollect.set("stateflag", '0')
      saveCollect.save().then(res => {
        wx.hideLoading();
        that.setData({
          hasCollect: true,
          collectId: res.objectId
        });
        wx.showToast({
          title: "已收藏",
          icon: 'success',
          duration: 2000
        });
      }).catch(err => {
        wx.hideLoading();
        console.log(err)
        wx.showToast({
          title: "收藏失败",
          icon: 'none',
          mask: true,
          duration: 2000
        });
      })
    }
  },
  /**
   * 发送简历 -复制邮箱
   */
  sendMail: function (e) {
    var contact = that.data.detail.contact;
    if (contact.contactType == "weChat"){
      wx.setClipboardData({
        data: contact.contactContent,
        success: function (res) {
          wx.hideToast();
          wx.showModal({
            title: '温馨提示',
            content: '已复制对方微信号，请自行添加好友联系',
            showCancel:false,
            confirmColor:"#3185FF",
            confirmText: "知道了"
          })
        },
        fail: function (err) {
          console.log(err);
          wx.showToast({
            title: "复制失败，请重新复制",
            icon: 'none',
            duration: 2000
          });
        }
      });
    } else if (contact.contactType == "teleNum"){
      wx.showModal({
        title: '温馨提示',
        content: '联系对方请礼貌用语，就说是在职前公社看到的~',
        showCancel: true,
        confirmColor: "#3185FF",
        confirmText: "确认呼叫",
        success: function(res){
          if (res.confirm){
            wx.makePhoneCall({
              phoneNumber: contact.contactContent,
              fail: function (err) {
                wx.showToast({
                  title: "电话拨打失败，请重新拨打",
                  icon: 'none',
                  duration: 2000
                });
              }
            })
          }
        }
      })
    }
  },
  //展示actionSheet
  showActionSheet: function (e) {
    var isAdmin = that.data.isAdmin;
    if (isAdmin) {
      var detail = that.data.detail;
      var topText = "置顶";
      var blockText = "拉黑";
      if (detail && detail.top == '1') {
        topText = "取消置顶";
      }
      wx.showLoading({
        title: '获取信息中',
      })
      var blockUser = Bmob.Query('_User');
      if (detail.publisher == null || detail.publisher == undefined) {
        wx.hideLoading();
        wx.showToast({
          title: "获取信息失败",
          icon: 'none',
          duration: 2000
        });
        return false;
      }
      blockUser.get(detail.publisher.objectId).then(pubUser => {
        wx.hideLoading();
        if (pubUser.isBlocked == '1') {
          blockText = "取消拉黑";
        }
        wx.showActionSheet({
          itemList: [topText, '删除', blockText],
          success: function (res) {
            console.log(res.tapIndex);
            if (res.tapIndex == 0) {//置顶或取消置顶
              if (detail && detail.top == '0') {
                var topHouse = Bmob.Query('rentHouse');
                topHouse.set('id', id) //需要修改的objectId
                topHouse.set('top', '1')
                wx.showLoading({
                  title: '正在置顶',
                })
                topHouse.save().then(res => {
                  console.log(res)
                  wx.hideLoading();
                  wx.showToast({
                    title: "已置顶",
                    icon: 'success',
                    duration: 2000
                  });
                  //更新本页面
                  detail.top = '1';
                  that.setData({
                    detail: detail
                  })
                }).catch(err => {
                  wx.hideLoading();
                  wx.showToast({
                    title: "置顶失败",
                    icon: 'none',
                    duration: 2000
                  });
                })
              } else {
                var topHouse = Bmob.Query('rentHouse');
                topHouse.set('id', id) //需要修改的objectId
                topHouse.set('top', '0')
                wx.showLoading({
                  title: '正在置顶',
                })
                topHouse.save().then(res => {
                  console.log(res)
                  wx.hideLoading();
                  wx.showToast({
                    title: "已取消置顶",
                    icon: 'success',
                    duration: 2000
                  });
                  //更新本页面
                  detail.top = '0';
                  that.setData({
                    detail: detail
                  })
                }).catch(err => {
                  console.log(err)
                  wx.hideLoading();
                  wx.showToast({
                    title: "取消置顶失败",
                    icon: 'none',
                    duration: 2000
                  });
                })
              }
            } else if (res.tapIndex == 1) {//删除
              wx.showModal({
                title: '提示',
                content: '该操作将删除该求租信息，点击确认删除',
                success: function (res) {
                  if (res.confirm) {
                    var delHouse = Bmob.Query('rentHouse');
                    delHouse.set('id', id) //需要修改的objectId
                    delHouse.set('del_flag', user.objectId)
                    wx.showLoading({
                      title: '正在删除',
                    })
                    delHouse.save().then(res => {
                      console.log(res)
                      wx.hideLoading();
                      getApp().globalData.refreshHouse=1;
                      wx.showToast({
                        title: "已删除",
                        icon: 'success',
                        duration: 2000
                      });
                      //退出本界面
                      //延时调用
                      setTimeout(function () {
                        wx.navigateBack({
                          delta: 1
                        });
                      }, 2000);
                    }).catch(err => {
                      console.log(err)
                      wx.hideLoading();
                      wx.showToast({
                        title: "取消删除",
                        icon: 'none',
                        duration: 2000
                      });
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              });
            } else if (res.tapIndex == 2) {//拉黑
              if (detail && detail.publisher && pubUser) {
                if (pubUser.isBlocked == '1') {
                  pubUser.set('isBlocked', 0)
                  wx.showLoading({
                    title: '正在取消拉黑',
                  })
                  pubUser.save().then(res => {
                    console.log(res)
                    wx.hideLoading();
                    wx.showToast({
                      title: "已取消拉黑",
                      icon: 'success',
                      duration: 2000
                    });
                    //更新本页面
                    detail.publisher.isBlocked = 0;
                    that.setData({
                      detail: detail
                    })
                  }).catch(err => {
                    console.log(err)
                    wx.showToast({
                      title: "取消拉黑失败",
                      icon: 'success',
                      duration: 2000
                    });
                  })
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '该操作将拉黑' + pubUser.nickName + "用户，点击确认拉黑",
                    success: function (res) {
                      if (res.confirm) {
                        pubUser.set('isBlocked', 1)
                        wx.showLoading({
                          title: '正在拉黑',
                        })
                        pubUser.save().then(res => {
                          console.log(res)
                          //更新本页面
                          detail.publisher.isBlocked = 1;
                          that.setData({
                            detail: detail
                          })
                          wx.hideLoading();
                          wx.showToast({
                            title: "已拉黑",
                            icon: 'success',
                            duration: 2000
                          });
                        }).catch(err => {
                          console.log(err)
                          wx.hideLoading();
                          wx.showToast({
                            title: "拉黑失败",
                            icon: 'success',
                            duration: 2000
                          });
                        })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }
              } else {
                wx.showToast({
                  title: "获取用户信息失败",
                  icon: 'none',
                  duration: 2000
                });
              }
            }
          },
          fail: function (res) {
            console.log(res.errMsg)
          }
        });
      }).catch(err => {
        wx.showToast({
          title: "获取信息失败",
          icon: 'success',
          duration: 2000
        });
      })
    }
  },
  getPoster: function () {
    wx.navigateTo({
      url: '../poster/poster?jobId=' + that.data.jobId
    })
  },
  //进入首页  用于分享和扫码进入
  goIndex: function () {
    wx.switchTab({
      url: '../house/house'
    })
  },
  //跳转到举报页面
  reportError: function (e) {
    var rentId = id;//房源id
    var userId = user.objectId;//举报人id
    console.log(that.data.detail)
    var tipUserId = that.data.detail.publisher.objectId;//被举报人id 发布人id
    wx.navigateTo({
      url: '../tipsOff/tipsOff?rentId=' + rentId + "&userId=" + userId + "&tipUserId=" + tipUserId + "&type=rent"
    })
  }
}) 