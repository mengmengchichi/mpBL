// pages/detail/detail.js
import ajax from "../../utils/ajax.js";
import store from '../../store/reducers/index.js';
import { ADD_CART, ADD_COUNT, REDUCE_COUNT } from "../../store/actions/cartAction.js";
import cart from '../../store/reducers/cart.js';
import map from '../../libs/amap-wx.js';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    showAloneModal: false,
    count: 1,
    checked: false,
    markers: [],
    latitude: '',
    longitude: '',
    textData: {},
    showMap: false,
    collecting: wx.getStorageSync('collection') && wx.getStorageSync('collection').some(item => {
      return item === wx.getStorageSync('detail')
    }) || false,
  },
  collect() {
    const collection = wx.getStorageSync('collection') || [];
    this.setData({
      ...this.data,
      collecting: !this.data.collecting,
    }, () => {
      if (this.data.collecting) {
        const newCollection = collection.concat(this.data.detail.id)
        wx.setStorageSync("collection", newCollection);
      } else {
        const newCollection = collection.filter(item => item !== this.data.detail.id);
        wx.setStorageSync("collection", newCollection);
      }
    })
  },
  showMap(e) {
    let that = this;
    const myAmapFun = new map.AMapWX({ key: '054206922c07e78bf5b40cd006949173' });
    myAmapFun.getRegeo({
      location: e.currentTarget.dataset.coor,
      iconPath: "../../assets/imgs/marker.png",
      iconWidth: 22,
      iconHeight: 32,
      success: function (data) {
        var marker = [{
          id: data[0].id,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          iconPath: data[0].iconPath,
          width: data[0].width,
          height: data[0].height
        }]
        that.setData({
          markers: marker,
          showMap: true
        });
        that.setData({
          latitude: data[0].latitude
        });
        that.setData({
          longitude: data[0].longitude
        });
        that.setData({
          textData: {
            name: data[0].name,
            desc: data[0].desc
          }
        })
      }
    })
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
    })
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
    this.setData({
      showMap: false
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
    if (options.id) {
      wx.setStorageSync('detail', options.id);
    }
    const id = options.id || wx.getStorageSync('detail');
    ajax.get(`https://show.bilibili.com/api/ticket/project/get?version=133&id=${id}`)
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