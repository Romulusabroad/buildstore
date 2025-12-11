import { useNode } from '@craftjs/core';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Star, Minus, Plus, Heart, Share2, ShieldCheck, Truck, RotateCcw, ChevronRight } from 'lucide-react';
import { CtaButton } from './CtaButton'; // Reuse CTA
import { motion, AnimatePresence } from 'framer-motion';

export interface ProductDetailProps {
  images?: string[];
  title?: string;
  price?: string;
  originalPrice?: string;
  rating?: number;
  reviewCount?: number;
  description?: string;
  sku?: string;
  stockStatus?: string;
  variants?: { name: string; options: string[] }[];
  className?: string;
}

export const ProductDetail = ({
  images = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80'
  ],
  title = 'Premium Wireless Noise-Cancelling Headphones',
  price = '$299.00',
  originalPrice = '$349.00',
  rating = 4.8,
  reviewCount = 128,
  description = 'Experience immersive sound with our latest noise-cancelling technology. Designed for comfort and long-lasting battery life, these headphones are perfect for travel, work, or relaxing at home.',
  sku = 'WH-1000XM5',
  stockStatus = 'In Stock',
  variants = [
    { name: 'Color', options: ['Black', 'Silver', 'Midnight Blue'] },
    { name: 'Style', options: ['Standard', 'Pro Bundle'] }
  ],
  className,
}: ProductDetailProps) => {
  const { connectors: { connect, drag } } = useNode();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // Initialize defaults
  if (Object.keys(selectedVariants).length === 0 && variants.length > 0) {
     const defaults: Record<string, string> = {};
     variants.forEach(v => defaults[v.name] = v.options[0]);
     setSelectedVariants(defaults);
  }

  const handleVariantChange = (name: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={cn("w-full max-w-7xl mx-auto px-4 py-12 md:px-8", className)}
    >
        {/* Breadcrumbs (Mock) */}
        <nav className="flex text-sm text-gray-500 mb-8 space-x-2">
            <span>Home</span> <ChevronRight size={14} /> <span>Audio</span> <ChevronRight size={14} /> <span className="text-gray-900 font-medium">Headphones</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
            {/* Left Column: Gallery */}
            <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 border border-gray-200">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={selectedImage}
                            src={images[selectedImage]} 
                            alt={title}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 w-full h-full object-cover object-center mix-blend-multiply" 
                        />
                    </AnimatePresence>
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                        Best Seller
                    </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={cn(
                                    "aspect-square rounded-lg border-2 overflow-hidden transition-all",
                                    selectedImage === idx ? "border-blue-600 ring-2 ring-blue-100" : "border-transparent hover:border-gray-300"
                                )}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Column: Key Info & Actions */}
            <div className="flex flex-col space-y-8">
                {/* Header Info */}
                <div className="space-y-4 border-b border-gray-100 pb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{title}</h1>
                    
                    <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-4">
                            <div className="flex items-baseline space-x-3">
                                <span className="text-2xl font-bold text-gray-900">{price}</span>
                                {originalPrice && (
                                    <span className="text-lg text-gray-400 line-through decoration-gray-400">{originalPrice}</span>
                                )}
                            </div>
                            {/* Discount Label (Calculated mock) */}
                            {originalPrice && <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs font-bold">-15%</span>}
                         </div>

                        {/* Ratings */}
                        <div className="flex items-center space-x-1">
                             <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < Math.floor(rating) ? "currentColor" : "none"} className={i < Math.floor(rating) ? "" : "text-gray-300"} />
                                ))}
                             </div>
                             <span className="text-sm text-gray-500 underline decoration-gray-300 cursor-pointer hover:text-gray-800">
                                 {reviewCount} reviews
                             </span>
                        </div>
                    </div>
                    
                    <div className="text-sm text-gray-500 font-medium">
                        SKU: {sku} • <span className="text-green-600">{stockStatus}</span>
                    </div>
                </div>

                {/* Description Excerpt */}
                <p className="text-gray-600 leading-relaxed text-base">
                    {description}
                </p>

                {/* Variant Selectors */}
                <div className="space-y-6">
                    {variants.map((variant) => (
                        <div key={variant.name} className="space-y-3">
                            <label className="text-sm font-semibold text-gray-900">
                                {variant.name}: <span className="text-gray-500 font-normal">{selectedVariants[variant.name]}</span>
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {variant.options.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => handleVariantChange(variant.name, opt)}
                                        className={cn(
                                            "px-4 py-2 border rounded-md text-sm font-medium transition-all relative overflow-hidden",
                                            selectedVariants[variant.name] === opt
                                                ? "border-blue-600 text-blue-600 bg-blue-50"
                                                : "border-gray-200 text-gray-700 hover:border-gray-400"
                                        )}
                                    >
                                        {/* Color Splat for color variant? For now simple text */}
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quantity & CTA */}
                <div className="pt-6 border-t border-gray-100 space-y-4">
                    <div className="flex items-center gap-4">
                        {/* Quantity */}
                        <div className="flex items-center border border-gray-200 rounded-lg">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-3 hover:bg-gray-50 text-gray-500"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-medium">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="p-3 hover:bg-gray-50 text-gray-500"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        
                        {/* Main CTA */}
                        <div className="flex-1">
                            <CtaButton text="Add to Cart" variant="default" fullWidth size="lg" icon="ShoppingBag" />
                        </div>
                        
                        {/* Wishlist Button */}
                        <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
                            <Heart size={20} />
                        </button>
                    </div>
                    
                    {/* Secondary Actions */}
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500 pt-2">
                        <button className="flex items-center gap-2 hover:text-gray-900 transition-colors"><RotateCcw size={16} /> Free Returns</button>
                        <button className="flex items-center gap-2 hover:text-gray-900 transition-colors"><ShieldCheck size={16} /> Secure Checkout</button>
                        <button className="flex items-center gap-2 hover:text-gray-900 transition-colors"><Share2 size={16} /> Share</button>
                    </div>
                </div>

                {/* Trust / Shipping Accordion (Mocked static for now, or use Accordion comp inside?) 
                    For simplistic single component, we can just hardcode some nice boxes.
                */}
                <div className="grid grid-cols-1 gap-3 pt-4">
                     <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <Truck className="text-blue-600 mt-1" size={20} />
                        <div>
                            <h4 className="font-semibold text-sm">Free Shipping</h4>
                            <p className="text-xs text-gray-500 mt-1">On all orders over $50. Arrives in 3-5 business days.</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};

// Default props for Craft
ProductDetail.craft = {
  displayName: 'Product Detail',
  props: {},
  related: {},
};
