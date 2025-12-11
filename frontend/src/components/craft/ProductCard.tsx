
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';

export interface ProductCardProps {
  image?: string;
  title?: string;
  price?: string;
  originalPrice?: string;
  badge?: string;
  className?: string;
}

export const ProductCard = ({
  image = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
  title = 'Product Title',
  price = '$99.00',
  originalPrice,
  badge,
  className,
}: ProductCardProps) => {
  const { connectors: { connect, drag } } = useNode();

  // Safely extract text from AI-returned objects
  const safeText = (val: any): string => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    // Handle nested Typography objects from AI
    if (val.props?.text) return String(val.props.text);
    if (val.text) return String(val.text);
    return '';
  };

  const displayTitle = safeText(title) || 'Product';
  const displayPrice = safeText(price) || '$0.00';
  const displayOriginalPrice = safeText(originalPrice);
  const displayBadge = safeText(badge);
  const displayImage = typeof image === 'string' ? image : 'https://via.placeholder.com/400';

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={cn(
        'group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300',
        className
      )}
    >
      {/* Badge */}
      {displayBadge && (
        <div className="absolute top-3 left-3 z-10 px-2 py-1 text-xs font-bold uppercase bg-red-500 text-white rounded">
          {displayBadge}
        </div>
      )}

      {/* Image Container - only render if we have a valid image */}
      {displayImage && displayImage !== 'https://via.placeholder.com/400' && (
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={displayImage}
            alt={displayTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      {/* Placeholder when no image */}
      {(!displayImage || displayImage === 'https://via.placeholder.com/400') && (
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-gray-400 text-center p-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">No image</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-gray-900 line-clamp-2">{displayTitle}</h3>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">{displayPrice}</span>
          {displayOriginalPrice && (
            <span className="text-sm text-gray-400 line-through">{displayOriginalPrice}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors">
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

ProductCard.craft = {
  displayName: 'ProductCard',
  props: {
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    title: 'Product Title',
    price: '$99.00',
    originalPrice: '',
    badge: '',
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: ProductCardSettings,
  },
};

function ProductCardSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      {/* Image URL */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Image URL</label>
        <input
          type="text"
          value={props.image || ''}
          onChange={(e) => setProp((p: ProductCardProps) => (p.image = e.target.value))}
          placeholder="https://..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</label>
        <input
          type="text"
          value={props.title || ''}
          onChange={(e) => setProp((p: ProductCardProps) => (p.title = e.target.value))}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</label>
          <input
            type="text"
            value={props.price || ''}
            onChange={(e) => setProp((p: ProductCardProps) => (p.price = e.target.value))}
            placeholder="$99.00"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Original</label>
          <input
            type="text"
            value={props.originalPrice || ''}
            onChange={(e) => setProp((p: ProductCardProps) => (p.originalPrice = e.target.value))}
            placeholder="$129.00"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Badge */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Badge</label>
        <input
          type="text"
          value={props.badge || ''}
          onChange={(e) => setProp((p: ProductCardProps) => (p.badge = e.target.value))}
          placeholder="SALE, NEW, etc."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
