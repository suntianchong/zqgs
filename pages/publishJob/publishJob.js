var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var utils = require('../../utils/util.js');
var that;
Page({


  data: {
    hasId:false,//进入页面是否传入参数
    id:'',
    companyLogo:'',
    showInputFarm:false,
    inputCompanyName:'请输入公司名称',
    inputJobName:'请输入职位名称',
    inputMailAddress:'请输入邮箱地址',
    resumeName:'姓名+岗位+学校+实习周期+职前公社小程序',
    jobSummary:'工作概要、申请要求及福利等工作概要等',
    remote:false,
    Immediate :true,
    workAddress:'请输入工作具体地址', 

    inputFarmTitle:'', 
    inputFarmPlaceholder:'', 
    jobTypeArray: ["运营", "产品", "技术", "设计", "职能", "市场"],
    jobTypeIndex:0,
    choseJobType:'请选择职位类型',

    cityTypeArray: ['北京', '上海', '广州', '深圳', '杭州', '其他'],
    cityTypeIndex: 0,
    choseCityType: '请选择城市',

    cycleTimeArray: ['三个月', '六个月', '九个月'],
    cycleTimeIndex: 0,
    choseCycleTime: '三个月',

    maxlength:-1

  },

  onLoad: function (options) {
    that=this;
    var cityIndex = options.cityIndex;
    that.setData({
      cityTypeIndex: cityIndex,
      choseCityType: that.data.cityTypeArray[cityIndex]
    })
    if(options.id){
      that.setData({
        hasId:true,
        id:options.id
      })
    }

    let current = Bmob.User.current();
    var currentUserId = current.objectId;
    const queryUser = Bmob.Query('_User');
    queryUser.get(currentUserId).then(res => {
      var isBlocked = res.isBlocked;
      console.log('isBlocked' + isBlocked)
      if (isBlocked == 1) {
        wx.showModal({
          title: '您已被禁言',
          showCancel: false,
          confirmText: '点击复制',
          content: '因您发布虚假或有害信息，管理员对您的账号实施了禁言操作，如有疑问请联系管理员微信17150318664，点击下方按钮复制微信号',
          success: function (res) {
            if (res.confirm) {
              wx.setClipboardData({
                data: '17150318664',
                success: function (res) {
                  wx.getClipboardData({
                    success: function (res) {
                      that.nextQuestion = setTimeout(function () { 
                        wx.navigateBack({
                          delta: 1
                        })
                      }, 2000);
                     
                    }
                  })
                }
              })
            }
          }
        })
      }
    }).catch(err => {
      console.log(err)
    })


    var id=options.id;
    const queryFind = Bmob.Query('job');
    //保证id为空时不报错
    if(id == null || id == undefined || id == "")
    {
      return false;
    }else{
      queryFind.get(id).then(res => {
        console.log(res)
        that.setData({
          inputCompanyName: res.companyName,
          inputJobName: res.jobName,
          choseJobType: res.jobType,
          choseCityType: res.city,
          remote: res.remoteInterview,
          Immediate: res.Immediate,
          choseCycleTime: res.workTime,
          inputMailAddress: res.emailAddress,
          resumeName: res.resumeName,
          workAddress: res.workAddress,
          jobSummary: res.jobDescription,
          companyLogo: res.companyLogo,
        })
      }).catch(err => {
        console.log(err)
      })
    }
  },


  onShow:function(){
    that.setData({
      inputCompanyName: getApp().globalData.companyName
    });
  },


  switch1Change:function(e){
    that.setData({
      remote: e.detail.value,
    });
  },


  switch2Change: function (e) {
    that.setData({
      Immediate: e.detail.value,
    });
  },


  choseJobType:function(e){
    var choseJobType = that.data.jobTypeArray[e.detail.value];
    that.setData({
      choseJobType: choseJobType,
      jobTypeIndex: e.detail.value
    });
  },

  choseCityType: function (e) {
    var choseCityType = that.data.cityTypeArray[e.detail.value];
    that.setData({
      choseCityType: choseCityType,
      cityTypeIndex: e.detail.value
    });
  },


  choseCycleTime: function (e) {
    var choseCycleTime = that.data.cycleTimeArray[e.detail.value];
    that.setData({
      choseCycleTime: choseCycleTime
    });
  },

  showInputFarm:function(e){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    var clickType = e.target.dataset.click;
    console.log(clickType)
    var inputFarmTitle;
    var inputFarmPlaceholder;
    if (clickType =='inputJobName'){
      that.setData({
        maxlength: 20,
      });
      var inputJobName = that.data.inputJobName
      inputFarmTitle='职位名称';
      inputFarmPlaceholder ='请输入职位名称';
      if (inputJobName =='请输入职位名称'){
        that.setData({
          inputFarmTitle: inputFarmTitle,
          inputFarmPlaceholder: inputFarmPlaceholder,
          showInputFarm: true,
          textareaValue: '' ,
        });
      }
      else{
        that.setData({
          inputFarmTitle: inputFarmTitle,
          inputFarmPlaceholder: inputFarmPlaceholder,
          showInputFarm: true,
          textareaValue: inputJobName
        });
      }
    }
    else if (clickType == 'inputMailAddress') {
      that.setData({
        maxlength: -1,
      });
      var inputMailAddress = that.data.inputMailAddress
      inputFarmTitle = '投递邮箱';
      inputFarmPlaceholder = '请输入投递邮箱地址';
      if (inputMailAddress == '请输入邮箱地址') {
        that.setData({
          inputFarmTitle: inputFarmTitle,
          inputFarmPlaceholder: inputFarmPlaceholder,
          showInputFarm: true,
          textareaValue: ''
        });
      }
      else{
        that.setData({
          inputFarmTitle: inputFarmTitle,
          inputFarmPlaceholder: inputFarmPlaceholder,
          showInputFarm: true,
          textareaValue: inputMailAddress
        });
      }
    }
    else if (clickType == 'resumeName') {
      that.setData({
        maxlength: -1,
      });
      var resumeName = that.data.resumeName
      inputFarmTitle = '简历命名';
      inputFarmPlaceholder = '如：姓名+岗位+学校+实习周期+职前公社小程序';
      if (resumeName == '姓名+岗位+学校+实习周期+职前公社小程序') {
        that.setData({
          inputFarmTitle: inputFarmTitle,
          inputFarmPlaceholder: inputFarmPlaceholder,
          showInputFarm: true,
          textareaValue: '姓名+岗位+学校+实习周期+职前公社小程序'
        });
      }
      else{
        that.setData({
          inputFarmTitle: inputFarmTitle,
          inputFarmPlaceholder: inputFarmPlaceholder,
          showInputFarm: true,
          textareaValue: resumeName
        });
      }
    }
    else if (clickType == 'workAddress') {
      that.setData({
        maxlength: -1,
      });
      var workAddress = that.data.workAddress
      inputFarmTitle = '工作地址';
      inputFarmPlaceholder = '请输入工作具体地址';
      if (workAddress == '请输入工作具体地址') {
        that.setData({
          inputFarmTitle: inputFarmTitle,
          inputFarmPlaceholder: inputFarmPlaceholder,
          showInputFarm: true,
          textareaValue: ''
        });
      }
      else{
        that.setData({
          inputFarmTitle: inputFarmTitle,
          inputFarmPlaceholder: inputFarmPlaceholder,
          showInputFarm: true,
          textareaValue: workAddress
        });
      }
    }
    else if (clickType == 'jobSummary') {
      that.setData({
        maxlength: -1,
      });
      var jobSummary = that.data.jobSummary
      inputFarmTitle = '职位描述';
      inputFarmPlaceholder = '工作概要、申请要求及福利等工作概要等';
      if (jobSummary == '工作概要、申请要求及福利等工作概要等') {
        that.setData({
          inputFarmTitle: inputFarmTitle,
          inputFarmPlaceholder: inputFarmPlaceholder,
          showInputFarm: true,
          textareaValue: ''
        });
      }
      else {
        that.setData({
          inputFarmTitle: inputFarmTitle,
          inputFarmPlaceholder: inputFarmPlaceholder,
          showInputFarm: true,
          textareaValue: jobSummary
        });
      }
    }
  },



  inputFrame:function(e){
    var inputFarmTitle = that.data.inputFarmTitle;
    console.log(e.detail.value)
    if (inputFarmTitle == '职位名称') {
      if (e.detail.value.length == 20) {
        console.log("超过了")
        wx.showToast({
          title: '最多输入20个字',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },


  bindTextAreaInput:function(e){
    var inputTextArea = e.detail.value;
    console.log(inputTextArea)
    var inputFarmTitle = that.data.inputFarmTitle;
    if (inputFarmTitle == '职位名称') {
      that.setData({
        inputJobName: inputTextArea,
      });
    }
    else if (inputFarmTitle == '投递邮箱') {
      that.setData({
        inputMailAddress: inputTextArea,
      });
    }
    else if (inputFarmTitle == '简历命名') {
      that.setData({
        resumeName: inputTextArea,
      });
    }
    else if (inputFarmTitle == '工作地址') {
      that.setData({
        workAddress: inputTextArea,
      });
    }
    else if (inputFarmTitle == '职位描述') {
      that.setData({
        jobSummary: inputTextArea,
      });
    }
  },

  clearInput:function(){
      that.setData({
        textareaValue: ''
      });
  },

  inputFinish:function(){
    that.setData({
      showInputFarm: false,
    });
  },

  closeInputFarm:function(){
    that.setData({
      inputFarmTitle: '',
      inputFarmPlaceholder: '',
      showInputFarm: false,
    });
  },

  inputCompany:function(){
    wx.navigateTo({
      url: '../searchCompany/searchCompany?source=publishJob'
    })
  },

  jobSummary:function(e){
    that.setData({
      jobSummary: e.detail.value,
    });
  },

  submit:function(){
    var publishTime = utils.getNowDay();
    var inputCompanyName=that.data. inputCompanyName;
    var inputJobName = that.data.inputJobName;
    var choseJobType = that.data.choseJobType;
    var choseCityType = that.data.choseCityType;
    var choseCycleTime = that.data.choseCycleTime;
    var inputMailAddress = that.data.inputMailAddress;
    var resumeName = that.data.resumeName;
    var jobSummary = that.data.jobSummary;
    var remote = that.data.remote;
    var Immediate = that.data.Immediate;
    var workAddress = that.data.workAddress;
    console.log(inputCompanyName);
    console.log(inputJobName);
    console.log(choseJobType);
    console.log(choseCityType);
    console.log(remote);
    console.log(Immediate);
    console.log(choseCycleTime);
    console.log(inputMailAddress);
    console.log(resumeName);
    console.log(jobSummary);
    let current = Bmob.User.current();
    var currentUserId = current.objectId;
    const pointer = Bmob.Pointer('_User')
    const poiID = pointer.set(currentUserId)
    if (inputCompanyName == '请输入公司名称') {
      wx.showToast({
        title: '请输入公司名称',
        icon: 'none',
        duration: 2000
      })
    }

    else if (inputJobName == '请输入职位名称') {
      wx.showToast({
        title: '请输入职位名称',
        icon: 'none',
        duration: 2000
      })
    } 

    else if (choseJobType == '请选择职位类型') {
      wx.showToast({
        title: '请选择职位类型',
        icon: 'none',
        duration: 2000
      })
    }
    else if (choseCityType == '请选择城市') {
      wx.showToast({
        title: '请选择城市',
        icon: 'none',
        duration: 2000
      })
    }
    else if (inputMailAddress =='请输入邮箱地址'){
      wx.showToast({
        title: '请输入投递邮箱地址',
        icon: 'none',
        duration: 2000
      })
    }
    else if (workAddress == '请输入工作具体地址') {
      wx.showToast({
        title: '请输入工作具体地址',
        icon: 'none',
        duration: 2000
      })
    }
    else if (jobSummary == '工作概要、申请要求及福利等工作概要等') {
      wx.showToast({
        title: '请输入职位描述',
        icon: 'none',
        duration: 2000
      })
    }
    else{
      //邮箱规范验证
      // var mailReg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
      // if (!mailReg.test(inputMailAddress)) {
      //   wx.showToast({
      //     title: '邮箱地址不符合规范',
      //     icon: 'none',
      //     duration: 2000
      //   })
      //   return false;
      // }
      if(!that.data.hasId){
        //执行添加
        wx.showLoading({
          title: '获取信息中',
        })
        const queryJob = Bmob.Query('job');
        queryJob.set('publisher', poiID)
        queryJob.set("companyName", getApp().globalData.companyName);
        queryJob.set("companyLogo", getApp().globalData.companyLogo);
        queryJob.set("jobName", inputJobName);
        queryJob.set("jobType", choseJobType);
        queryJob.set("city", choseCityType);
        queryJob.set("remoteInterview", remote);
        queryJob.set("Immediate", Immediate);
        queryJob.set("workTime", choseCycleTime);
        queryJob.set("emailAddress", inputMailAddress);
        queryJob.set("resumeName", resumeName);
        queryJob.set("jobDescription", jobSummary);
        queryJob.set("workAddress", workAddress);
        queryJob.set("top", "0");
        queryJob.set("publishTime", publishTime);
        queryJob.set("del_flag", '0');
        queryJob.set("searchContent", choseJobType + inputJobName + getApp().globalData.companyName);

        queryJob.save().then(res => {
          console.log(res)
          console.log("city" + choseCityType);
          wx.hideLoading();
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 2000
          })

          var workCityCache = new Object;
          workCityCache.city = choseCityType;
          workCityCache.index = that.data.cityTypeIndex;
          wx.setStorageSync('workCityCache', workCityCache)


          var workJobTypeCache = new Object;
          workJobTypeCache.choseItemList = [];
          workJobTypeCache.itemListIndex = [0, 0, 0, 0, 0, 0];
          wx.setStorageSync('workJobTypeCache', workJobTypeCache)
 
  
          getApp().globalData.refreshWork=1;
          getApp().globalData.companyName = '请输入公司名称';
          getApp().globalData.companyLogo = '';
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000);
        }).catch(err => {
          console.log(err)
        })
      }else{
        //执行编辑
        wx.showLoading({
          title: '获取信息中',
        })
        const queryUpdata = Bmob.Query('job');
        queryUpdata.get(that.data.id).then(res => {
          console.log(res)
          res.set('publisher', poiID)
          res.set("companyName",that.data.inputCompanyName);
          res.set("companyLogo", that.data.companyLogo);
          res.set("jobName", inputJobName);
          res.set("jobType", choseJobType);
          res.set("city", choseCityType);
          res.set("remoteInterview", remote);
          res.set("Immediate", Immediate);
          res.set("workTime", choseCycleTime);
          res.set("emailAddress", inputMailAddress);
          res.set("resumeName", resumeName);
          res.set("jobDescription", jobSummary);
          res.set("workAddress", workAddress);
          res.set("top", "0");
          res.set("publishTime", publishTime);
          res.set("del_flag", '0');
          res.set("searchContent", choseJobType + inputJobName + that.data.inputCompanyName);
          res.save().then(ress=> {
            console.log(ress)
            console.log("city" + choseCityType);
            wx.hideLoading();
            wx.showToast({
              title: '编辑成功',
              icon: 'success',
              duration: 2000
            })


            var workCityCache = new Object;
            workCityCache.city = choseCityType;
            workCityCache.index = that.data.cityTypeIndex;
            wx.setStorageSync('workCityCache', workCityCache)


            var workJobTypeCache = new Object;
            workJobTypeCache.choseItemList = [];
            workJobTypeCache.itemListIndex = [0, 0, 0, 0, 0, 0];
            wx.setStorageSync('workJobTypeCache', workJobTypeCache)


            getApp().globalData.refreshWork = 1;
            getApp().globalData.companyName = '请输入公司名称';
            getApp().globalData.companyLogo = '';
            setTimeout(function () {
              wx.switchTab({
                url: '../work/work'
              });
            }, 1000);
          }).catch(err => {
            console.log(err)
          })
        }).catch(err => {
          console.log(err)
        })
      }
    }
  },
 
  onShareAppMessage: function () {
  
  },

  onUnload: function () {
    getApp().globalData.companyName = '请输入公司名称';
    getApp().globalData.companyLogo = '';
  },
})