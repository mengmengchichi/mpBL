// pages/activity/activity.js
import ajax from "../../utils/ajax.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:[],
    list: [],
    page: 1,
    selectionFixed: '',
    isShowCity: false,
    active: ['','',''], 
    numPages: 0,
    citys: {}
  },

  selectCity() {
    this.setData({
      ...this.data,
      isShowCity: !this.data.isShowCity,
      active: this.data.active.map((item, index) => {
        console.log(this.data.isShowCity)
        if (!this.data.isShowCity) {
          if (index === 0) {
            item = 'active';
          }
        } else {
          if (index === 0) {
            item = '';
          }
        }
        return item
      })
    })
  },
  
  toDetail(e) {
    console.log(e);
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({"title": "哔哩哔哩会员购"});
    ajax.get('https://show.bilibili.com/api/ticket/banner/list?district_id=0&position=1&sub_position=0')
      .then((res) => {
        this.setData({
          banner: res.data.data
        })
        ajax.get('https://show.bilibili.com/api/ticket/project/listV2?version=133&page=1&pagesize=20&platform=web&area=-1&p_type=%E5%85%A8%E9%83%A8%E7%B1%BB%E5%9E%8B')
          .then((res) => {
            this.setData({
              list: res.data.data.result,
              page: ++this.data.page,
              numPages: res.data.data.numPages
            })
          })
      });
    ajax.get('https://show.bilibili.com/api/ticket/city/list?channel=3&city=-1')
      .then(res => {
        this.setData({
          ...this.data,
          citys: res.data.data
        })
        console.log(this.data.citys);
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  onPageScroll(obj) {
    if (obj.scrollTop >= 178) {
      this.setData({
        selectionFixed: 'fixed'
      })
    } else {
      this.setData({
        selectionFixed: ''
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('2');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.page === this.data.numPages) {
      return;
    }
    ajax.get(`https://show.bilibili.com/api/ticket/project/listV2?version=133&page=${this.data.page}&pagesize=20&platform=web&area=-1&p_type=%E5%85%A8%E9%83%A8%E7%B1%BB%E5%9E%8B`)
      .then(res => {
        this.setData({
          list: [...this.data.list, ...res.data.data.result],
          page: ++this.data.page
        })
      });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})