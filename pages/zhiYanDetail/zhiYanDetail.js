var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var app = getApp()
var that;
var size = 10
Page({

  
  data: {
    zhiYan:[],
    commentList:[],
    inputComment:'',
    placeholder:'有何高见，也可以展开讲讲',
    likeNum:0, 
    commentNum:0,
    beCommentId:'',

    pageIndex: 0,
    has_more: true,
    showMask:false,
    focus:false,

    sharePanelHidden: true,//隐藏的分享面板
    animationData: {},//弹出的动画
    zyIndex:null,

    replyUserId:'',
  },

  
  onLoad: function (options) { 
    that=this;
    wx.showLoading({
      title: '加载中...',
    })
    var zhiYanID=options.id;
    var zyIndex = options.zyIndex;
    const queryZY = Bmob.Query('zhiYan');
    queryZY.include('publisher')
    
    queryZY.get(zhiYanID).then(res => {
      console.log(res)
      
        //查询发布的状态点
        var now = new Date().getTime();
        var pubishT = Date.parse(new Date(res.createdAt.replace(/-/g, "/")));
        //计算出小时数
        var fromT = now - pubishT;//时间差
        var hours = Math.floor(fromT / (3600 * 1000))
        if (hours >= 0 && hours <= 1) {
          res.publishTime = '刚刚发布'
        } else if (hours > 1 && hours <= 24) {
          res.publishTime = '今日发布'
        } else if (hours > 24 && hours <= 36) {
          res.publishTime = '1天前发布'
        } else {
          var pubArray = res.createdAt.split(" ");
          var tArrar = pubArray[0].split("-");
          res.publishTime = tArrar[1] + '月' + tArrar[2] + '日发布'
        }

      let current = Bmob.User.current();
      var currentUserId = current.objectId;

      const queryLC = Bmob.Query("likeComment");
      queryLC.equalTo("likeUser", "==", currentUserId);
      queryLC.equalTo("likeZhiYanID", "==", zhiYanID);
      queryLC.find().then(res2 => {
        if (res2.length >= 1) {
          res.hadLike = true;
        }
        that.setData({
          currentUserId: currentUserId,
          zhiYan: res,
          zhiYanID: zhiYanID,
          zyIndex: zyIndex,
          commentNum: res.commentNum,
          likeNum: res.likeNum,
        })
        that.loadComment();
      });

      


    }).catch(err => {
      console.log(err)
    })

  },

  loadComment: function (){
    const queryZC = Bmob.Query("zy_comment");
    queryZC.equalTo("zhiYan", "==", that.data.zhiYanID);
    queryZC.limit(size);
    queryZC.skip(that.data.pageIndex * size);
    queryZC.include('publisher', 'replyUser')
    queryZC.find().then(res => {
      console.log(res)
      if (res.length < size) {
        that.setData({
          has_more: false
        });
      }

      var currentUserId = that.data.currentUserId;
      let promiseArr = [];
      for(var i=0;i<res.length;i++){
        let likeFirstCommentID = res[i].objectId;

        promiseArr.push(this.promiseItem(currentUserId, likeFirstCommentID, res[i]))
      }

      Promise.all(promiseArr).then(promiseRes => {
        var commentList = that.data.commentList;
  
        that.setData({
          commentList: commentList.concat(res),
        })
        wx.hideLoading()
      });
    });
  },





  likeZY:function(e){
    var hadLike = e.currentTarget.dataset.hadlike;
    var likeZhiYanID=that.data.zhiYan.objectId;
    var currentUserId = that.data.currentUserId;
    if (hadLike=='false'){
      var zhiYan = that.data.zhiYan;
      zhiYan.likeNum++;
      zhiYan.hadLike = true;
      that.setData({
        zhiYan: zhiYan,
      })
     
      getApp().globalData.likeZYIndex=that.data.zyIndex;


      const queryLC = Bmob.Query('likeComment');
      queryLC.set("likeUser", currentUserId)
      queryLC.set("likeZhiYanID", likeZhiYanID)
      queryLC.save().then(res => {

        const queryZY = Bmob.Query('zhiYan');
        queryZY.get(likeZhiYanID).then(res => {
          var likeNum = res.likeNum;
          likeNum++;
          res.set('likeNum', likeNum)
          res.save()
        }).catch(err => {
          console.log(err)
        })


      }).catch(err => {
        console.log(err)
      })

    }
    else{
      var zhiYan = that.data.zhiYan;
      zhiYan.likeNum--;
      zhiYan.hadLike = false;
      that.setData({
        zhiYan: zhiYan,
      })

      getApp().globalData.unLikeZYIndex = that.data.zyIndex;

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
      queryLC.set("likeUser", currentUserId)
      queryLC.set("likeZhiYanID", likeZhiYanID)
      queryLC.find().then(todos => {

        todos.destroyAll().then(res => {
          console.log(res, 'ok')
        }).catch(err => {
          console.log(err)
        });
      })
    }



  },

  inputComment:function(e){
    that.setData({
      inputComment: e.detail.value,
    })
  },

  focus:function(){
    that.setData({
      showMask: true,
    })
  },

  hideMask:function(){
    that.setData({
      replyUserId:'',
      showMask: false,
      focus: false,
      placeholder: '有何高见，也可以展开讲讲',
    }) 
  },

  promiseItem(currentUserId, likeFirstCommentID, obj) {
    return new Promise((resove, reject) => {
      const queryLC = Bmob.Query("likeComment");
      queryLC.equalTo("likeUser", "==", currentUserId);
      queryLC.equalTo("likeFirstCommentID", "==", likeFirstCommentID);
      queryLC.find().then(res2 => {
        if (res2.length >= 1) {
          obj.hadLike = true;
        }
        resove(1)
      });
    })
  },

  closePanel: function (event) {
    //创建弹回的动画
    var animation = wx.createAnimation({
      duration: 160,
      timingFunction: 'linear',
    });
    animation.translateY(0).step();
    this.setData({
      animationData: animation.export()
    })

    setTimeout(function () {
      this.setData({ sharePanelHidden: true });
    }.bind(this), 160);
 
  },


  share: function (event) {
    //创建弹出的动画
    var animation = wx.createAnimation({
      duration: 160,
      timingFunction: 'linear',
    });
  
    this.setData({ sharePanelHidden: false });

    //这里的弹出高度是px 需要根据rpx计算
    var px = 315 / 750 * wx.getSystemInfoSync().windowWidth; 
    animation.translateY(-px).step();
    this.setData({
      animationData: animation.export()
    })
  },

  likeComment: function (e) { 
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var hadLike = e.currentTarget.dataset.hadlike;
    var commentList = that.data.commentList;
    var currentUserId = that.data.currentUserId;
    
    if (hadLike == 'false') {
      commentList[index].likeNum++;
      commentList[index].hadLike = true;
      that.setData({
        commentList: commentList,
      })


      const queryLC = Bmob.Query('likeComment');
      queryLC.set("likeUser", currentUserId)
      queryLC.set("likeFirstCommentID", id)
      queryLC.save().then(res => {
        const queryZC = Bmob.Query('zy_comment');
        queryZC.get(id).then(res2 => {
          var likeNum = res2.likeNum;
          likeNum++;
          res2.set('likeNum', likeNum)
          res2.save()
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })




    }
    else {
      commentList[index].likeNum--;
      commentList[index].hadLike = false;
      that.setData({
        commentList: commentList,
      })


      const queryZC = Bmob.Query('zy_comment');
      queryZC.get(id).then(res => {
        var likeNum = res.likeNum;
        likeNum--;
        res.set('likeNum', likeNum)
        res.save()
      }).catch(err => {
        console.log(err)
      })


      const queryLC = Bmob.Query('likeComment');
      queryLC.equalTo("likeUser", "==", currentUserId);
      queryLC.equalTo("likeFirstCommentID", "==", id);
      queryLC.find().then(todos => {

        todos.destroyAll().then(res => {
          console.log(res, 'ok')
        }).catch(err => {
          console.log(err)
        });
      })
    }
   
  },



  publish:function(){
    var inputComment = that.data.inputComment;
    if (!inputComment){
      wx.showToast({
        title: '未输入内容',
        icon: 'none',
        duration: 2000
      })
    }
    
    var zhiYanID=that.data.zhiYanID;
    let current = Bmob.User.current();
    var currentUserId = current.objectId;
    const pointer = Bmob.Pointer('_User')
    const poiID = pointer.set(currentUserId)
    const pointer2 = Bmob.Pointer('zhiYan')
    const poiID2 = pointer.set(zhiYanID)
    const queryZC = Bmob.Query('zy_comment');
    queryZC.set("content", inputComment)
    queryZC.set("publisher", poiID)
    queryZC.set("zhiYan", poiID2)
    queryZC.set("likeNum", 0)


    if (that.data.replyUserId){
      const pointer3 = Bmob.Pointer('_User')
      const poiID3 = pointer.set(that.data.replyUserId)
      queryZC.set("replyUser", poiID3)
    }
    queryZC.include('publisher', 'replyUser')
    queryZC.save().then(res => {
      console.log(res)
      wx.showToast({
        title: '评论成功',
        icon: 'none',
        duration: 2000
      })

      queryZC.get(res.objectId).then(res2 => {
        var commentNum = that.data.commentNum;
        commentNum++;
        var commentList = that.data.commentList;
        commentList.unshift(res2);

        getApp().globalData.commentZYIndex = that.data.zyIndex;

        that.setData({
          commentList: commentList,
          pageIndex: 0,
          has_more: true,
          showMask: false,
          inputComment: '',
          commentNum: commentNum
        })


      }).catch(err => {
        console.log(err)
      })


     

      const queryZY = Bmob.Query('zhiYan');
      queryZY.get(zhiYanID).then(res3 => {
        var commentNum = res3.commentNum;
        commentNum++;
        res3.set('commentNum', commentNum)
        res3.save()
      }).catch(err => {
        console.log(err)
      })

    })
  },


  previewImg: function (e) {
    var currentSrc = e.target.dataset.currentsrc;
    var urls=that.data.zhiYan.images;
    wx.previewImage({
      current: currentSrc, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },


  replyComment:function(e){
    var index = e.currentTarget.dataset.index;
    var commentList = that.data.commentList;
    console.log(commentList[index]);
    var nickName = commentList[index].publisher.nickName;
    var replyUserId = commentList[index].publisher.objectId;

    that.setData({
      placeholder: '回复' + nickName,
      replyUserId: replyUserId,
      focus: true
    })
  },

  onReachBottom: function () {
    if (!that.data.has_more) {
      return;
    }
    wx.showLoading({
      title: '加载中...',
    })
    var pageIndex = that.data.pageIndex;
    that.setData({
      pageIndex: ++pageIndex
    });
    that.loadComment();
  },


  onShareAppMessage: function () {

  }
})