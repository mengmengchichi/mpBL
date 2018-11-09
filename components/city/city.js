// components/city/city.js
import ajax from '../../utils/ajax.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    citys: Object,
    selectCity: null,
    cityId: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollTop: 0,
  },
  ready: function () {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    
    selectCity: function (e) {
      let myEventDetail = {};
      ajax.get(`https://show.bilibili.com/api/ticket/project/listV2?version=133&page=1&pagesize=20&platform=web&area=${e.currentTarget.dataset.id}&p_type=%E5%85%A8%E9%83%A8%E7%B1%BB%E5%9E%8B`)
          .then(res => {
            myEventDetail = {
              list: res.data.data.result,
              page: res.data.data.page,
              numPages: res.data.data.numPages,
              name: e.currentTarget.dataset.name,
              id: e.currentTarget.dataset.id
            };
            this.triggerEvent('myevent', myEventDetail)
          })
          .catch(err => {
            myEventDetail = err;
            this.triggerEvent('myevent', myEventDetail)
          }) 
    },
    console() {
      console.log(this.data);
    },
    goThere(e) {
      if (e.currentTarget.dataset.letter === 'all') {
        this.setData({
          scrollTop: 0
        })
        return;
      } else if (e.currentTarget.dataset.letter === 'hot') {
        this.setData({
          scrollTop: 50
        })
        return;
      }
      const start = 283;
      const scrollNum = this.data.citys.list.reduce((result, current, index) => {
        if (current.letter === e.currentTarget.dataset.letter) {
          result += index;
        }
        return result;
      }, 0);
      let scrollList = this.data.citys.list.filter((item, index) => {
        return index < scrollNum;
      })
      const count = scrollList.reduce((result, current) => {
        result += current.city_list.length;
        return result;
      }, 0);
      const newScroll = 23 * scrollList.length + 45 * count + start;
      this.setData({
        scrollTop: newScroll
      })
      wx.showToast({
        title: e.currentTarget.dataset.letter,
        icon: 'none',
        duration: 500,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  }
})
