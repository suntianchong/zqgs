// pages/work/work.js
var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var app = getApp()
var that;
var jobQuery = Bmob.Query("job");
var size = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headFont: "",
    screenHeight: 0,
    city: "",
    nav: ["运营", "产品", "技术", "设计", "职能", "市场"],
    cityArr: ['北京', '上海', '广州', '深圳', '杭州'],
    containerArr: [],
    jobTypeList: [],
    pageIndex: 0,
    more: false,
    attractTop:false,
    searchText:'',
    noSearchResult:false,
    bannerTop:25,


    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    showSwiperDots:false,
    bannerList:[],


    showAddBubble: 'false',
    showShareToast: 'false',
  },




  onLoad: function (options) {
    that = this;
    var workCityCache = wx.getStorageSync('workCityCache')//拿到城市缓存
    var city = workCityCache.city
    if (!city) {//没有则默认全国
      city = '全国';
    }

    var workJobTypeCache = wx.getStorageSync('workJobTypeCache')//拿到职位缓存
    if (!workJobTypeCache.choseItemList) {//判断下是否为空，注意这里不能直接判断workJobTypeCache为空，因为上个版本也有workJobTypeCache这个缓存变量，所以要判断这个变量里面的东西有没有变化
      var workJobTypeCache = new Object; //如果为空则初始化
      workJobTypeCache.choseItemList = [];
      workJobTypeCache.itemListIndex = [0, 0, 0, 0, 0, 0];
      wx.setStorageSync('workJobTypeCache', workJobTypeCache)
      var jobTypeList = [];//这是已选的职位，用来筛选的，也初始化了
    }
    else{
      var jobTypeList = workJobTypeCache.choseItemList; //如果不为空，那就把缓存的职位赋值上去
    }

    that.setData({
      jobTypeList: jobTypeList,
      city: city,
      pageIndex: 0,
      more: false
    })

    const queryBanner = Bmob.Query("banner");
    queryBanner.order("number");
    queryBanner.find().then(res => {
      var showSwiperDots=false;
      var bannerTop=25;
      if(res.length>1){
        showSwiperDots=true;
        bannerTop=15;
      }
      that.setData({
        bannerList: res,
        showSwiperDots: showSwiperDots,
        bannerTop: bannerTop
      })
      // console.log(res)
    });

    that.search();//调用筛选
  

    const queryWebview = Bmob.Query('webview');
    queryWebview.get('47WQ888O').then(res => {
      var webviewVersion = wx.getStorageSync('webviewVersion')
      var headFont = res.headFont;
      that.setData({
        headFont: headFont
      })
      console.log('webviewVersion' + webviewVersion)
      if (!webviewVersion) {
        webviewVersion = res.version;
        wx.setStorageSync('webviewVersion', webviewVersion)
        getApp().globalData.newWebviewVersion = res.version;
        getApp().globalData.showReddot = true;
        wx.showTabBarRedDot({
          index: 2,
        })
      }
      else {
        if (webviewVersion != res.version) {
          getApp().globalData.newWebviewVersion = res.version;
          getApp().globalData.showReddot = true;
          wx.showTabBarRedDot({
            index: 2,
          })
        }
      }
      console.log('webviewVersion' + webviewVersion)
    }).catch(err => {
      console.log(err)
    })

    var showAddBubble = wx.getStorageSync('showAddBubble')
    if (!showAddBubble) {
      showAddBubble = 'true';
    }

    var showShareToast = wx.getStorageSync('showShareToast')
    console.log('showShareToast' + showShareToast)
    if (!showShareToast) {
      showShareToast = 'true';
    }

    const querySetting = Bmob.Query('setting');
    querySetting.get('Rpcq000F').then(res => {
      var openShare = res.openShare;

      that.setData({
        openShare: openShare,
        showAddBubble: showAddBubble,
        showShareToast: showShareToast
      })
    }).catch(err => {
      console.log(err)
    })

    console.log('showShareToast' + showShareToast)

  },

  closePackage: function () {
    that.setData({
      showShareToast: 'false',
    });
  },

  clickShareToastImg:function(){
    that.setData({
      showShareToast: 'false',
    })
    wx.setStorageSync('showShareToast', 'false')
    wx.navigateTo({
      url: '../rulesPage/rulesPage',
    })
  },


  onShow: function (options) {
    var that = this

    var refreshWork = getApp().globalData.refreshWork//拿到刷新变量，用来判断需不需要刷新


    var workCityCache = wx.getStorageSync('workCityCache')


    var city = workCityCache.city
    if (!city) {
      city = '全国';
    }

    that.setData({
      city: city,
    })

    if (refreshWork == 1) { //如果为1则刷新一遍

      var workJobTypeCache = wx.getStorageSync('workJobTypeCache')//和onload一样判断一遍
      if (!workJobTypeCache.choseItemList) {
        var workJobTypeCache = new Object; 
        workJobTypeCache.choseItemList = [];
        workJobTypeCache.itemListIndex = [0, 0, 0, 0, 0, 0];
        wx.setStorageSync('workJobTypeCache', workJobTypeCache)
        var jobTypeList = [];
      }
      else {
        var jobTypeList = workJobTypeCache.choseItemList; 
      }


      that.setData({
        jobTypeList: jobTypeList,
      })
      that.search();//调用筛选

      getApp().globalData.refreshWork = 0 //刷新完成后置为0
    }
    else if (refreshWork == 0) {//如果为0则不刷新
      
      if (getApp().globalData.workChangeCity == true) {//判断下用户是否更换了城市
        that.search();//如果更换则再调用筛选
        getApp().globalData.workChangeCity = false;//筛选完后置为false
      }

      var searchText = getApp().globalData.workSearchText;//拿到用户在输入框输入的搜索词
      if (searchText) {//如果不为空，说明用户输入搜索了
        that.setData({
          searchText: searchText,
        })
        that.search();//再筛选一遍
      }
    }


  },



  clickAddBubble: function () {
    that.setData({
      showAddBubble: 'false',
    })
    wx.setStorageSync('showAddBubble', 'false')
  },


  clickBanner: function (e) {  
    var index = e.currentTarget.dataset.index;
    // console.log(index)
    var bannerName = that.data.bannerList[index].title;
    if (bannerName=='职前助推器'){
      wx.navigateTo({
        url: '../rulesPage/rulesPage',
      })
    }
    else{
      wx.navigateTo({
        url: '../webView/webView?indexNum=' + index + '&source=banner',
      })
    }
  },


  cancelSearch: function () {//取消搜索
    getApp().globalData.workSearchText = '';
    that.setData({
      searchText: '',
    })
    that.search();
  },


  openSearchPage: function () { //打开搜索页面
    wx.navigateTo({
      url: '../searchWork/searchWork',
    })
  },

 
  search: function () {//筛选函数
    var city = that.data.city;//先拿到城市

    var searchText = getApp().globalData.workSearchText;//再拿到用户输入的搜索词

    if (searchText) {//如果不为空，说明用户输入搜索了
      jobQuery.equalTo("searchContent", "==", { "$regex": "" + searchText + ".*" });//那就加个检索条件
    }

    var jobTypeList = that.data.jobTypeList;//拿到用户选择的职位
    jobQuery.equalTo("del_flag", "==", '0');
    jobQuery.order("-top", "-createdAt")

    if (city != "全国") {//如果城市不等于全国，按用户选择的城市搜索
      jobQuery.equalTo("city", "==", city);
    }


    if (jobTypeList.length == 1) {//如果职位筛选有一个
      jobQuery.equalTo("jobType", "==", jobTypeList[0]);
    }
    else if (jobTypeList.length == 2) {//如果职位筛选有二个
      const jobQuery1 = jobQuery.equalTo("jobType", '==', jobTypeList[0]);
      const jobQuery2 = jobQuery.equalTo("jobType", '==', jobTypeList[1]);
      jobQuery.or(jobQuery1, jobQuery2);
    }
    else if (jobTypeList.length == 3) {//如果职位筛选有三个
      const jobQuery1 = jobQuery.equalTo("jobType", '==', jobTypeList[0]);
      const jobQuery2 = jobQuery.equalTo("jobType", '==', jobTypeList[1]);
      const jobQuery3 = jobQuery.equalTo("jobType", '==', jobTypeList[2]);
      jobQuery.or(jobQuery1, jobQuery2, jobQuery3);
    }
    else if (jobTypeList.length == 4) {//如果职位筛选有四个
      const jobQuery1 = jobQuery.equalTo("jobType", '==', jobTypeList[0]);
      const jobQuery2 = jobQuery.equalTo("jobType", '==', jobTypeList[1]);
      const jobQuery3 = jobQuery.equalTo("jobType", '==', jobTypeList[2]);
      const jobQuery4 = jobQuery.equalTo("jobType", '==', jobTypeList[3]);
      jobQuery.or(jobQuery1, jobQuery2, jobQuery3, jobQuery4);
    }
    else if (jobTypeList.length == 5) {//如果职位筛选有无个
      const jobQuery1 = jobQuery.equalTo("jobType", '==', jobTypeList[0]);
      const jobQuery2 = jobQuery.equalTo("jobType", '==', jobTypeList[1]);
      const jobQuery3 = jobQuery.equalTo("jobType", '==', jobTypeList[2]);
      const jobQuery4 = jobQuery.equalTo("jobType", '==', jobTypeList[3]);
      const jobQuery5 = jobQuery.equalTo("jobType", '==', jobTypeList[4]);
      jobQuery.or(jobQuery1, jobQuery2, jobQuery3, jobQuery4, jobQuery5);
    }
    else if (jobTypeList.length == 6) {//如果职位筛选有六个
      const jobQuery1 = jobQuery.equalTo("jobType", '==', jobTypeList[0]);
      const jobQuery2 = jobQuery.equalTo("jobType", '==', jobTypeList[1]);
      const jobQuery3 = jobQuery.equalTo("jobType", '==', jobTypeList[2]);
      const jobQuery4 = jobQuery.equalTo("jobType", '==', jobTypeList[3]);
      const jobQuery5 = jobQuery.equalTo("jobType", '==', jobTypeList[4]);
      const jobQuery6 = jobQuery.equalTo("jobType", '==', jobTypeList[5]);
      jobQuery.or(jobQuery1, jobQuery2, jobQuery3, jobQuery4, jobQuery5, jobQuery6);
    }

    jobQuery.limit(size)
    jobQuery.find().then(res => {

      // for(var i=0;i<res.length;i++){
      //   const query = Bmob.Query('job');
      //   query.get(res[i].objectId).then(res => {
      //     var searchContent = res.jobType + res.jobName + res.companyName;
      //     res.set('searchContent', searchContent)
      //     res.save()
      //   }).catch(err => {
      //     console.log(err)
      //   })
      // }


      console.log('###############################################');
      console.log(city);
      console.log(jobTypeList);
      console.log(searchText);
      console.log('###############################################');
      if (res.length == 0) {//如果搜索出来的结果为0
        that.setData({
          containerArr: res,
          pageIndex: 0,
          more: false,
          noSearchResult: true,
        })
      }
      else{
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
        }

        that.setData({
          containerArr: res,
          pageIndex: 0,
          more: false,
          noSearchResult: false,
        })
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


  },


  onPageScroll:function(e){

    // console.log(e.scrollTop)
    if (e.scrollTop>282){
      that.setData({
        attractTop: true,
      })

    }
    else{
      that.setData({
        attractTop: false,
      })
    }


  },





  goWebview: function (e) {
    wx.hideTabBarRedDot({
      index: 2,
    })
    wx.setStorageSync('webviewVersion', getApp().globalData.newWebviewVersion);
    console.log('newWebviewVersion' + getApp().globalData.newWebviewVersion)
    getApp().globalData.showReddot = false;
    wx.navigateTo({
      url: '../webView/webView?source=active',
    })

  },

  selectCity: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../city/city',
    })
  },

  workDetail: function (e) {
    var that = this
    //导航索引
    //每个导航下的view的索引
    var index = e.currentTarget.dataset.index;
    //点击之后获取到当前点击的公司
    var id = that.data.containerArr[index].objectId
    wx.navigateTo({
      url: '../details/details?id=' + id
    })
  },


  fliter:function(){
    wx.navigateTo({
      url: '../work_fliter/work_fliter'
    })
  },





  issue: function () {
    var cityIndex;
    var cityArr = that.data.cityArr;
    var city = that.data.city;
    for (var i = 0; i < cityArr.length; i++) {
      if (city == cityArr[i]) {
        cityIndex = i;
        break;
      }
    }
    wx.navigateTo({
      url: '../publishJob/publishJob?cityIndex=' + cityIndex

    })
  },





  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log(1)
    var that = this
    wx.setStorage({
      key: 'containerArr',
      data: that.data.containerArr,
    })
  },


  /**
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中...',
    })

    var searchText = getApp().globalData.workSearchText;
    console.log('AAAAsearchText=' + searchText)


    if (searchText) {
      jobQuery.equalTo("searchContent", "==", { "$regex": "" + searchText + ".*" });
    }


    var jobArr = that.data.containerArr
    var jobTypeList = that.data.jobTypeList
    var city = that.data.city
    if (jobArr.length >= that.data.pageIndex * size) {
      that.data.pageIndex++;
    }
    jobQuery.equalTo("del_flag", "==", '0');
    jobQuery.order("-top", "-createdAt")

    if (city != "全国") {
      jobQuery.equalTo("city", "==", city);
    }
   
    if (jobTypeList.length == 1) {
      jobQuery.equalTo("jobType", "==", jobTypeList[0]);
    }
    else if (jobTypeList.length == 2) {
      const jobQuery1 = jobQuery.equalTo("jobType", '==', jobTypeList[0]);
      const jobQuery2 = jobQuery.equalTo("jobType", '==', jobTypeList[1]);
      jobQuery.or(jobQuery1, jobQuery2);
    }
    else if (jobTypeList.length == 3) {
      const jobQuery1 = jobQuery.equalTo("jobType", '==', jobTypeList[0]);
      const jobQuery2 = jobQuery.equalTo("jobType", '==', jobTypeList[1]);
      const jobQuery3 = jobQuery.equalTo("jobType", '==', jobTypeList[2]);
      jobQuery.or(jobQuery1, jobQuery2, jobQuery3);
    }
    else if (jobTypeList.length == 4) {
      const jobQuery1 = jobQuery.equalTo("jobType", '==', jobTypeList[0]);
      const jobQuery2 = jobQuery.equalTo("jobType", '==', jobTypeList[1]);
      const jobQuery3 = jobQuery.equalTo("jobType", '==', jobTypeList[2]);
      const jobQuery4 = jobQuery.equalTo("jobType", '==', jobTypeList[3]);
      jobQuery.or(jobQuery1, jobQuery2, jobQuery3, jobQuery4);
    }
    else if (jobTypeList.length == 5) {
      const jobQuery1 = jobQuery.equalTo("jobType", '==', jobTypeList[0]);
      const jobQuery2 = jobQuery.equalTo("jobType", '==', jobTypeList[1]);
      const jobQuery3 = jobQuery.equalTo("jobType", '==', jobTypeList[2]);
      const jobQuery4 = jobQuery.equalTo("jobType", '==', jobTypeList[3]);
      const jobQuery5 = jobQuery.equalTo("jobType", '==', jobTypeList[4]);
      jobQuery.or(jobQuery1, jobQuery2, jobQuery3, jobQuery4, jobQuery5);
    }
    else if (jobTypeList.length == 6) {
      const jobQuery1 = jobQuery.equalTo("jobType", '==', jobTypeList[0]);
      const jobQuery2 = jobQuery.equalTo("jobType", '==', jobTypeList[1]);
      const jobQuery3 = jobQuery.equalTo("jobType", '==', jobTypeList[2]);
      const jobQuery4 = jobQuery.equalTo("jobType", '==', jobTypeList[3]);
      const jobQuery5 = jobQuery.equalTo("jobType", '==', jobTypeList[4]);
      const jobQuery6 = jobQuery.equalTo("jobType", '==', jobTypeList[5]);
      jobQuery.or(jobQuery1, jobQuery2, jobQuery3, jobQuery4, jobQuery5, jobQuery6);
    }
    jobQuery.skip(that.data.pageIndex * size);
    jobQuery.limit(size);
    jobQuery.find().then(res => {


      // for (var i = 0; i < res.length; i++) {
      //   const query = Bmob.Query('job');
      //   query.get(res[i].objectId).then(res => {
      //     var searchContent = res.jobType + res.jobName + res.companyName;
      //     res.set('searchContent', searchContent)
      //     res.save()
      //   }).catch(err => {
      //     console.log(err)
      //   })
      // }


      console.log('###############################################');
      console.log(city);
      console.log(jobTypeList);
      console.log(searchText);
      console.log('###############################################');
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
      }


      console.log(res)
      if (res.length == 0) {
        that.setData({
          more: true
        })
      }
      var arrConcat = jobArr.concat(res)
      console.log(arrConcat)
      that.setData({
        containerArr: arrConcat
      })
      wx.hideLoading()
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: "加载数据出错，请检查网络",
        icon: 'none',
        mask: true,
        duration: 2000
      });
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var title = '职前公社，校招实习租房一站式解决'
    return {
      title: title,
      path: '/pages/work/work',
      imageUrl: 'http://bmob-cdn-20509.b0.upaiyun.com/2018/08/22/0f8e89e840c4d900803f6925c823c270.png'
    }
  },


  onPullDownRefresh: function () {
    var page = getCurrentPages().pop()
    page.onLoad();
    wx.stopPullDownRefresh()
  }



})

// @author：张新源