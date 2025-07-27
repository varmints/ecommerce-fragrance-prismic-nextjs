"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Typ dla pojedynczego przedmiotu w koszyku
export interface CartItem {
  uid: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Typ dla wartości kontekstu
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (uid: string) => void;
  updateQuantity: (uid: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Tworzenie kontekstu z wartością domyślną
const CartContext = createContext<CartContextType | undefined>(undefined);

// Props dla dostawcy kontekstu
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Wczytywanie koszyka z localStorage przy pierwszym renderowaniu
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      setCart([]);
    }
  }, []);

  // Zapisywanie koszyka do localStorage przy każdej zmianie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (itemToAdd: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.uid === itemToAdd.uid);
      if (existingItem) {
        // Jeśli przedmiot już jest w koszyku, zwiększ jego ilość
        return prevCart.map((item) =>
          item.uid === itemToAdd.uid
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      // Jeśli przedmiotu nie ma w koszyku, dodaj go z ilością 1
      return [...prevCart, { ...itemToAdd, quantity: 1 }];
    });
  };

  const removeFromCart = (uid: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.uid !== uid));
  };

  const updateQuantity = (uid: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(uid);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.uid === uid ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook do łatwego używania kontekstu
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
