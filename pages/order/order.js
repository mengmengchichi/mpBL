// pages/order/order.js
import store from '../../store/reducers/index.js';
import ajax from '../../utils/ajax.js';
import { CHECK_CHANGE } from '../../store/actions/cartAction.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    cartStore: [],
    checkedList: [],
  },
  checkboxChange(e) {
    store.dispatch(CHECK_CHANGE({
      id: e.detail.value[0]
    }))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(store.getState())
    const list = store.getState().cart.cart.cart;
    console.log(list)
    list.forEach((item, index) => {
      ajax.get(`https://show.bilibili.com/api/ticket/project/get?version=133&id=${item.id}`)
        .then(res => {
          this.setData({
            cartList: this.data.cartList.concat({
              data: res.data.data,
              count: item.count
            })
          }, () => {
            console.log(this.data.cartList);
          })
        })
        .catch(err => {
          console.log(err);
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