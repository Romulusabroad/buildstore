
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

export interface CtaButtonProps {
  text?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  fullWidth?: boolean;
  bgColor?: string;
  href?: string;
}

const variantStyles = {
  default: 'bg-gray-900 text-white hover:bg-black',
  outline: 'border-2 border-gray-900 text-gray-900 hover:bg-gray-100',
  ghost: 'text-gray-900 hover:bg-gray-100',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

import { motion } from 'framer-motion';

export const CtaButton = ({
  text = 'Get Started',
  variant = 'default',
  size = 'md',
  icon,
  fullWidth = false,
  bgColor,
  href,
}: CtaButtonProps) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();

  const IconComponent = icon ? (LucideIcons as any)[icon] : null;
  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={(ref: any) => { if (ref) connect(drag(ref)); }}
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        'no-underline',
        'cursor-pointer'
      )}
      style={variant === 'default' && bgColor ? { backgroundColor: bgColor } : undefined}
      contentEditable={false} // Important for links to work in read-only mode, but in editor we might need to prevent click?
      // In editor enabled=true, links shouldn't navigate. Craft handles this usually.
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.4 } }
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {IconComponent && <IconComponent size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
      <span
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => setProp((p: CtaButtonProps) => (p.text = e.currentTarget.innerText))}
      >
        {text}
      </span>
    </Component>
  );
};

CtaButton.craft = {
  displayName: 'CtaButton',
  props: {
    text: 'Get Started',
    variant: 'default',
    size: 'md',
    fullWidth: false,
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: CtaButtonSettings,
  },
};


function CtaButtonSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  const commonIcons = ['ArrowRight', 'ShoppingCart', 'Zap', 'Star', 'Check', 'Mail', 'Phone', 'Download'];

  return (
    <div className="space-y-6">
       {/* Variant */}
       <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Style</label>
        <div className="flex rounded-md shadow-sm" role="group">
            {['default', 'outline', 'ghost'].map((variant) => (
                <button
                    key={variant}
                    onClick={() => setProp((p: CtaButtonProps) => p.variant = variant as any)}
                    className={cn(
                        "flex-1 px-2 py-2 text-sm font-medium border first:rounded-l-lg last:rounded-r-lg focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-700 capitalize",
                        props.variant === variant
                            ? "bg-blue-50 border-blue-500 text-blue-700 z-10"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                >
                    {variant}
                </button>
            ))}
        </div>
      </div>

      {/* Size & Width */}
      <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</label>
            <select
                value={props.size || 'md'}
                onChange={(e) => setProp((p: CtaButtonProps) => (p.size = e.target.value as CtaButtonProps['size']))}
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 block"
            >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
            </select>
          </div>
          <div className="space-y-3">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Width</label>
             <button
                onClick={() => setProp((p: CtaButtonProps) => p.fullWidth = !p.fullWidth)}
                className={cn(
                    "w-full flex items-center justify-center px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors",
                     props.fullWidth
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
             >
                {props.fullWidth ? 'Full Width' : 'Auto Width'}
             </button>
          </div>
      </div>

       {/* URL Link */}
       <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Link URL</label>
        <input
          type="text"
          value={props.href || ''}
          onChange={(e) => setProp((p: CtaButtonProps) => p.href = e.target.value)}
          placeholder="e.g. /about or https://google.com"
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
       </div>

       {/* Icon */}
       <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Icon</label>
        <select
          value={props.icon || ''}
          onChange={(e) => setProp((p: CtaButtonProps) => (p.icon = e.target.value || undefined))}
          className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 block"
        >
          <option value="">None</option>
          {commonIcons.map((icon) => (
            <option key={icon} value={icon}>{icon}</option>
          ))}
        </select>
       </div>

      {/* Background Color (if default variant) */}
      {props.variant === 'default' && (
       <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Background</label>
        <div className="flex items-center gap-2">
            <input
              type="color"
              value={props.bgColor || '#1f2937'}
              onChange={(e) => setProp((p: CtaButtonProps) => (p.bgColor = e.target.value))}
               className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
            />
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm font-mono text-gray-600">
                {props.bgColor || 'Default'}
            </div>
        </div>
       </div>
      )}
    </div>
  );
}

