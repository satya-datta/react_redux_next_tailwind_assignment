import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import { useDispatch } from 'react-redux';

const store = configureStore({
  reducer: {
    products: productReducer,
  },
});
export type AppDispatch = typeof store.dispatch;

// Export the customized hook for use in components
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;


