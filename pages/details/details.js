// pages/details/details.js
/**
 * @author Jeff.Wang
 * @date 20180726
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
    startWorkTimeFormat: "",//格式化后的开始时间
    hasCollect: false,//是否已收藏
    collectId: "",//收藏id
    isAdmin: false,//是否为管理员 true 是 false 否
    jobId:'',
    sharedIn:false//是否由分享或扫码进入  true显示回到主页按钮
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
    id = options.id;
    var shared = options.shared;
    if (shared != null && shared != undefined && shared != ""){
      that.setData({
        sharedIn: true
      })
    }else{
      that.setData({
        sharedIn: false
      })
    }
    var scene = decodeURIComponent(options.scene)
    if (scene !=null && scene != undefined && scene != "undefined") {
      id = scene;
      that.setData({
        sharedIn: true
      })
    }
    console.log('scene=' ,scene)
    console.log('id='+id)
    //id = options.id||"cbc8f76cef";
    user = Bmob.User.current();//获取当前用户
    that.setData({
      jobId: id
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var jobQuery = Bmob.Query("job");
    jobQuery.order("createdAt");
    console.log(id)
    if (id != null && id != undefined && id != "") {
      //查询职位详情
      jobQuery.get(id).then(res => {
        wx.hideLoading();
        console.log(res)
        that.setData({ 
          detail: res,
        });
        //查询是否管理员 鉴权
        if(user && user.isAdmin && user.isAdmin == 1){
          that.setData({
            isAdmin: true
          });
        }else{
          that.setData({
            isAdmin: false
          });
        }

        //查询是否已收藏
        if (user != null && user != undefined
          && user.objectId != null && user.objectId != undefined && user.objectId != "") {
          var jobCollectQuery = Bmob.Query("jobCollect");
          var job = Bmob.Pointer('job')
          var jobId = job.set(id);
          //根据jobId和userId确定唯一的收藏值   ---可以封装为函数 暂不封装 20180726
          jobCollectQuery.equalTo("userId", "==", user.objectId);
          jobCollectQuery.equalTo("jobDetail", "==", jobId);
          jobCollectQuery.equalTo("stateflag","==","0");  //---物理删除方式
          jobCollectQuery.find().then(res => {
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
      setTimeout(function(){
        wx.navigateBack({
          delta: 1
        });
      },2000)
      return false;
    }
  },

  onShow:function(){
    const queryJob = Bmob.Query('job');
    queryJob.get(that.data.jobId).then(res => {
      var clickNumber = res.clickNumber;
      if (!clickNumber){
        clickNumber=1;
      }
      else{
        clickNumber++;
      }
      res.set('clickNumber', clickNumber)
      res.save()
    }).catch(err => {
      console.log(err)
    })
  },


  
  onShareAppMessage: function () {
    var componyName = that.data.detail.companyName;
    var showText = "公司业务方直招，点击了解详情";
    if (componyName != null && componyName != undefined && componyName != ""){
      showText = "急招 ！"+componyName + showText;
    }
    return {
      title: showText, 
      path: '/pages/details/details?id='+id+"&shared=true"
    }
  },
  /**
   * 收藏
   */
  collectJob: function (e) {
    var hasCollect = that.data.hasCollect;
    var collectId = that.data.collectId;
    if (hasCollect && collectId != "") {
      //加载框
      wx.showLoading({
        title: '正在取消收藏',
      })
      var delCollect = Bmob.Query('jobCollect');
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
      var jobDetail = that.data.detail;//获取当前job详情
      var curUser = Bmob.User.current();//获取当前用户
      var saveCollect = Bmob.Query("jobCollect");
      var jobPointer = Bmob.Pointer('job').set(jobDetail.objectId);//jobDetail的Pointer
      saveCollect.set("workTime", jobDetail.workTime)
      saveCollect.set("userId", curUser.objectId)
      saveCollect.set("jobName", jobDetail.jobName)
      saveCollect.set("jobDetail", jobPointer)
      saveCollect.set("stateflag", '0')
      //可能存在该字段为空的情况
      if (jobDetail.companyName != null && jobDetail.companyName != undefined && jobDetail.companyName != ""){
        saveCollect.set("companyName", jobDetail.companyName)
      }
      
      //可能存在该字段为空的情况
      if (jobDetail.companyLogo != null && jobDetail.companyLogo != undefined && jobDetail.companyLogo != ""){
        saveCollect.set("companyLogo", jobDetail.companyLogo)
      }
      if (jobDetail.city != null && jobDetail.city != undefined && jobDetail.city != "") {
        saveCollect.set("city", jobDetail.city)
      }
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
    wx.setClipboardData({
      data: that.data.detail.emailAddress,
      success: function (res) {
        wx.showToast({
          title: "投递邮箱已复制",
          icon: 'success',
          duration: 2000
        });
      },
      fail: function (err) {
        console.log(err);
        wx.showToast({
          title: "邮箱复制失败，请重新复制",
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  //展示actionSheet
  showActionSheet: function(e){
    var isAdmin = that.data.isAdmin;
    if (isAdmin) {
      var detail = that.data.detail;
      var high_quality = "标优"; 
      var topText = "置顶"; 
      var blockText = "拉黑";
      if (detail && detail.top == '1') {
        topText = "取消置顶";
      }
      if (detail &&detail.high_quality=='1'){
        high_quality = "取消标优"; 
      }
      wx.showLoading({
        title: '获取信息中',
      })
      var blockUser = Bmob.Query('_User');
      blockUser.get(detail.publisher.objectId).then(pubUser => {
        wx.hideLoading();
        if (pubUser.isBlocked == '1') {
          blockText = "取消拉黑";
        }
        wx.showActionSheet({
          itemList: [high_quality,topText, '删除', blockText],
          success: function (res) {
            console.log(res.tapIndex);

            if(res.tapIndex == 0){ //标优
              if (detail && detail.high_quality != '1') {
                var topJob = Bmob.Query('job');
                topJob.set('id', id) //需要修改的objectId
                topJob.set('high_quality', '1')
                wx.showLoading({
                  title: '正在标优',
                })
                topJob.save().then(res => {
                  console.log(res)
                  wx.hideLoading();
                  getApp().globalData.refreshWork = 1;
                  wx.showToast({
                    title: "已标优",
                    icon: 'success',
                    duration: 2000
                  });
                  //更新本页面
                  detail.high_quality = '1';
                  that.setData({
                    detail: detail
                  })
                }).catch(err => {
                  wx.hideLoading();
                  wx.showToast({
                    title: "标优失败",
                    icon: 'none',
                    duration: 2000
                  });
                })
              } else {
                var topJob = Bmob.Query('job');
                topJob.set('id', id) //需要修改的objectId
                topJob.set('high_quality', '0')
                wx.showLoading({
                  title: '正在取消标优',
                })
                topJob.save().then(res => {
                  console.log(res)
                  wx.hideLoading();
                  getApp().globalData.refreshWork = 1;
                  wx.showToast({
                    title: "已取消标优",
                    icon: 'success',
                    duration: 2000
                  });
                  //更新本页面
                  detail.high_quality = '0';
                  that.setData({
                    detail: detail
                  })
                }).catch(err => {
                  console.log(err)
                  wx.hideLoading();
                  wx.showToast({
                    title: "取消标优失败",
                    icon: 'none',
                    duration: 2000
                  });
                })
              }
            }
            else if (res.tapIndex == 1) {//置顶或取消置顶
              if (detail && detail.top == '0') {
                var topJob = Bmob.Query('job');
                topJob.set('id', id) //需要修改的objectId
                topJob.set('top', '1')
                wx.showLoading({
                  title: '正在置顶',
                })
                topJob.save().then(res => {
                  console.log(res)
                  wx.hideLoading();
                  getApp().globalData.refreshWork = 1;
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
                var topJob = Bmob.Query('job');
                topJob.set('id', id) //需要修改的objectId
                topJob.set('top', '0')
                wx.showLoading({
                  title: '正在置顶',
                })
                topJob.save().then(res => {
                  console.log(res)
                  wx.hideLoading();
                  getApp().globalData.refreshWork = 1;
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
            } else if (res.tapIndex == 2) {//删除
              wx.showModal({
                title: '提示',
                content: '该操作将删除该职位，点击确认删除',
                success: function (res) {
                  if (res.confirm) {
                    var delJob = Bmob.Query('job');
                    delJob.set('id', id) //需要修改的objectId
                    delJob.set('del_flag', user.objectId)
                    wx.showLoading({
                      title: '正在删除',
                    })
                    delJob.save().then(res => {
                      console.log(res)
                      getApp().globalData.refreshWork = 1;
                      wx.hideLoading();
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
            } else if (res.tapIndex == 3) {//拉黑
              if (detail && detail.publisher && pubUser) {
                if (pubUser.isBlocked == '1') {
                  pubUser.set('isBlocked', 0)
                  wx.showLoading({
                    title: '正在取消拉黑',
                  })
                  pubUser.save().then(res => {
                    console.log(res)
                    //刷新缓存
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

  getPoster:function(){
    wx.navigateTo({
      url: '../poster/poster?jobId=' + that.data.jobId 
    })
  },
  //进入首页  用于分享和扫码进入
  goIndex: function(){
    wx.switchTab({
      url: '../work/work'
    })
  }
})