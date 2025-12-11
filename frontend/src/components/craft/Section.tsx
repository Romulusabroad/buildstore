import { type ReactNode, Children } from 'react';
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export interface SectionProps {
  bgColor?: string;
  bgImage?: string;
  paddingY?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  scrollEffect?: 'none' | 'parallax' | 'fixed' | 'multilayer';
  parallaxStrength?: number;
  animationStyle?: 'none' | 'gentle' | 'moderate' | 'energetic';
  height?: 'auto' | 'screen';
  snap?: boolean; // For scroll snapping
  children?: ReactNode;
}

const paddingMap = {
  none: 'py-0',
  sm: 'py-2 @3xl:py-4',
  md: 'py-4 @3xl:py-8',
  lg: 'py-8 @3xl:py-16',
  xl: 'py-12 @3xl:py-24',
};



export const Section = ({
  bgColor = '#ffffff',
  bgImage,
  paddingY = 'lg',
  fullWidth = false,
  scrollEffect = 'none',
  parallaxStrength = 0.2,
  animationStyle = 'none',
  overlayOpacity = 0,
  backgroundPattern = 'none',
  height = 'auto',
  snap = false,
  id,
  children,
}: SectionProps & { overlayOpacity?: number; backgroundPattern?: 'none' | 'dots' | 'grid' | 'noise' | 'mesh'; id?: string }) => {
  const { connectors: { connect, drag } } = useNode();

  // DEBUG: Log Section render
  console.log('[Section] Rendering with children:', Children.count(children), 'scrollEffect:', scrollEffect, 'strength:', parallaxStrength);
  
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax: background moves slower than foreground (0% -> strength * 100%)
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", `${parallaxStrength * 100}%`]);
  
  // Multi-layer effects
  const yLayer1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const yLayer2 = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  
  // Resolve background style
  const getBackgroundStyle = () => {
    if (!bgImage) return {};
    
    // Fixed Background
    if (scrollEffect === 'fixed') {
        return { 
            backgroundImage: `url(${bgImage})`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
        };
    }
    
    // Classic Parallax or Multi-layer (Base layer)
    if (scrollEffect === 'parallax' || scrollEffect === 'multilayer') {
        return { backgroundImage: `url(${bgImage})`, y: yParallax };
    }

    // Default (None)
    return { backgroundImage: `url(${bgImage})` };
  };

  // Pattern Styles
  const getPatternStyle = () => {
    switch (backgroundPattern) {
      case 'dots':
        return { backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' };
      case 'grid':
        return { backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px' };
      case 'noise':
        return { backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.1\'/%3E%3C/svg%3E")' };
      case 'mesh':
        return { backgroundImage: 'radial-gradient(at 40% 20%, rgba(29, 78, 216, 0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(124, 58, 237, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(236, 72, 153, 0.1) 0px, transparent 50%)' };
      default:
        return {};
    }
  };

  // Animation Implementation
  const isAnimated = animationStyle && animationStyle !== 'none';
  const getStaggerDelay = () => {
     switch(animationStyle) {
        case 'energetic': return 0.05;
        case 'moderate': return 0.1;
        case 'gentle': return 0.2;
        default: return 0.1;
     }
  };

  return (
    <section
      id={id}
      ref={(ref) => { 
        if (ref) connect(drag(ref));
        // Assign ref to both Craft and local ref
        sectionRef.current = ref; 
      }}
      className={cn(
        'relative w-full overflow-hidden transition-colors duration-500', 
        paddingMap[paddingY],
        !fullWidth && 'max-w-7xl mx-auto px-4',
        height === 'screen' ? 'min-h-screen flex items-center' : '',
        snap ? 'snap-start snap-always' : ''
      )}
      style={{
        backgroundColor: bgColor,
      }}
    >
      {/* Background Image Layer (Parallax or Static or Fixed) */}
      {bgImage && (
        <motion.div
           style={getBackgroundStyle()}
           className={cn(
             "absolute inset-0 bg-cover bg-center z-0",
             scrollEffect === 'fixed' ? "" : "bg-cover" // Fixed needs background-attachment handled in style
           )}
        />
      )}

      {/* Multi-layer Decorative Elements */}
      {scrollEffect === 'multilayer' && (
        <>
            <motion.div 
                style={{ y: yLayer1 }}
                className="absolute top-10 right-10 w-32 h-32 rounded-full border-4 border-white/10 z-[1] pointer-events-none"
            />
            <motion.div 
                style={{ y: yLayer2 }}
                className="absolute bottom-20 left-20 w-24 h-24 bg-blue-500/10 backdrop-blur-sm rounded-xl z-[1] pointer-events-none"
            />
        </>
      )}

      {/* Pattern Layer (if no bgImage) */}
      {!bgImage && (
        <div 
          className="absolute inset-0 z-0 opacity-50"
          style={getPatternStyle()}
        />
      )}
      {/* Overlay */}
      {bgImage && overlayOpacity > 0 && (
        <div 
          className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500" 
          style={{ opacity: overlayOpacity }} 
        />
      )}
      
      {/* Content with Staggered Reveal */}
      <motion.div 
        initial={isAnimated ? "hidden" : "visible"}
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { staggerChildren: getStaggerDelay(), delayChildren: 0.1 }
          }
        }}
        className="relative z-10 w-full h-full"
      >
        {children}
      </motion.div>
    </section>
  );
};

