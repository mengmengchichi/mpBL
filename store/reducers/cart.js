const initState = {
  cart: wx.getStorageSync('cart') || [],
}
export default (state = initState, action) => {
  switch(action.type) {
    case 'ADD_CART':
      const isInCart = state.cart.some(item => item.id === action.data.id);
      if (isInCart) {
        state.cart.map(item => {
          if (item.id === action.data.id) {
            item.count += action.data.count;
          }
          return item
        })
      } else {
        state.cart.push({
          id: action.data.id,
          count: action.data.count,
        })
      }
      wx.setStorageSync('cart', state);
      console.log(state);
      return state;
    case 'ADD_COUNT':
      const incData = state.cart.map(item => {
        if (item.id === action.data.id) {
          item.count += 1
        }
        //console.log(item.count);
        return item;
      })
      return {
        ...state,
        cart: incData
      };
    case 'REDUCE_COUNT':
      const redData = state.data.map(item => {
        if (item.id === action.payload.id) {
          item.count -= 1;
          if (item.count < 1) {
            item.count = 1;
          }
        }
        return item;
      })
      return {
        ...state,
        cart: redData
      }                
    default:
      return state;
  }
}