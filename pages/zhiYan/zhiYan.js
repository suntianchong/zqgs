var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var app = getApp()
var that;
var size = 10
Page({


  data: {
    contentList: [],
    pageIndex: 0,
    has_more: true,
    searchText: '',
    currentUserId: '',
    openId:0,
  },


  onLoad: function (options) {
    that = this;
    let current = Bmob.User.current();
    var currentUserId = current.objectId;
    that.setData({
      currentUserId: currentUserId,
    })
    that.search();
  },


  onShow: function () {
    var refreshZY = getApp().globalData.refreshZY;
    var searchText = getApp().globalData.zhiYanSearchText;
    if (refreshZY == 1 && !searchText) {
      that.setData({
        contentList: [],
        pageIndex: 0,
        has_more: true,
        searchText: '',
      })
      that.search();
      getApp().globalData.refreshZY = 0;
    }

    else if (refreshZY == 1 && searchText) {
      that.setData({
        contentList: [],
        pageIndex: 0,
        has_more: true,
        searchText: searchText,
      })
      getApp().globalData.refreshZY = 0;
      console.log('searchText' + searchText)
      that.search();

    }

    var likeZYIndex = getApp().globalData.likeZYIndex;
    var unLikeZYIndex = getApp().globalData.unLikeZYIndex;
    var commentZYIndex = getApp().globalData.commentZYIndex;

    if (likeZYIndex) {
      var contentList = that.data.contentList;
      contentList[likeZYIndex].hadLike = true;
      contentList[likeZYIndex].likeNum++;
      that.setData({
        contentList: contentList,
      })
      getApp().globalData.likeZYIndex = '';
    }

    if (unLikeZYIndex) {
      var contentList = that.data.contentList;
      contentList[likeZYIndex].hadLike = false;
      contentList[likeZYIndex].likeNum--;
      that.setData({
        contentList: contentList,
      })
      getApp().globalData.unLikeZYIndex = '';
    }

    if (commentZYIndex) {
      var contentList = that.data.contentList;
      contentList[likeZYIndex].commentNum++;
      that.setData({
        contentList: contentList,
      })
      getApp().globalData.commentZYIndex = '';
    }


  },
  getFormid(e) {
    let formId = e.detail.formId;
    let openId = getApp().globalData.openId;
    console.log(formId)
    if (formId.startsWith('the')) {
      //如果是开发工具不会生成formid，直接return；
      return;
    }
    const query = Bmob.Query('formid');
    query.set("openid", openId)
    query.set("formid", formId)
    query.save().then(res => {
      console.log(res.formid)
    }).catch(err => {
      wx.showToast({
        title: '网络不稳定',
      })
    })
  },

  //检测点赞数是否达到要求
  checkNum(likeNum) {
    console.log(likeNum)
    if (likeNum == 5 || likeNum == 20 || likeNum == 50) {
      return true;
    } else {
      return false;
    }
  },
  sendFormid() {
    //先取出被助力者的formid，
    let firstFormData //声明第一条formID数据，后面删除的时候要用
    const query = Bmob.Query("formid");
    query.equalTo("openid", "==", that.data.openId);
    console.log(that.data.openId, 'openid')
    query.order("-createdAt")
    query.find().then(res => {
      console.log(res, 'res')
      firstFormData = res[0];
      var packageName;
      var likeNum = that.data.likeNum
      if (likeNum == 5) {
        packageName = '您的职言点赞人数达到5人'
      }
      else if (likeNum == 20) {
        packageName = '您的职言点赞人数达到20人'
      }
      else if (likeNum == 50) {
        packageName = '您的职言点赞人数达到50人'
      }
      let modelData = {
        "touser": that.data.openId,
        "template_id": "x3VaC0QEPyy8gTHNHOe0yWYbyvAryTDDPxX7KZFYyGw",
        "page": "/pages/assist_A/assist_A",
        "form_id": firstFormData.formid,
        "data": {
          "keyword1": {
            "value": '有' + assistNum + '人给你的职言点赞了，快去看看吧~',
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

  like: function (e) {
    var index = e.target.dataset.index;
    var hadLike = e.target.dataset.hadlike;
    var currentUserId = that.data.currentUserId;
    var likeZhiYanID = e.target.dataset.id;
    var contentList = that.data.contentList;
    console.log(hadLike)
    if (hadLike == 'false') {
      contentList[index].likeNum++;
      contentList[index].hadLike = true;
      that.setData({
        contentList: contentList,
      })

      const queryLC = Bmob.Query('likeComment');
      queryLC.set("likeUser", currentUserId)
      queryLC.set("likeZhiYanID", likeZhiYanID)
      queryLC.save().then(res => {

        const queryZY = Bmob.Query('zhiYan');
        queryZY.get(likeZhiYanID).then(res2 => {
          var likeNum = res2.likeNum;
          likeNum++;
          res2.set('likeNum', likeNum)
          res2.save()
          if (that.checkNum(likeNum)) {
            console.log('6666')
            //点赞达到要求可以发送formid
            console.log('达到了')
            that.sendFormid()
          }
        }).catch(err => {
          wx.hideLoading()
          wx.showToast({
            title: '网络不稳定',
            icon: 'none'
          });
        }).catch(err => {
          console.log(err)
        })


      }).catch(err => {
        console.log(err)
      })
    }
    else {
      contentList[index].likeNum--;
      contentList[index].hadLike = false;
      that.setData({
        contentList: contentList,
      })

      const queryZY = Bmob.Query('zhiYan');
      queryZY.get(likeZhiYanID).then(res => {
        var likeNum = res.likeNum;
        likeNum--;
        res.set('likeNum', likeNum)
        res.save()
      }).catch(err => {
        console.log(err)
      })

      const queryLC = Bmob.Query('likeComment');
      queryLC.equalTo("likeUser", "==", currentUserId);
      queryLC.equalTo("likeZhiYanID", "==", likeZhiYanID);
      queryLC.find().then(todos => {

        todos.destroyAll().then(res => {
          console.log(res, 'ok')
        }).catch(err => {
          console.log(err)
        });
      })

    }
  },


  comment: function (e) {
    var id = e.target.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '../zhiYanDetail/zhiYanDetail?id=' + id,
    })
  },

  share: function (e) {
    var id = e.target.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '../zhiYanDetail/zhiYanDetail?id=' + id + "&share=true",
    })
  },


  detail: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = that.data.contentList[index].objectId;
    wx.navigateTo({
      url: '../zhiYanDetail/zhiYanDetail?id=' + id + '&zyIndex=' + index,
    })
  },

  previewImg: function (e) {
    var currentSrc = e.target.dataset.currentSrc;
    var urls = new Array();
    urls.push(currentSrc)
    wx.previewImage({
      current: currentSrc, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  openSearchPage: function () { //打开搜索页面
    wx.navigateTo({
      url: '../searchZhiYan/searchZhiYan',
    })
  },

  cancelSearch: function () {//取消搜索
    getApp().globalData.zhiYanSearchText = '';
    that.setData({
      contentList: [],
      pageIndex: 0,
      has_more: true,
      searchText: '',
    })
    that.search();
  },

  promiseItem(currentUserId, likeZhiYanID, obj) {
    return new Promise((resove, reject) => {
      const queryLC = Bmob.Query("likeComment");
      queryLC.equalTo("likeUser", "==", currentUserId);
      queryLC.equalTo("likeZhiYanID", "==", likeZhiYanID);
      queryLC.find().then(res2 => {
        if (res2.length >= 1) {
          obj.hadLike = true;
        }
        resove(1)
      });
    })
  },

  search: function () {
    var searchText = that.data.searchText;

    const queryZY = Bmob.Query("zhiYan");


    if (searchText) {
      queryZY.equalTo("content", "==", { "$regex": "" + searchText + ".*" });
    }
    queryZY.order("-top", "-createdAt")
    queryZY.include('publisher')
    queryZY.limit(size);
    queryZY.skip(that.data.pageIndex * size);
    queryZY.find().then(res => {
      console.log(res)
      if (res.length < size) {
        that.setData({
          has_more: false
        });
      }
      var noSearchResult = false;
      if (res.length == 0) {
        noSearchResult = true
      }
      let promiseArr = [];
      let currentUserId = that.data.currentUserId;
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
        let likeZhiYanID = res[i].objectId;

        promiseArr.push(this.promiseItem(currentUserId, likeZhiYanID, res[i]))


      }
      console.log(promiseArr)
      Promise.all(promiseArr).then(promiseRes => {
        var contentList = that.data.contentList;
        console.log(res)
        that.setData({
          contentList: contentList.concat(res),
          pageIndex: 0,
          noSearchResult: noSearchResult
        })
      });
    })




  },

  issue: function (e) {
    var wxUserInfo = e.detail.userInfo;
    if (!wxUserInfo) {
      wx.showToast({
        title: '哎呀，你拒绝我啦',
        icon: 'none',
        duration: 2000
      })
    }
    else {
      var currentUserId = that.data.currentUserId;
      const queryUser = Bmob.Query('_User');
      queryUser.get(currentUserId).then(res => {
        var authorize = res.authorize;
        var userInfo = res.userInfo;
        console.log('authorize' + authorize)
        if (!authorize) {
          var nickName = wxUserInfo.nickName;
          var userPic = wxUserInfo.avatarUrl;
          res.set('nickName', nickName);
          res.set('userPic', userPic);
          res.set('authorize', true);
          res.save();
          if (!userInfo) {
            wx.navigateTo({
              url: '../inputPerInfo/inputPerInfo?source=pubZhiYan'
            })
          }
          else {
            wx.navigateTo({
              url: '../publishZhiYan/publishZhiYan'
            })
          }
        }
        else {
          if (!userInfo) {
            wx.navigateTo({
              url: '../inputPerInfo/inputPerInfo?source=pubZhiYan'
            })
          }
          else {
            wx.navigateTo({
              url: '../publishZhiYan/publishZhiYan'
            })
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },

  onReachBottom: function () {
    if (!that.data.has_more) {
      return;
    }
    var pageIndex = that.data.pageIndex;
    that.setData({
      pageIndex: ++pageIndex
    });
    that.search();
  },


  onPullDownRefresh: function () {

    that.setData({
      contentList: [],
      pageIndex: 0,
      has_more: true,
    })

    var page = getCurrentPages().pop()
    page.onLoad();
    wx.stopPullDownRefresh()
  },

  onShareAppMessage: function () {

  }
})