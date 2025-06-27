// store/slices/productsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Product model
export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
}

// State model
interface ProductState {
  products: Product[];
  wishlist: number[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

// Initial state
const initialState: ProductState = {
  products: [],
  wishlist: [],
  loading: false,
  error: null,
  hasMore: true,
};

// Thunk to fetch products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (page: number) => {
    const res = await fetch(`https://fakestoreapi.com/products?limit=10`);
    if (!res.ok) throw new Error('Failed to load products');
    return await res.json();
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<number>) => {
      const index = state.wishlist.indexOf(action.payload);
      if (index > -1) {
        state.wishlist.splice(index, 1);
      } else {
        state.wishlist.push(action.payload);
      }
    },
    resetProducts: (state) => {
      state.products = [];
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.length === 0) {
          state.hasMore = false;
        } else {
          state.products = [...state.products, ...action.payload];
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const { toggleWishlist, resetProducts } = productSlice.actions;
export default productSlice.reducer;
