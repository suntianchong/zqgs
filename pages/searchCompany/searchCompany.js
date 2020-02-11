var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var app = getApp();
var that;
Page({

  
  data: {
    searchResult:[],
    searching:false,
    noSearchResult:false,
    inputCompany:'',
    source:''
  },

 
  onLoad: function (options) {
    that=this;
    var source = options.source;
    that.setData({
      source: source,
    });
  },

  inputCompany:function(e){
    if (!e.detail.value){
      console.log('123')
      that.setData({
        noSearchResult: false,
        searchResult: []
      });
    }
    else{
      that.setData({
        searching: true,
        noSearchResult: false,
      });
      var inputCompany = e.detail.value;
      const queryCompany = Bmob.Query("company");
      queryCompany.equalTo("name", "==", { "$regex": "" + inputCompany + ".*" });
      queryCompany.find().then(res => {
        console.log(res)
        if (res.length == 0 && e.detail.value) {
          console.log('111')
          that.setData({
            searching: false,
            noSearchResult: true,
          });
        }
        else if (res.length == 0 && !e.detail.value) {
          console.log('222')
          that.setData({
            searching: false,
            noSearchResult: false,
            searchResult: []
          });
        }
        else {
          that.setData({
            searching: false,
            searchResult: res,
          });
        }

      });
    }
  },



  choseCompany:function(e){
    var index = e.currentTarget.dataset.index;
    var source = that.data.source;
    console.log(source)
    if (source =='publishJob'){
      getApp().globalData.companyName = that.data.searchResult[index].name;
      getApp().globalData.companyLogo = that.data.searchResult[index].logo;
      wx.navigateBack({
        delta: 1
      })
    }
    else if (source == 'publishHouse1') {
      getApp().globalData.publishHouse.conmanyLabel.push(that.data.searchResult[index].name)
      wx.navigateBack({
        delta: 1
      })
    }
    else if (source == 'publishHouse2') {
      getApp().globalData.publishHouse2.conmanyLabel.push(that.data.searchResult[index].name)
      wx.navigateBack({
        delta: 1
      })
    }
    
  },

  copy:function(){
    wx.setClipboardData({
      data: '17150318664',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
           
          }
        })
      }
    })
  }

  
})