Section.craft = {
  displayName: 'Section',
  props: {
    bgColor: '#ffffff',
    paddingY: 'lg',
    fullWidth: false,
    scrollEffect: 'none',
    parallaxStrength: 0.2,
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: SectionSettings,
  },
};


function SectionSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-6">
      {/* Background Color */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Background</label>
        <div className="flex items-center gap-2">
            <input
              type="color"
              value={props.bgColor || '#ffffff'}
              onChange={(e) => setProp((props: SectionProps) => (props.bgColor = e.target.value))}
              className="w-8 h-8 rounded border-none cursor-pointer"
            />
            <span className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200">
                {props.bgColor}
            </span>
        </div>
      </div>

      {/* Padding */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Vertical Padding</label>
        <div className="grid grid-cols-5 gap-1">
            {['none', 'sm', 'md', 'lg', 'xl'].map(val => (
                <button
                    key={val}
                    onClick={() => setProp((props: SectionProps) => props.paddingY = val as SectionProps['paddingY'])}
                    className={cn(
                        "text-xs py-2 rounded border transition-all",
                        props.paddingY === val 
                            ? "bg-blue-50 border-blue-500 text-blue-700 font-medium ring-1 ring-blue-500" 
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                >
                    {val.toUpperCase()}
                </button>
            ))}
        </div>
      </div>

      {/* Parallax Toggle */}
      {/* Scroll Effect Selector */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Scroll Effect</label>
        <div className="grid grid-cols-2 gap-2">
            {[
                { id: 'none', label: 'None' },
                { id: 'parallax', label: 'Classic' },
                { id: 'fixed', label: 'Fixed' },
                { id: 'multilayer', label: '3D Layers' },
            ].map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => setProp((props: SectionProps) => props.scrollEffect = opt.id as any)}
                    className={cn(
                        "text-xs py-2 rounded border transition-all",
                        props.scrollEffect === opt.id 
                            ? "bg-blue-50 border-blue-500 text-blue-700 font-medium ring-1 ring-blue-500" 
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                >
                    {opt.label}
                </button>
            ))}
        </div>
      </div>

      {/* Parallax Strength Slider */}
      {(props.scrollEffect === 'parallax' || props.scrollEffect === 'multilayer') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Effect Strength</label>
            <span className="text-xs text-blue-600 font-mono">
              {(props.parallaxStrength || 0.2).toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.8"
            step="0.1"
            value={props.parallaxStrength || 0.2}
            onChange={(e) => setProp((props: SectionProps) => props.parallaxStrength = parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      )}

      {/* Layout */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Layout</label>
        
        <div 
            onClick={() => setProp((props: SectionProps) => props.fullWidth = !props.fullWidth)}
            className={cn(
                "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                props.fullWidth 
                    ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500" 
                    : "bg-white border-gray-200 hover:border-gray-300"
            )}
        >
            <div className="flex items-center gap-3">
                <div className={cn(
                    "w-4 h-4 rounded-full border flex items-center justify-center",
                    props.fullWidth ? "border-blue-500 bg-blue-500" : "border-gray-400"
                )}>
                    {props.fullWidth && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className={cn("text-sm", props.fullWidth ? "text-blue-900 font-medium" : "text-gray-700")}>
                    Full Width
                </span>
            </div>
            {props.fullWidth ? (
                <div className="w-8 h-4 bg-blue-200 rounded flex items-center justify-center">
                    <div className="w-6 h-1 bg-blue-500 rounded-full" />
                </div>
            ) : (
                <div className="w-8 h-4 bg-gray-100 rounded flex items-center justify-center px-1">
                    <div className="w-4 h-2 border border-gray-400 bg-white" />
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

