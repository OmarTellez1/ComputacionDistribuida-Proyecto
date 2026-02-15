import { ShoppingCart, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const isOutOfStock = product.stock === 0;
  const imageUrl = product.image || `https://placehold.co/600x400?text=${encodeURIComponent(product.name)}`;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Imagen del producto */}
      <div className="relative overflow-hidden bg-gray-100 h-56">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = `https://placehold.co/600x400?text=${encodeURIComponent(product.name)}`;
          }}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              AGOTADO
            </span>
          </div>
        )}
        {!isOutOfStock && product.stock <= 5 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ¡Últimas unidades!
          </div>
        )}
      </div>

      {/* Contenido del producto */}
      <div className="p-5 space-y-3">
        {/* Nombre del producto */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Descripción (si existe) */}
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Información de stock */}
        <div className="flex items-center space-x-2 text-sm">
          <Package className="h-4 w-4 text-gray-500" />
          <span className={`font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
            {isOutOfStock ? 'Sin stock' : `Stock: ${product.stock}`}
          </span>
        </div>

        {/* Precio y botón */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div>
            <p className="text-2xl font-bold text-indigo-600">
              ${product.price.toFixed(2)}
            </p>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{isOutOfStock ? 'Agotado' : 'Agregar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
