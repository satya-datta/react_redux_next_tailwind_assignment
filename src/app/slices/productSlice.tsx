import { createSlice, createAsyncThunk, nanoid, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Product } from '../../types/product';
import { _NEVER } from '@reduxjs/toolkit/query';

// Async actions to handle API calls
export const fetchProducts = createAsyncThunk('products/fetch', async () => {
    const response = await axios.get('https://fakestoreapi.com/products');
    return response.data;
  });
  
export const addProduct = createAsyncThunk('products/add', async (newProduct:Product) => {
  const response = await axios.post('https://fakestoreapi.com/products', newProduct);
  return response.data;
});

export const updateProduct = createAsyncThunk(
  'products/update',
  async (params: { id: number; updatedProduct: any }) => {
    const { id, updatedProduct } = params;
    const response = await axios.put(`https://fakestoreapi.com/products/${id}`, updatedProduct);
    return response.data;
  }
);


export const deleteProduct = createAsyncThunk('products/delete', async (id :string) => {
  await axios.delete(`https://fakestoreapi.com/products/${id}`);
  return id;
});

interface ProductState {
  items: Product[]; // Define the items as an array of Product
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: boolean;
}

const initialState: ProductState = {
  items: [],
  status: 'idle',
  error: false,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  extraReducers: (builder) => {
    builder
      // Handle fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = 'failed';
        state.error=true
      })

      // Handle addProduct
      .addCase(addProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product, string, { arg: Product; requestId: string; requestStatus: "fulfilled"; }, never>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addProduct.rejected, (state) => {
        state.status = 'failed';
      })

      // // Handle updateProduct
      // .addCase(updateProduct.pending, (state) => {
      //   state.status = 'loading';
      // })
      // .addCase(updateProduct.fulfilled, (state, action) => {
      //   state.status = 'succeeded';
      //   const index = state.items.findIndex(product => product.id === action.payload.id);
      //   if (index !== -1) {
      //     state.items[index] = action.payload;
      //   }
      // })
      // .addCase(updateProduct.rejected, (state) => {
      //   state.status = 'failed';
      // })

      // Handle deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Assuming 'id' is of type string or number in your Product type
        state.items = state.items.filter((product: Product) => String(product.id) !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.status = 'failed';
      });
  },
  reducers: {}
});

export default productSlice.reducer;
