import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/orders.service';
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cart, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleIncrement = (item) => {
    updateQuantity(item._id || item.id, item.quantity + 1);
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item._id || item.id, item.quantity - 1);
    }
  };

  const handleRemove = (item) => {
    removeFromCart(item._id || item.id);
  };

  const handleConfirmPurchase = async () => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    setIsProcessing(true);

    try {
      await createOrder(cart);
      
      toast.success('¡Compra realizada con éxito!', {
        duration: 3000,
        position: 'top-center',
        icon: '🎉',
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });

      clearCart();
      
      // Redirigir al home después de 1 segundo
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Error al crear la orden:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || 'Error al procesar la compra. Por favor, intenta de nuevo.';
      
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Si el carrito está vacío
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-full h-32 w-32 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ShoppingCart className="h-16 w-16 text-gray-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Tu carrito está vacío
          </h2>
          
          <p className="text-gray-600 mb-8">
            ¡Explora nuestro catálogo y encuentra productos increíbles!
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Ir a Comprar</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Carrito de Compras
          </h1>
          <p className="text-gray-600">
            {cartCount} {cartCount === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const imageUrl = item.image || `https://placehold.co/200x200?text=${encodeURIComponent(item.name)}`;
              const itemId = item._id || item.id;

              return (
                <div
                  key={itemId}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    {/* Imagen */}
                    <div className="flex-shrink-0">
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/200x200?text=${encodeURIComponent(item.name)}`;
                        }}
                      />
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-2xl font-bold text-indigo-600">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleDecrement(item)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="text-xl font-semibold min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleIncrement(item)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[100px]">
                      <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                      <p className="text-xl font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      onClick={() => handleRemove(item)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                      title="Eliminar del carrito"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Panel de resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Resumen de Compra
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Envío:</span>
                  <span className="font-medium text-green-600">GRATIS</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total:</span>
                    <span className="text-3xl font-bold text-indigo-600">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirmPurchase}
                disabled={isProcessing}
                className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-6 w-6" />
                    <span>CONFIRMAR COMPRA</span>
                  </>
                )}
              </button>

              <Link
                to="/"
                className="block text-center mt-4 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
