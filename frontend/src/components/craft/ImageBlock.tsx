import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';

export interface ImageBlockProps {
  src?: string;
  alt?: string;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  aspectRatio?: 'auto' | 'square' | 'video' | 'portrait';
  objectFit?: 'cover' | 'contain' | 'fill';
  lightbox?: boolean;
}

const radiusMap = {
  none: 'rounded-none',
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-2xl',
  full: 'rounded-full',
};

const aspectMap = {
  auto: '',
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
};

const fitMap = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
};

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export const ImageBlock = ({
  src = 'https://via.placeholder.com/400x300',
  alt = 'Placeholder image',
  radius = 'md',
  aspectRatio = 'auto',
  objectFit = 'cover',
  reveal = true,
  lightbox = false,
}: ImageBlockProps & { reveal?: boolean; lightbox?: boolean }) => {
  const { connectors: { connect, drag } } = useNode();
  const [isOpen, setIsOpen] = useState(false);

  // Cinematic Reveal Variants
  const variants = {
    hidden: { scale: 1.1, opacity: 0, filter: 'blur(10px)' },
    visible: { 
        scale: 1, 
        opacity: 1, 
        filter: 'blur(0px)',
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } // Cinema easing
    }
  };

  const toggleLightbox = () => {
    if (lightbox) setIsOpen(!isOpen);
  };

  return (
    <>
      <div 
        className={cn(
            'overflow-hidden group', 
            radiusMap[radius], 
            aspectMap[aspectRatio],
            lightbox && 'cursor-zoom-in'
        )}
        onClick={toggleLightbox}
        ref={(ref) => { if (ref) connect(drag(ref)); }}
      >
        <motion.img
          src={src}
          alt={alt}
          initial={reveal ? "hidden" : "visible"}
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={variants}
          className={cn(
            'w-full h-full transition-transform duration-500',
            lightbox && 'group-hover:scale-105',
            fitMap[objectFit]
          )}
        />
        {lightbox && (
             <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        )}
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {isOpen && lightbox && createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
          >
            <button className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                 <X size={32} />
            </button>
            <motion.img
                src={src}
                alt={alt}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </>
  );
};

ImageBlock.craft = {
  displayName: 'ImageBlock',
  props: {
    src: 'https://via.placeholder.com/400x300',
    alt: 'Placeholder image',
    radius: 'md',
    aspectRatio: 'auto',
    objectFit: 'cover',
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: ImageBlockSettings,
  },
};


function ImageBlockSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-6">
      {/* Source & Alt */}
      <div className="space-y-3">
        <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Image Source</label>
            <input
              type="text"
              value={props.src || ''}
              onChange={(e) => setProp((p: ImageBlockProps) => (p.src = e.target.value))}
              placeholder="https://..."
              className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Alt Text</label>
            <input
              type="text"
              value={props.alt || ''}
              onChange={(e) => setProp((p: ImageBlockProps) => (p.alt = e.target.value))}
              placeholder="Description..."
              className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
      </div>

      {/* Lightbox Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">Focus Mode (Lightbox)</span>
        <button
            onClick={() => setProp((p: ImageBlockProps) => p.lightbox = !p.lightbox)}
            className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                props.lightbox ? "bg-blue-600" : "bg-gray-200"
            )}
        >
            <span
                className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    props.lightbox ? "translate-x-6" : "translate-x-1"
                )}
            />
        </button>
      </div>

      {/* Dimensions & Fit */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Aspect Ratio</label>
             <select
                value={props.aspectRatio || 'auto'}
                onChange={(e) => setProp((p: ImageBlockProps) => (p.aspectRatio = e.target.value as ImageBlockProps['aspectRatio']))}
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5"
             >
                <option value="auto">Auto</option>
                <option value="square">Square (1:1)</option>
                <option value="video">Video (16:9)</option>
                <option value="portrait">Portrait (3:4)</option>
             </select>
        </div>
        <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Object Fit</label>
             <select
                value={props.objectFit || 'cover'}
                onChange={(e) => setProp((p: ImageBlockProps) => (p.objectFit = e.target.value as ImageBlockProps['objectFit']))}
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5"
             >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
             </select>
        </div>
      </div>

      {/* Styling */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Corner Radius</label>
        <div className="grid grid-cols-5 gap-1">
            {['none', 'sm', 'md', 'lg', 'full'].map((radius) => (
                <button
                    key={radius}
                    onClick={() => setProp((p: ImageBlockProps) => p.radius = radius as any)}
                    className={cn(
                        "text-xs py-2 rounded border transition-all capitalized",
                        props.radius === radius
                            ? "bg-blue-50 border-blue-500 text-blue-700 font-medium ring-1 ring-blue-500"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                    title={radius}
                >
                    {radius === 'none' ? '0' : radius}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}

