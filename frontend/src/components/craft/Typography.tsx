import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';

export interface TypographyProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption'; // Added variant for convenience
  text?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: string;
  align?: 'left' | 'center' | 'right';
  className?: string; // Added className support
}

const sizeMap = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-sm @3xl:text-base',
  lg: 'text-base @3xl:text-lg',
  xl: 'text-lg @3xl:text-xl',
  '2xl': 'text-xl @3xl:text-2xl',
  '3xl': 'text-2xl @3xl:text-3xl',
  '4xl': 'text-2xl @3xl:text-3xl @5xl:text-4xl',
  '5xl': 'text-3xl @3xl:text-4xl @5xl:text-5xl',
};

const weightMap = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const alignMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

// Variant to tag + size mapping for convenience
const variantMap: Record<string, { tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'; size: keyof typeof sizeMap; weight: keyof typeof weightMap }> = {
  h1: { tag: 'h1', size: '5xl', weight: 'bold' },
  h2: { tag: 'h2', size: '4xl', weight: 'bold' },
  h3: { tag: 'h3', size: '2xl', weight: 'semibold' },
  h4: { tag: 'h4', size: 'xl', weight: 'semibold' },
  body: { tag: 'p', size: 'base', weight: 'normal' },
  caption: { tag: 'span', size: 'sm', weight: 'normal' },
};

import { motion } from 'framer-motion';

export const Typography = ({
  as,
  variant,
  text = 'Enter your text here',
  size,
  weight,
  color,
  align = 'left',
  className,
}: TypographyProps) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();

  // Safely extract text from AI-returned objects
  const safeText = (val: any): string => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (val.props?.text) return String(val.props.text);
    if (val.text) return String(val.text);
    return '';
  };

  const displayText = safeText(text) || 'Enter your text here';

  // DEBUG
  // console.log('[Typography] Rendering:', displayText.substring(0, 50));

  // Resolve tag and styles from variant or explicit props
  const resolvedVariant = variant ? variantMap[variant] : null;
  const Tag = as || resolvedVariant?.tag || 'p';
  const resolvedSize = size || resolvedVariant?.size || 'base';
  const resolvedWeight = weight || resolvedVariant?.weight || 'normal';
  
  const MotionTag = motion[Tag as keyof typeof motion] as any || motion.p;

  return (
    <MotionTag
      ref={(ref: HTMLElement | null) => { if (ref) connect(drag(ref)); }}
      className={cn(sizeMap[resolvedSize], weightMap[resolvedWeight], alignMap[align], className)}
      style={{ color }}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e: any) => setProp((props: TypographyProps) => (props.text = e.currentTarget.innerText))}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
    >
      {displayText}
    </MotionTag>
  );
};

Typography.craft = {
  displayName: 'Typography',
  props: {
    as: 'p',
    text: 'Enter your text here',
    size: 'base',
    weight: 'normal',
    color: '#1f2937',
    align: 'left',
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: TypographySettings,
  },
};


function TypographySettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-6">
      {/* Semantic Tag */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Semantic Tag</label>
        <div className="grid grid-cols-4 gap-1">
            {['h1', 'h2', 'h3', 'p'].map(tag => (
                <button
                    key={tag}
                    onClick={() => setProp((p: TypographyProps) => p.as = tag as any)}
                    className={cn(
                        "text-xs py-2 rounded border transition-all uppercase",
                        props.as === tag 
                            ? "bg-blue-50 border-blue-500 text-blue-700 font-medium ring-1 ring-blue-500" 
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                >
                    {tag}
                </button>
            ))}
        </div>
      </div>

       {/* Font Size */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Font Size</label>
        <select
          value={props.size || 'base'}
          onChange={(e) => setProp((p: TypographyProps) => (p.size = e.target.value as TypographyProps['size']))}
          className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 block"
        >
          <option value="xs">Extra Small (XS)</option>
          <option value="sm">Small (SM)</option>
          <option value="base">Base</option>
          <option value="lg">Large (LG)</option>
          <option value="xl">XL</option>
          <option value="2xl">2XL</option>
          <option value="3xl">3XL</option>
          <option value="4xl">4XL</option>
          <option value="5xl">5XL</option>
        </select>
      </div>

      {/* Weight & Align Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Weight</label>
            <select
                value={props.weight || 'normal'}
                onChange={(e) => setProp((p: TypographyProps) => (p.weight = e.target.value as TypographyProps['weight']))}
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 block"
            >
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="semibold">Semibold</option>
                <option value="bold">Bold</option>
            </select>
        </div>

        <div className="space-y-3">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Align</label>
             <div className="flex rounded-md shadow-sm" role="group">
                {['left', 'center', 'right'].map((align) => (
                    <button
                        key={align}
                        onClick={() => setProp((p: TypographyProps) => p.align = align as any)}
                        className={cn(
                            "flex-1 px-2 py-2 text-sm font-medium border first:rounded-l-lg last:rounded-r-lg focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-700",
                            props.align === align
                                ? "bg-blue-50 border-blue-500 text-blue-700 z-10"
                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                        title={align}
                    >
                       {align === 'left' && 'L'}
                       {align === 'center' && 'C'}
                       {align === 'right' && 'R'}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Text Color */}
       <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Color</label>
        <div className="flex items-center gap-2">
            <input
              type="color"
              value={props.color || '#1f2937'}
              onChange={(e) => setProp((p: TypographyProps) => (p.color = e.target.value))}
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

