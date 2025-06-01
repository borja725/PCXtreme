import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken } from '../../utils/auth';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const token = getToken();

  useEffect(() => {
    if (!token) {
      setCart(null);
      setCartCount(0);
      return;
    }
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setCart(data);
        setCartCount(Array.isArray(data?.items) ? data.items.reduce((sum, item) => sum + item.qty, 0) : 0);
      })
      .catch(() => {
        setCart(null);
        setCartCount(0);
      });
  }, [token]);

  const updateCart = (data) => {
    setCart(data);
    setCartCount(Array.isArray(data?.items) ? data.items.reduce((sum, item) => sum + item.qty, 0) : 0);
  };

  return (
    <CartContext.Provider value={{ cart, setCart: updateCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}
