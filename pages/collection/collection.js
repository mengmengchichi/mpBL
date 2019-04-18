// pages/collection/collection.js
import ajax from "../../utils/ajax.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collection: [],
    hasCollection: false,
    localId: [],
    isShowCity: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ "title": "收藏" });
    const collection = wx.getStorageSync('collection') || [];
    if (collection.length !== 0) {
      this.setData({
        hasCollection: true
      })
    }
    collection.forEach(item => {
      ajax.get(`https://show.bilibili.com/api/ticket/project/get?version=133&id=${item}`)
        .then(res => {
          this.setData({
            ...this.data,
            collection: this.data.collection.concat(res.data.data)
          })
        })
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})