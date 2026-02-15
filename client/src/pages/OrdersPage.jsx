import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../api/orders.service';
import { Package, ShoppingBag, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      // El backend puede devolver { orders: [...] } o directamente [...]
      setOrders(data.orders || data || []);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      setError('No se pudieron cargar las órdenes. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock className="h-4 w-4" />,
        label: 'Pendiente',
      },
      COMPLETED: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle className="h-4 w-4" />,
        label: 'Completado',
      },
      CANCELLED: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <XCircle className="h-4 w-4" />,
        label: 'Cancelado',
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        <span>{config.label}</span>
      </span>
    );
  };

  const formatOrderId = (id) => {
    return id.slice(-6).toUpperCase();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getItemsSummary = (items) => {
    if (!items || items.length === 0) return 'Sin items';
    
    return items.map(item => {
      const productName = item.product?.name || item.productId || 'Producto';
      return `${productName} x${item.quantity}`;
    }).join(', ');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar órdenes</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadOrders}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-full h-32 w-32 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Package className="h-16 w-16 text-gray-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            No tienes órdenes aún
          </h2>
          
          <p className="text-gray-600 mb-8">
            ¡Empieza a comprar y tus pedidos aparecerán aquí!
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Ir al Catálogo</span>
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
            Mis Órdenes
          </h1>
          <p className="text-gray-600">
            {orders.length} {orders.length === 1 ? 'orden realizada' : 'órdenes realizadas'}
          </p>
        </div>

        {/* Tabla de órdenes - Desktop */}
        <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id || order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          #{formatOrderId(order._id || order.id)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={getItemsSummary(order.items)}>
                        {getItemsSummary(order.items)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-indigo-600">
                        ${order.totalPrice?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cards de órdenes - Mobile */}
        <div className="md:hidden space-y-4">
          {orders.map((order) => (
            <div
              key={order._id || order.id}
              className="bg-white rounded-xl shadow-md p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    #{formatOrderId(order._id || order.id)}
                  </span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Fecha</p>
                  <p className="text-sm text-gray-900">{formatDate(order.createdAt)}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Items</p>
                  <p className="text-sm text-gray-900">{getItemsSummary(order.items)}</p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    ${order.totalPrice?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón volver */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Volver al Catálogo</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
