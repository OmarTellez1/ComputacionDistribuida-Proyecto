import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const productId = product._id || product.id;
      const existingItem = prevCart.find((item) => (item._id || item.id) === productId);

      if (existingItem) {
        // Si el producto ya existe, aumenta la cantidad
        const updatedCart = prevCart.map((item) =>
          (item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

        toast.success(`${product.name} (cantidad: ${existingItem.quantity + 1})`, {
          duration: 2000,
          position: 'top-center',
          icon: '🛒',
        });

        return updatedCart;
      } else {
        // Si no existe, agrégalo con cantidad 1
        toast.success(`${product.name} añadido al carrito`, {
          duration: 2000,
          position: 'top-center',
          icon: '✅',
        });

        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.find((item) => (item._id || item.id) === productId);
      
      if (itemToRemove) {
        toast.success(`${itemToRemove.name} eliminado del carrito`, {
          duration: 2000,
          position: 'top-center',
          icon: '🗑️',
        });
      }

      return prevCart.filter((item) => (item._id || item.id) !== productId);
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        (item._id || item.id) === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Carrito vaciado', {
      duration: 2000,
      position: 'top-center',
    });
  };

  // Calcular total y contador usando useMemo para optimización
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
