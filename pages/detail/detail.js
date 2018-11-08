// pages/detail/detail.js
import ajax from "../../utils/ajax.js";
import store from '../../store/reducers/index.js';
import { ADD_CART, ADD_COUNT, REDUCE_COUNT } from "../../store/actions/cartAction.js";
import cart from '../../store/reducers/cart.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    showAloneModal: false,
    count: 1,
    checked: false
  },
  click(e) {
    const newScreen = this.data.detail.screen_list.map(item => {
      if (item.id === e.currentTarget.dataset.id) {
        item.checked = true;
      } else {
        item.checked = false;
      }
      return item;
    })
    this.setData({
      ...this.data,
      detail: {
        ...this.data.detail,
        screen_list: newScreen
      }
    }, () => console.log(this.data.detail))
  },
  catch(e) {
    const newTicket = this.data.detail.screen_list[0].ticket_list.map(item => {
      if (item.id === e.currentTarget.dataset.id) {
        item.checked = true;
      } else {
        item.checked = false;
      }
      return item;
    })
    this.setData({
      ...this.data,
      detail: {
        ...this.data.detail,
        screen_list: this.data.detail.screen_list.map(item => {
          item.ticket_list = newTicket;
          return item;
        })
      }
    })
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  buyAlone() {
    this.setData({
      showAloneModal: true,
    })
  },
  cancelModal() {
    this.setData({
      showAloneModal: false,
    })
  },
  addCart() {
    const action = ADD_CART({
      id: this.data.detail.id,
      count: this.data.count
    });

    store.dispatch(action);
    
    wx.switchTab({
      url: '../order/order',
    })
  },
  reduceCount() { 
    if (this.data.count > 1) {
      this.setData({
        count: this.data.count - 1
      })
    }
  },
  addCount() { 
    if (this.data.count < 100) {
      this.setData({
        count: this.data.count + 1
      })
    }
  },
  // reduceCount() {
  //   const action = REDUCE_COUNT({
  //     id: this.data.detail.id,
  //     count: 1
  //   })
  //   store.dispatch(action);
  // },
  // addCount() {
  //   const action = ADD_COUNT({
  //     id: this.data.detail.id,
  //     count: 1
  //   })
  //   store.dispatch(action);
  // },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    ajax.get(`https://show.bilibili.com/api/ticket/project/get?version=133&id=${options.id}`)
      .then(res => {
        
        res.data.data.screen_list.map((item, index) => {
          if (index === 0) {
            item.checked = true;
          } else {
            item.checked = false;
          }
          return item;
        });
        res.data.data.screen_list[0].ticket_list.map((item, index) => {
          if (index === 0) {
            item.checked = true;
          } else {
            item.checked = false;
          }
          return item;
        });
        
        this.setData({
          ...this.data,
          detail: res.data.data
        })
      })
      .catch(err => {
        console.log(err)
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