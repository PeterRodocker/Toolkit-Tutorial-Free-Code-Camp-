import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// import cartItems from '../../cartItems';

const url = 'https://course-api.com/react-useReducer-cart-project';

// export const getCartItems = createAsyncThunk('cart/getCartItems', () => {
//   return fetch(url)
//     .then((res) => res.json())
//     .catch((err) => console.log(err))
// })

export const getCartItems = createAsyncThunk('cart/getCartItems', 
  async (_Name, thunkAPI) => {
    try {
      
      console.log('thunkAPI', thunkAPI.getState());
      const res = await axios(url);
      return res.data;
    } catch(err) {
      return thunkAPI.rejectWithValue('There was an error...')
    }
  }
);

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => 
      item.id !== itemId);
    },
    increase: (state, action) => {
      const cartItem = state.cartItems.find((item) => 
      item.id === action.payload);
      cartItem.amount++;
    },
    decrease: (state, action) => {
      const cartItem = state.cartItems.find((item) => 
      item.id === action.payload);
      cartItem.amount--;
    },
    calculateTotals: (state) => {
      // cart amount & total
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        // totalAmount += singleItemAmount
        amount += item.amount;
        // totalTotal += singleItemTotal
        total += item.amount * item.price 
      });
      // state.amount = cartAmount
      state.amount = amount;
      // state.total = cartTotal
      state.total = total;
    }
  },
  extraReducers: {
    [getCartItems.pending]: (state) => {
      state.isLoading = true;
    },
    [getCartItems.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload;
    },
    [getCartItems.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});


export const { calculateTotals, clearCart, decrease, increase, removeItem } = cartSlice.actions;
export default cartSlice.reducer;