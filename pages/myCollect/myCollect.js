var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var util = require('../../utils/util.js');
var app = getApp();
var that;
var pageSize = 10;//每页记录条数
var jobIndex = 0;//岗位分页数
var houseIndex = 0;//租房分页数 ---
var rentIndex = 0;//求租分页数
var currentUser;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    jobList: [],//职位详情列表
    houseList: [],//房源信息列表
    rentHouseList:[],//求租页面列表
    houseEmpty: false,//房间列表是是否空
    rentEmpty: false,//求租列表是否为空
    jobEmpty: false,   //工作列表是是否空
    collectType: 'job',//发布类型
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    currentUser = Bmob.User.current();//加载当前的user
    jobIndex = 0;//jobIndex初始化
    that.queryJobCollect();
    // this.queryHouse();
    // this.queryRent();
  },

  onReachBottom: function () {
    var searchDataSheet;
    var publisher = app.globalData.userId
    var collectType = that.data.collectType;
    // if (collectType == 'job') {
    //   searchDataSheet = Bmob.Query('jobCollect');
    // }
    // else if (collectType == 'house') {
    //   searchDataSheet = Bmob.Query('houseCollect');
    // }
    if (collectType == 'job') {
      searchDataSheet = Bmob.Query('jobCollect');
      searchDataSheet.equalTo('userId', '==', publisher);
      searchDataSheet.equalTo('stateflag', '==', '0'); //0代表不删除
      searchDataSheet.order("-top", "-createdAt")
      searchDataSheet.limit(pageSize)
      searchDataSheet.skip(jobIndex * pageSize);
      searchDataSheet.find().then(res => {
        if (res.length == 0) {
          that.setData({
            more: true
          })
        }
        jobIndex ++ ;//分页条数增加
        var arrConcat = that.data.jobList.concat(res)
        console.log(arrConcat)
        that.setData({
          jobList: arrConcat
        })
        wx.hideLoading()
      })
    }
    // else if (collectType == 'house') {
    //   // if (that.data.my_house_list.length >= that.data.pageIndex * size) {
    //   //   that.data.pageIndex++;
    //   // }
    //   searchDataSheet.skip(that.data.pageIndex * pageSize);
    //   searchDataSheet.find().then(res => {
    //     console.log(res)
    //     if (res.length == 0) {
    //       that.setData({
    //         more: true
    //       })
    //     }
    //     var arrConcat = that.data.my_house_list.concat(res)
    //     console.log(arrConcat)
    //     that.setData({
    //       my_house_list: arrConcat
    //     })
    //     wx.hideLoading()
    //   })
    // }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //查询收藏的工作 
  queryJobCollect: function(){
    var userId = currentUser.objectId;//当前用户的id
    const jobQuery = Bmob.Query('jobCollect');
    jobQuery.equalTo('userId', '==', userId);
    jobQuery.equalTo('stateflag', '==', '0'); //0代表不删除
    jobQuery.include("jobDetail");
    jobQuery.order("-top", "-createdAt")
    jobQuery.limit(pageSize);
    jobQuery.skip(pageSize * jobIndex);
    jobQuery.find().then(res => {
      console.log(res)
      if (res.length == 0) {
        that.setData({
          jobEmpty: true
        });
      }else{
        that.setData({
          jobList: res,
          jobEmpty: false
        })
      }
      jobIndex++;//加载完之后jobIndex + 1
      
    })
  },
  //查询收藏的房源列表
  queryHouse: function(){
    var userId = currentUser.objectId;//当前用户的id
    houseIndex = 0;//赋初值为0
    const houseQuery = Bmob.Query('houseCollect');
    houseQuery.equalTo('userId', '==', userId);
    houseQuery.equalTo('stateflag', '==', '0'); //0代表不删除
    houseQuery.equalTo('type','==','0');//0代表房源
    houseQuery.include("houseDetail");
    houseQuery.order("-top", "-createdAt")
    houseQuery.find().then(res => {
      console.log(res)
      if (res.length == 0) {
        that.setData({
          houseEmpty: true
        });
      }else{
        that.setData({
          houseList: res,
          houseEmpty: false
        })
      }
      houseIndex++;//加载完之后jobIndex + 1
     
    })
  },
  //查询收藏的求租列表
  queryRent: function(){
    var userId = currentUser.objectId;//当前用户的id
    rentIndex = 0;//赋初值为0
    const rentQuery = Bmob.Query('houseCollect');
    rentQuery.equalTo('userId', '==', userId);
    rentQuery.equalTo('stateflag', '==', '0'); //0代表不删除
    rentQuery.equalTo('type', '==', '1');//0代表房源
    rentQuery.order("-top", "-createdAt")
    rentQuery.include("rentDetail");
    rentQuery.find().then(res => {
      console.log(res)
      if (res.length == 0) {
        that.setData({
          rentEmpty: true
        });
      }else{
        that.setData({
          rentList: res,
          rentEmpty: false
        })
      }
      rentIndex++;//加载完之后jobIndex + 1
     
    })
  },
  selectJob:function(){
    that.setData({
      collectType: "job"
    });
  },
  selectHouse:function(){
    that.setData({
      collectType: "house"
    });
    that.queryHouse();
    that.queryRent();
  },
  
  //去详情页面
  to_detail_job: (e) => {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../details/details?id=' + id,
    })
  },
  //去详情页面
  to_detail_house: (e) => {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../publishdetail/publishdetail?object=' + id,
    })
  },
  //去详情页面
  to_detail_rent: (e) => {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../renddetail/renddetail?object=' + id,
    })
  },
 
  //去删除工作
  del_job: (e) => {
    var flag = false;//起初定义列表不空
    var id = e.currentTarget.dataset.id;
    var afterDelList = that.data.jobList.filter((value) => {
      if (value.objectId != id) {
        return value;
      }
    });
    wx.showModal({
      title: '提示',
      content: '确定删除此条收藏吗',
      success(res) {
        var nowTime = util.getNowTime();
        if (res.confirm) {                //用户点击确定
          if (afterDelList.length == 0) {
            console.log(afterDelList.length)
            flag = true;
          }
          const queryDel = Bmob.Query('jobCollect');
          queryDel.get(id).then(res => {
            console.log(res)
            res.set('stateflag', nowTime)
            res.save().then(res => {
              that.setData({
                jobList: afterDelList,
                jobEmpty: flag
              });
            })
          }).catch(err => {
            console.log(err)
          })
        } else {

        }
      }
    })
  },
  //去删除房源
  del_house: (e) => {
    var flag = false;//起初定义列表不空
    var id = e.currentTarget.dataset.id;
    var afterDelList = that.data.houseList.filter((value) => {
      if (value.objectId != id) {
        return value;
      }
    });
    wx.showModal({
      title: '提示',
      content: '确定删除此条收藏吗',
      success(res) {
        var nowTime = util.getNowTime();
        if (res.confirm) {                //用户点击确定
          if (afterDelList.length == 0) {
            console.log(afterDelList.length)
            flag = true;
          }
          const queryDel = Bmob.Query('houseCollect');
          queryDel.get(id).then(res => {
            console.log(res)
            res.set('stateflag', nowTime)
            res.save().then(res => {
              that.setData({
                houseList: afterDelList,
                houseEmpty: flag
              });
            })
          }).catch(err => {
            console.log(err)
          })
        } else {

        }
      }
    })
  },
  //去删除求租
  del_rent: (e) => { 
    var flag = false;//起初定义列表不空
    var id = e.currentTarget.dataset.id;
    var afterDelList = that.data.rentList.filter((value) => {
      if (value.objectId != id) {
        return value;
      }
    });
    wx.showModal({
      title: '提示',
      content: '确定删除此条收藏吗',
      success(res) {
        var nowTime = util.getNowTime();
        if (res.confirm) {                //用户点击确定
          if (afterDelList.length == 0) {
            console.log(afterDelList.length)
            flag = true;
          }
          const queryDel = Bmob.Query('houseCollect');
          queryDel.get(id).then(res => {
            console.log(res)
            res.set('stateflag', nowTime)
            res.save().then(res => {
              that.setData({
                rentList: afterDelList,
                rentEmpty: flag
              });
            })
          }).catch(err => {
            console.log(err)
          })
        } else {

        }
      }
    })
  }
})