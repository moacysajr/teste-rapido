/* eslint-disable no-unused-vars */
import { Decimal } from "@prisma/client/runtime/library";
import { create } from "zustand";


interface Item {
  id: string;
  name: string;
  imageUrl: string;
  description: string | null;
  price: Decimal;
  barbershopId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CartItem extends Item {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addItem: (item: Item, quantity?: number) => void;
  removeItem: (itemId: string, quantity?: number) => void;
  clearCart: () => void;
}

const useCartStore = create<CartState>((set) => ({
  cart: [],
  addItem: (item, quantity = 1) =>
    set((state) => {
      const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return {
          cart: state.cart.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem
          ),
        };
      }

      return {
        cart: [...state.cart, { ...item, quantity }],
      };
    }),
  removeItem: (itemId, quantity = 1) =>
    set((state) => ({
      cart: state.cart
        .map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - quantity }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0),
    })),
  clearCart: () => set({ cart: [] }),
}));

export default useCartStore;
