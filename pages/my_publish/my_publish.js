// pages/my_publish/my_publish.js
var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var util=require('../../utils/util.js');
var app=getApp();
var size = 20
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_job_list:[],
    my_house_list: [
      //  { id: 1, url: '../img/dianping.png', title: '北京宋家庄鲁能，美高梅公馆27号楼，1单元', house_type: '合租'  },
      //  { id: 2, url: '../img/dianping.png', title: '北京大郊亭鲁能，美高梅公馆27号楼，1单元', house_type: '转租'  },
      //  { id: 3,  url: '../img/dianping.png', title: '北京西二旗鲁能，美高梅公馆27号楼，1单元', house_type: '转租' },
    ],
    my_rent_list:[],
    house: false,//房间列表是是否空
    job: false,   //工作列表是是否空
    pub_type:'job',//发布类型
    showHiddenPage:false,

    showRentTitle: true,
    showOriginTitle: true,

    pageIndex: 0,
    more: false,

  },


  onLoad: function (options) {
    that = this;

    that.jobSelect();


  },



  jobSelect(){
    this.setData({
      pub_type:'job',
      job:true,
      house:false,

      pageIndex: 0,
      more: false,

    });
    that.selectJob();
  },
  houseSelect(){
    this.setData({
      pub_type:'house',
      job:false,
      house:true,
      pageIndex: 0,
      more: false,
    })
    that.selectHouse()
  },
  //去详情页面
  to_detail_job: (e) => {
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../details/details?id='+id,
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
  //去编辑工作
  to_edit_job:(e)=>{
    var id = e.currentTarget.dataset.id;    
    wx.navigateTo({
      url: '../publishJob/publishJob?id='+id,
    })
  },
  //去编辑房源
  to_edit_house: (e) => {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../publishHouse1/publishHouse1?id=' + id +'&publishTypeIndex=0',
    })
  },
  //去编辑求租
  to_edit_rent: (e) => {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../publishHouse1/publishHouse1?id=' + id + '&publishTypeIndex=1',
    })
  },
  //去删除工作
  del_job:(e)=>{
    var flag=false;//起初定义列表不空
    var id = e.currentTarget.dataset.id;  
    var new_job_data = that.data.my_job_list.filter((value)=>{
      if (value.objectId!=id){
        return value;
      }
    });
    wx.showModal({
      title: '提示',
      content: '确定删除此条发布吗',
      success(res){
        var nowTime=util.getNowTime();
        if(res.confirm){                //用户点击确定
          if (new_job_data.length==0){
            console.log(new_job_data.length)
            flag=true;
          }
          const queryDel = Bmob.Query('job');
          queryDel.get(id).then(res => {
            console.log(res)
            res.set('del_flag', nowTime)
            res.save().then(res=>{
              that.setData({
                my_job_list: new_job_data,
                showHiddenPage: flag
              });
            })
          }).catch(err => {
            console.log(err)
          })



          
        }else{

        }
      }
    })
  },
  //去顶贴
  reflesh:(e)=>{
    var id = e.currentTarget.dataset.id;  
    const queryUpdata = Bmob.Query('job');
    queryUpdata.get(id).then(res => {
      console.log(res)
      res.set('issigin', '1')//设置无意义字段旨在刷新updataAt
      res.save()
      wx.showToast({
        title: '顶贴成功',
      })
    }).catch(err => {
      console.log(err)
    })   
  },
  origin_reflash(e){
    var id = e.currentTarget.dataset.id;
    const queryUpdata = Bmob.Query('house');
    queryUpdata.get(id).then(res => {
      console.log(res)
      res.set('nothing', '1')//设置无意义字段旨在刷新updataAt
      res.save()
      wx.showToast({
        title: '顶贴成功',
      })
    }).catch(err => {
      console.log(err)
    }) 
  },
  rent_reflash(e){
    var id = e.currentTarget.dataset.id;
    const queryUpdata = Bmob.Query('rentHouse');
    queryUpdata.get(id).then(res => {
      console.log(res)
      res.set('nothing', '1')//设置无意义字段旨在刷新updataAt
      res.save()
      wx.showToast({
        title: '顶贴成功',
      })
    }).catch(err => {
      console.log(err)
    }) 
  },
  //去删除房子
  del_house: (e) => {
    let id = e.currentTarget.dataset.id;
    let flag = false;
    let new_house_data = that.data.my_house_list.filter((value) => { //筛选删除的
      if (value.objectId != id) {
        return value;
      }
    });
    if (new_house_data.length == 0) {
      flag = true
    }
    wx.showModal({
      title: '提示',
      content: '确定删除此条发布吗',
      success(res) {
        if (res.confirm) {                //用户点击确定
          const query = Bmob.Query('house');
          query.set('id', id) //需要修改的objectId
          query.set('del_flag', new Date())
          query.save().then(res => {
            console.log(res)
          }).catch(err => {
            console.log(err)
          })
          that.setData({
            my_house_list: new_house_data,
            showHiddenPage: flag
          })
        } else {

        }
      }
    })
  },
  //去删除房子
  del_rent: (e) => {
    let id = e.currentTarget.dataset.id;
    let flag = false;
    let new_rent_data = that.data.my_rent_list.filter((value) => { //筛选删除的
      if (value.objectId != id) {
        return value;
      }
    });
    if (new_rent_data.length == 0) {
      flag = true
    }
    wx.showModal({
      title: '提示',
      content: '确定删除此条发布吗',
      success(res) {
        if (res.confirm) {                //用户点击确定
          const query = Bmob.Query('rentHouse');
          query.set('id', id) //需要修改的objectId
          query.set('del_flag', new Date())
          query.save().then(res => {
            console.log(res)
          }).catch(err => {
            console.log(err)
          })
          that.setData({
            my_rent_list: new_rent_data,
            // showHiddenPage: flag
          })
        } else {

        }
      }
    })
  },
  selectJob(){
    wx.showLoading({
      title: '正在加载',
    })
    // var job_is_empty=false;
    // var house_is_empty=false;
    var showHiddenPage = false;//数据是否为空



    var publisher = app.globalData.userId


    // var id ='cbc8f76cef';
    //查询工作
    const queryJob = Bmob.Query('job');
    queryJob.equalTo('publisher', '==', publisher);
    queryJob.equalTo('del_flag', '==', '0'); //0代表不删除
    queryJob.order("-top", "-createdAt")
    queryJob.limit(size)
    queryJob.find().then(res => {
      console.log(publisher);
      if (res.length == 0) {
        // job_is_empty = true;
        showHiddenPage = true;
        console.log(1)
      }
      console.log(res)
      that.setData({
        my_job_list: res,
        // job_is_empty: job_is_empty
        showHiddenPage: showHiddenPage
      });
      wx.hideLoading()
    })
  },
  selectHouse(){
    wx.showLoading({
      title: '正在加载',
    })

    // var job_is_empty=false;
    // var house_is_empty=false;
    var showHiddenPage = false;//数据是否为空
    var publisher = app.globalData.userId
    const queryHouse = Bmob.Query('house');
    queryHouse.equalTo('publisher', '==', publisher);
    queryHouse.equalTo('del_flag', '==', '0'); //0代表不删除
    queryHouse.order("-top", "-createdAt")
    queryHouse.limit(size)
    queryHouse.find().then(res => {
      console.log(publisher);
      if (res.length == 0) {
        console.log('sfadfasdfasdfdsfds')
        showHiddenPage = true;
        that.setData({
          showOriginTitle:false,
        })
      }else{
        console.log(that.data)
      }
      //查询求租
      var showHiddenPageRent = false;
      const queryHouseRent = Bmob.Query('rentHouse');
      queryHouseRent.equalTo('publisher', '==', publisher);
      queryHouseRent.equalTo('del_flag', '==', '0'); //0代表不删除
      queryHouseRent.order("createdAt");
      queryHouseRent.find().then(ress => {
        console.log(publisher);
        if (ress.length == 0) {
          showHiddenPageRent = true;
          that.setData({
            showRentTitle: false,
          })
        }
        console.log(showHiddenPage,showHiddenPageRent)
        that.setData({
          my_rent_list: ress,
          showHiddenPage: showHiddenPage && showHiddenPageRent
        });
      });
      console.log(res)
      that.setData({
        my_house_list: res,
        // showHiddenPage: showHiddenPage
      });
      wx.hideLoading()      
    });
    
  },
  /**
   * 生命周期函数--监听页面加载
   */



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.onLoad();  
  },




  onReachBottom: function () {
    var searchDataSheet;
    var publisher = app.globalData.userId
    var pub_type = that.data.pub_type;
    if (pub_type=='job'){
      searchDataSheet = Bmob.Query('job');
    }
    else if (pub_type == 'house') {
      searchDataSheet = Bmob.Query('house');
    }

    searchDataSheet.equalTo('publisher', '==', publisher);
    searchDataSheet.equalTo('del_flag', '==', '0'); //0代表不删除
    searchDataSheet.order("-top", "-createdAt")
    searchDataSheet.limit(size)

    if (pub_type == 'job') {
      if (that.data.my_job_list.length >= that.data.pageIndex * size) {
        that.data.pageIndex++;
      }
      searchDataSheet.skip(that.data.pageIndex * size);
      searchDataSheet.find().then(res => {
        if (res.length == 0) {
          that.setData({
            more: true
          })
        }
        var arrConcat = that.data.my_job_list.concat(res)
        console.log(arrConcat)
        that.setData({
          my_job_list: arrConcat
        })
        wx.hideLoading()
      })
    } 
    else if (pub_type == 'house') {
      if (that.data.my_house_list.length >= that.data.pageIndex * size) {
        that.data.pageIndex++;
      }
      searchDataSheet.skip(that.data.pageIndex * size);
      searchDataSheet.find().then(res => {
        console.log(res)
        if (res.length == 0) {
          that.setData({
            more: true
          })
        }
        var arrConcat = that.data.my_house_list.concat(res)
        console.log(arrConcat)
        that.setData({
          my_house_list: arrConcat
        })
        wx.hideLoading()
      })
    }




  },
  
  onShareAppMessage: function () {
  
  }
})