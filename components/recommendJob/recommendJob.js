var Bmob = require('../../dist/Bmob-1.6.1.min.js');
// components/recommendJob/recommendJob.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  ready() {
    console.log('组建创建')
    this.getList(1);
  },
  /**
   * 组件的初始数据
   */
  data: {
    goodJob:[],
    showLoading:false,
    page:1,
  },
 
  
  /**
   * 组件的方法列表
   */
  methods: {
    //获取热门职位的公用方法
    getList(page) {
      this.setData({
        showLoading: true,
      })
      let that = this;
      const query = Bmob.Query("job");
      query.equalTo("high_quality", "==", "1");
      query.skip((page-1)*4);
      query.limit(4);
      query.order("-createdAt");
      query.find().then(res => {
        console.log(res)
        
        setTimeout(() => {
          that.setData({
            goodJob: res,
            showLoading: false
          })
        },400)
        //数据不够，恢复第一页数据
        if(res.length <= 3){
          that.setData({
            page: 1
          })
        }
      });
    },
    //换一批的
    nextJob() {
      this.setData({
        page: ++this.data.page
      })
      console.log(this.data.page)
      this.getList(this.data.page)
    },
    //进入详情
    toDetail(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/details/details?id=${id}` + "&shared=true",
      })
    },
    //查看更多
    toMore(){
      wx.switchTab({
        url: '/pages/work/work',
      })
    }
  }
})
