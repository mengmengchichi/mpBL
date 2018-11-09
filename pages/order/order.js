// pages/order/order.js
import store from '../../store/reducers/index.js';
import ajax from '../../utils/ajax.js';
import { CHECK_CHANGE, ADD_COUNT, REDUCE_COUNT, ALL_CHECKED, DELETE } from '../../store/actions/cartAction.js';


const app = getApp();
console.log(app.globalData);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    isAllChecked: false,
    totalPrice: 0,
    totalCount: 2,
    hasChecked: false,
    showDel: false,
    delId: '',
    shouldDel: false
  },
  abandon() {
    this.setData({
      showDel: false
    })
  },
  deleted() {
    const action = DELETE({
      id: this.data.delId
    })

    this.setData({
      ...this.data,
      showDel: false,
      shouldDel:true
    });
    
    store.dispatch(action)
  },
  balance(e) {
    console.log(e);
    if (!e.currentTarget.dataset.abled) {
      wx.showToast({
        title: '请先选择要结算的商品',
        duration: 1500,
        icon: 'none',
        mask: true,
      })
    } else {
      wx.showToast({
        title: '谢谢各位友情赞助~',
        icon: 'none',
        duration: 2000
      })
    }
  },
  hasChecked() {
    const newStore = store.getState().cart.cart;
    if (newStore.some(item => item.checked === true)) {
      this.setData({
        ...this.data,
        hasChecked: true
      })
    } else {
      this.setData({
        ...this.data,
        hasChecked: false
      })
    }
  },
  getTotalPrice() {
    const totalPrice = this.data.cartList.reduce((result, current) => {
      if (current.checked) {
        result += (current.data.market_price_low / 100) * current.count;
      }
      return result;
    }, 0)
    this.setData({
      ...this.data,
      totalPrice
    })
  },
  getTotalCount() {
    let totalCount = this.data.cartList.reduce((result, current) => {
      if (current.checked) {
        result += current.count;
      }
      return result;
    }, 0)
    this.setData({
      totalCount: totalCount
    })
  },
  checkboxChange(e) {
    const id = e.currentTarget.dataset.id;
    
    store.dispatch(CHECK_CHANGE({
      id
    }));
  },
  allChecked() {
    this.setData({
      ...this.data,
      isAllChecked: !this.data.isAllChecked
    },() => {
      const action = ALL_CHECKED({
        isAllChecked: this.data.isAllChecked
      });
      store.dispatch(action);
      this.hasChecked();
      const newData = this.data.cartList.map(item => {
        item.checked = this.data.isAllChecked;
        return item;
      });
      this.setData({
        ...this.data,
        cartList: newData,
      })
    });
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  reduceCount(e) {


    // if (!this.data.redChecked) {
    //   this.setData({
    //     ...this.data,
    //     redChecked: true
    //   }, () => {
    //     if (this.data.redChecked) {
    //       this.checkboxChange(e)
    //     }
    //   });
    // }
    
    const id = e.currentTarget.dataset.id;
    const action = REDUCE_COUNT({
      id
    });
  
    

    this.setData({
      ...this.data,
      delId: id,
      showDel: this.data.cartList.some(item => {
        if (item.data.id === id) {
          return item.count === 1
        } else {
          return false;
        }
      }),
      cartList: this.data.cartList.map(item => {
        if (item.data.id === id) {
          if (item.count > 1) {
            item.count -= 1
          } 
          if (item.checked) {
            item.redChecked = !item.checked;
          } 
        }
        return item
      })
    }, () => {
      this.getTotalCount();
      this.getTotalPrice();
      return;
      const redChecked = this.data.cartList.filter(item => item.data.id === id)[0].redChecked;
      
      if (redChecked) {
        this.checkboxChange(e);
        const newCart = this.data.cartList.map(item => {
          if (item.data.id === id) {
            item.redChecked = !redChecked;
          }
          return item;
        });
        this.setData({
          ...this.data,
          cartList: newCart
        });
      }
    });
    const count = this.data.cartList.reduce((result, current) => {
      result += current.count;
      return result;
    }, 0);
    wx.setTabBarBadge({
      index: 2,
      text: count.toString(),
    })
    store.dispatch(action);
  },
  addCount(e) {
    // this.setData({
    //   ...this.data,
    //   addChecked: true
    // }, () => {
    //   if (this.data.addChecked) {
    //     this.checkboxChange(e)
    //     this.setData({
    //       ...this.data,
    //       addChecked: false
    //     })
    //   }
    // })
    const id = e.currentTarget.dataset.id;
    const action = ADD_COUNT({
      id
    });
    this.setData({
      ...this.data,
      cartList: this.data.cartList.map(item => {
        if (item.data.id === id) {
          item.count += 1;
          if (item.checked) {
            item.redChecked = !item.checked;
          } 
        }
        return item
      })
    }, () => {
      this.getTotalCount();
      this.getTotalPrice();
      const redChecked = this.data.cartList.filter(item => item.data.id === id)[0].redChecked;
      if (redChecked) {
        this.checkboxChange(e);
        const newCart = this.data.cartList.map(item => {
          if (item.data.id === id) {
            item.redChecked = redChecked;
          }
          return item;
        });
        this.setData({
          ...this.data,
          cartList: newCart
        });
      }
    });
    const count = this.data.cartList.reduce((result, current) => {
      result += current.count;
      return result;
    }, 0);
    wx.setTabBarBadge({
      index: 2,
      text: count.toString(),
    })

    store.dispatch(action);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    store.subscribe(() => {
      const newStore = store.getState().cart.cart;
      this.hasChecked();

      if (this.data.shouldDel) {
        const newCart = this.data.cartList.filter(item => {
          return item.data.id !== this.data.delId;
        });
        this.setData({
          ...this.data,
          cartList: newCart,
          shouldDel: false
        });
      }
      const newData = this.data.cartList.map(item => {
        newStore.forEach(sItem => {
          if (sItem.id === item.data.id) {
            item.checked = sItem.checked;
          }
        })
        return item;
      });
      let isAllChecked = 0;
      if (newStore.every(item => item.checked === true)) {
        isAllChecked = true;
      } else {
        isAllChecked = false;
      }
      this.setData({
        ...this.data,
        cartList: newData,
        isAllChecked,
        addChecked: !this.data.addChecked,
        redChecked: !this.data.redChecked
      }, () => {
        this.getTotalCount();
        this.getTotalPrice();
      })
    });



    wx.setNavigationBarTitle({
      title: '订单',
    })
    const list = store.getState().cart.cart;
    this.hasChecked();
    const count = list.reduce((result, current) => {
      result += current.count;
      return result;
    }, 0);
    let isAllChecked = 0;
    if (list.every(item => item.checked === true)) {
      isAllChecked = true;
    } else {
      isAllChecked = false;
    }
    this.setData({
      ...this.data,
      isAllChecked
    });
    wx.setTabBarBadge({
      index: 2,
      text: count.toString(),
    })
    list.forEach((item, index) => {
      ajax.get(`https://show.bilibili.com/api/ticket/project/get?version=133&id=${item.id}`)
        .then(res => {
          this.setData({
            cartList: this.data.cartList.concat({
              data: res.data.data,
              count: item.count,
              checked: item.checked
            })
          }, () => {
            this.getTotalCount();
            this.getTotalPrice();
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