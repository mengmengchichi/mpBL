export default {
  get: (url) => {
    return new Promise((resolve,reject) => {
      wx.showLoading({
        title: '加载中...',
      })
      wx.request({
        url,
        success: function(res) {
          resolve(res);
        },
        fail: function(res) {
          reject(res)
        },
        complete: function(res) {
          wx.hideLoading();
        },
      })
    })
  }
}