import { createStore, combineReducers } from '../../libs/redux.js';
import cart from './cart.js';

const rootReducer = combineReducers({
  cart
})
export default createStore(rootReducer);