import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define the structure of a single product
export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
}

// Define the structure of the products state
interface ProductState {
  products: Product[];    
  wishlist: number[];     
  loading: boolean;       
  error: string | null;  
  hasMore: boolean; 
}

// Initial state for the product slice
const initialState: ProductState = {
  products: [],
  wishlist: [],
  loading: false,
  error: null,
  hasMore: true,
};

/**
 * Async thunk to fetch products from API.
 * Simulates pagination using a `page` param.
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (page: number) => {
    const res = await fetch(`https://fakestoreapi.com/products?limit=10&page=${page}`);
    if (!res.ok) throw new Error('Failed to load products');
    return await res.json();
  }
);

// Create a slice for product-related state and reducers
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    /**
     * Add or remove a product ID from the wishlist.
     */
    toggleWishlist: (state, action: PayloadAction<number>) => {
      const index = state.wishlist.indexOf(action.payload);
      if (index > -1) {
        // If product is already in wishlist, remove it
        state.wishlist.splice(index, 1);
      } else {
        // If not in wishlist, add it
        state.wishlist.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle loading state before fetch begins
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle successful fetch
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.length === 0) {
          // No more products to fetch
          state.hasMore = false;
        } else {
          // Append fetched products to existing list
          state.products = [...state.products, ...action.payload];
        }
      })
      // Handle errors during fetch
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error';
      });
  },
});

// Export action to use in components (e.g., toggle wishlist)
export const { toggleWishlist } = productSlice.actions;

// Export reducer to include in Redux store
export default productSlice.reducer;
