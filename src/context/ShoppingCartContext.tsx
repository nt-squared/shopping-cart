import { useContext, createContext, ReactNode, useState } from "react";

import ShoppingCartOrder from "../components/ShoppingCartOrder";
import useLocalStorage from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  quantity: number;
};

type ShoppingCartContextProps = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseItemQuantity: (id: number) => void;
  decreaseItemQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
};

const ShoppingCartContext = createContext({} as ShoppingCartContextProps);
export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  );
  const [isOpen, setIsOpen] = useState(false);

  const cartQuantity = cartItems.reduce(
    (quantity, cartItem) => quantity + cartItem.quantity,
    0
  );

  const openCart = () => setIsOpen(true);

  const closeCart = () => setIsOpen(false);

  const getItemQuantity = (id: number) => {
    return cartItems.find((cartItem) => cartItem.id === id)?.quantity || 0;
  };

  const increaseItemQuantity = (id: number) => {
    setCartItems((currItems) => {
      if (!currItems.find((currItem) => currItem.id === id)) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((currItem) => {
          if (currItem.id === id) {
            return { ...currItem, quantity: currItem.quantity + 1 };
          } else {
            return currItem;
          }
        });
      }
    });
  };

  const decreaseItemQuantity = (id: number) => {
    setCartItems((currItems) => {
      if (currItems.find((currItem) => currItem.id === id)?.quantity === 1) {
        return currItems.filter((currItem) => currItem.id !== id);
      } else {
        return currItems.map((currItem) => {
          if (currItem.id === id) {
            return { ...currItem, quantity: currItem.quantity - 1 };
          } else {
            return currItem;
          }
        });
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((currItems) =>
      currItems.filter((currItem) => currItem.id !== id)
    );
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseItemQuantity,
        decreaseItemQuantity,
        removeFromCart,
        cartItems,
        cartQuantity,
        openCart,
        closeCart,
      }}
    >
      {children}
      <ShoppingCartOrder isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
