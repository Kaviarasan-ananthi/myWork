import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from './productsSlice';

// Define the structure of a cart item, extending from the Product interface
interface CartItem extends Product {
  quantity: number; // quantity of that item in cart
}

// Define the overall cart state structure
interface CartState {
  items: CartItem[];       // list of items in the cart
  totalAmount: number;     // total price of all items
}

// Initial state for the cart
const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

// Create the cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Add a product to the cart.
     * If already present, increase quantity.
     * Recalculate total amount.
     */
    addToCart: (state, action: PayloadAction<Product>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity += 1; // increase quantity if already in cart
      } else {
        state.items.push({ ...action.payload, quantity: 1 }); // add new item
      }
      // Recalculate total
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

    /**
     * Remove a product from the cart based on its ID.
     * Recalculate total amount after removal.
     */
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

    /**
     * Update the quantity of a specific item in the cart.
     * Recalculate total amount after update.
     */
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.totalAmount = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      }
    },
  },
});

// Export actions for use in components
export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;

// Export reducer to include in store
export default cartSlice.reducer;
