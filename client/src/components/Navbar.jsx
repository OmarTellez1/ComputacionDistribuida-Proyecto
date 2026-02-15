import { ShoppingBag, ShoppingCart, LogOut, Menu, X, Package } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y nombre */}
          <Link to="/" className="flex items-center space-x-2 group">
            <ShoppingBag className="h-8 w-8 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              E-Commerce
            </span>
          </Link>

          {/* Desktop Menu */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              {/* Usuario */}
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Hola, <span className="font-semibold text-gray-900">{user?.name || user?.email || 'Usuario'}</span>
                  </p>
                </div>
              </div>

              {/* Mis Órdenes */}
              <Link
                to="/orders"
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Package className="h-5 w-5" />
                <span className="text-sm font-medium">Mis Órdenes</span>
              </Link>

              {/* Carrito */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          {isAuthenticated && (
            <div className="md:hidden flex items-center space-x-3">
              {/* Carrito móvil */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            <div className="pb-3 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Hola, <span className="font-semibold text-gray-900">{user?.name || user?.email || 'Usuario'}</span>
              </p>
            </div>
            
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Package className="h-4 w-4" />
              <span>Mis Órdenes</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
