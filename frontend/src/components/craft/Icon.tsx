import { useNode } from '@craftjs/core';
import { 
  Star, Heart, ShoppingCart, User, Search, Menu, X, Check,
  ChevronRight, ChevronDown, ArrowRight, Mail, Phone, MapPin,
  Clock, Calendar, Settings, Home, Zap, Shield, Truck, CreditCard,
  Facebook, Twitter, Instagram, Linkedin, Youtube
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IconProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

// Explicit safe map of icons
const iconMap: Record<string, LucideIcon> = {
  Star, Heart, ShoppingCart, User, Search, Menu, X, Check,
  ChevronRight, ChevronDown, ArrowRight, Mail, Phone, MapPin,
  Clock, Calendar, Settings, Home, Zap, Shield, Truck, CreditCard,
  Facebook, Twitter, Instagram, Linkedin, Youtube
};

// Common icons list for dropdown
const commonIcons = Object.keys(iconMap);

export const Icon = ({
  name = 'Star',
  size = 'md',
  color = '#1f2937',
}: IconProps) => {
  const { connectors: { connect, drag } } = useNode();

  // Safe lookup with fallback
  const IconComponent = iconMap[name] || Star;

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className="inline-flex items-center justify-center"
    >
      <IconComponent size={sizeMap[size]} color={color} />
    </div>
  );
};

Icon.craft = {
  displayName: 'Icon',
  props: {
    name: 'Star',
    size: 'md',
    color: '#1f2937',
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: IconSettings,
    // Add default props for serialization safety
  },
};


function IconSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-6">
      {/* Icon Selection */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Icon</label>
        <div className="relative">
             <select
                value={props.name || 'Star'}
                onChange={(e) => setProp((p: IconProps) => (p.name = e.target.value))}
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 appearance-none"
             >
                {commonIcons.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                ))}
             </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
      </div>

       {/* Size Selection */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</label>
        <div className="flex rounded-md shadow-sm" role="group">
            {['sm', 'md', 'lg', 'xl'].map((size) => (
                <button
                    key={size}
                    onClick={() => setProp((p: IconProps) => p.size = size as any)}
                    className={cn(
                        "flex-1 px-2 py-2 text-sm font-medium border first:rounded-l-lg last:rounded-r-lg focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-700 uppercase",
                        props.size === size
                            ? "bg-blue-50 border-blue-500 text-blue-700 z-10"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                >
                    {size}
                </button>
            ))}
        </div>
      </div>

      {/* Color Selection */}
       <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Color</label>
        <div className="flex items-center gap-2">
            <input
              type="color"
              value={props.color || '#1f2937'}
              onChange={(e) => setProp((p: IconProps) => (p.color = e.target.value))}
               className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
            />
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm font-mono text-gray-600">
                {props.color}
            </div>
        </div>
      </div>
    </div>
  );
}

