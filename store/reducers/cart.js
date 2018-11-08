const initState = {
  cart: wx.getStorageSync('cart') || [],
}
export default (state = initState, action) => {
  switch(action.type) {
    case 'ADD_CART':
      const isInCart = state.cart.some(item => item.id === action.data.id);
      let newData = [];
      if (isInCart) {
        newData = state.cart.map(item => {
          if (item.id === action.data.id) {
            item.count += action.data.count;
          }
          return item
        })
      } else {
        newData = state.cart.concat({
          id: action.data.id,
          count: action.data.count,
          checked: false
        })
      }
      console.log(newData);
      wx.setStorageSync('cart', newData);
      return Object.assign({}, state, {
        cart: newData
      });
    case 'ADD_COUNT':
      const incData = state.cart.map(item => {
        if (item.id === action.data.id) {
          item.count += 1
        }
        //console.log(item.count);
        return item;
      })
      wx.setStorageSync('cart', incData);
      return {
        ...state,
        cart: incData
      };
    case 'REDUCE_COUNT':
      const redData = state.cart.map(item => {
        if (item.id === action.data.id) {
          item.count -= 1;
          if (item.count < 1) {
            item.count = 1;
          }
        }
        return item;
      })
      wx.setStorageSync('cart', redData);
      return {
        ...state,
        cart: redData
      }
    case 'CHECK_CHANGE':
      let cheData = state.cart.map(item => {
        if (item.id === action.data.id) {
          item.checked = !item.checked;
        }
        return item;
      });
      wx.setStorageSync('cart', cheData);
      return {
        ...state,
        cart: cheData
      }
    case "ALL_CHECKED":
        const allData = state.cart.map(item => {
          item.checked = action.data.isAllChecked;
          return item;
        });
        wx.setStorageSync('cart', allData);
        return {
          ...state,
          cart: allData
        }
    default:
      return state;
  }
}