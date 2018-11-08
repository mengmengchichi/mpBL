// components/city/city.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    citys: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollTop: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    console() {
      console.log(this.data.citys)
    },
    goThere(e) {
      console.log(e);
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
      console.log(scrollList)
      const count = scrollList.reduce((result, current) => {
        result += current.city_list.length;
        return result;
      }, 0);
      console.log(count);
      const newScroll = 23 * scrollList.length + 45 * count + start;
      this.setData({
        scrollTop: newScroll
      })
      console.log(this.data.scrollTop);
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
