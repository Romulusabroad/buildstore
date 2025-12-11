import type { ReactNode } from 'react';
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';

export interface FlexStackProps {
  direction?: 'row' | 'col' | 'column'; // Added 'column' as alias for 'col'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  align?: 'start' | 'center' | 'end' | 'stretch';
  gap?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  bgColor?: string;
  scroll?: boolean; // Horizontal scroll toggle
  className?: string; // Added className support
  children?: ReactNode;
}

const directionMap: Record<string, string> = { row: 'flex-row', col: 'flex-col', column: 'flex-col' }; // Added 'column' alias
const justifyMap = { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between', around: 'justify-around' };
const alignMap = { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch' };
const gapMap = { none: 'gap-0', sm: 'gap-2', md: 'gap-4', lg: 'gap-8' };
const paddingMap = { none: 'p-0', sm: 'p-2', md: 'p-4', lg: 'p-8' };
const radiusMap = { none: 'rounded-none', sm: 'rounded', md: 'rounded-lg', lg: 'rounded-2xl', full: 'rounded-full' };
const shadowMap = { none: 'shadow-none', sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-lg' };

import { motion } from 'framer-motion';

export const FlexStack = ({
  direction = 'col',
  justify = 'start',
  align = 'start',
  gap = 'md',
  padding = 'md',
  radius = 'none',
  shadow = 'none',
  bgColor = 'transparent',
  scroll = false,
  className,
  children,
}: FlexStackProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <motion.div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={cn(
        'flex',
        directionMap[direction] || 'flex-col',
        justifyMap[justify],
        alignMap[align],
        gapMap[gap],
        paddingMap[padding],
        radiusMap[radius],
        shadowMap[shadow],
        scroll ? 'overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full' : '',
        className
      )}
      style={{ backgroundColor: bgColor }}
      variants={{
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { staggerChildren: 0.1, delayChildren: 0.1 } 
        }
      }}
    >
      {children}
    </motion.div>
  );
};

FlexStack.craft = {
  displayName: 'FlexStack',
  props: {
    direction: 'col',
    justify: 'start',
    align: 'start',
    gap: 'md',
    padding: 'md',
    radius: 'none',
    shadow: 'none',
    bgColor: 'transparent',
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: FlexStackSettings,
  },
};


function FlexStackSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-6">
      {/* Layout Direction */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Direction</label>
        <div className="flex rounded-md shadow-sm" role="group">
            {['row', 'col'].map((dir) => (
                <button
                    key={dir}
                    onClick={() => setProp((p: FlexStackProps) => p.direction = dir as any)}
                    className={cn(
                        "flex-1 px-4 py-2 text-sm font-medium border first:rounded-l-lg last:rounded-r-lg focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-700",
                        props.direction === dir
                            ? "bg-blue-50 border-blue-500 text-blue-700 z-10"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                >
                    {dir === 'row' ? 'Horizontal →' : 'Vertical ↓'}
                </button>
            ))}
        </div>
      </div>

      {/* Scroll Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">Horizontal Scroll</span>
        <button
            onClick={() => setProp((p: FlexStackProps) => p.scroll = !p.scroll)}
            className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                props.scroll ? "bg-blue-600" : "bg-gray-200"
            )}
        >
            <span
                className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    props.scroll ? "translate-x-6" : "translate-x-1"
                )}
            />
        </button>
      </div>

       {/* Alignment Controls */}
      <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Justify</label>
            <select
                value={props.justify || 'start'}
                onChange={(e) => setProp((p: FlexStackProps) => (p.justify = e.target.value as FlexStackProps['justify']))}
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 block"
            >
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="between">Space Between</option>
                <option value="around">Space Around</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Align Items</label>
            <select
                value={props.align || 'start'}
                onChange={(e) => setProp((p: FlexStackProps) => (p.align = e.target.value as FlexStackProps['align']))}
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 block"
            >
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="stretch">Stretch</option>
            </select>
          </div>
      </div>

      {/* Spacing & Styling */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Spacing</label>
        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-xs text-gray-400 mb-1 block">Gap</label>
                <select
                    value={props.gap || 'md'}
                    onChange={(e) => setProp((p: FlexStackProps) => (p.gap = e.target.value as FlexStackProps['gap']))}
                    className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5"
                >
                    <option value="none">None</option>
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                </select>
             </div>
             <div>
                <label className="text-xs text-gray-400 mb-1 block">Padding</label>
                <select
                    value={props.padding || 'md'}
                    onChange={(e) => setProp((p: FlexStackProps) => (p.padding = e.target.value as FlexStackProps['padding']))}
                    className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5"
                >
                    <option value="none">None</option>
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                </select>
             </div>
        </div>
      </div>

       {/* Appearance */}
       <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Appearance</label>
        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-xs text-gray-400 mb-1 block">Radius</label>
                <select
                    value={props.radius || 'none'}
                    onChange={(e) => setProp((p: FlexStackProps) => (p.radius = e.target.value as FlexStackProps['radius']))}
                    className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5"
                >
                    <option value="none">None</option>
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                    <option value="full">Full</option>
                </select>
             </div>
             <div>
                <label className="text-xs text-gray-400 mb-1 block">Shadow</label>
                <select
                    value={props.shadow || 'none'}
                    onChange={(e) => setProp((p: FlexStackProps) => (p.shadow = e.target.value as FlexStackProps['shadow']))}
                    className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5"
                >
                    <option value="none">None</option>
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                </select>
             </div>
        </div>
      </div>

      {/* Background Color */}
       <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Background</label>
        <div className="flex items-center gap-2">
            <input
              type="color"
              value={props.bgColor === 'transparent' ? '#ffffff' : props.bgColor}
              onChange={(e) => setProp((p: FlexStackProps) => (p.bgColor = e.target.value))}
               className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
            />
            <button 
                onClick={() => setProp((p: FlexStackProps) => p.bgColor = 'transparent')}
                className="text-xs text-gray-500 underline hover:text-gray-700"
            >
                Clear
            </button>
        </div>
      </div>
    </div>
  );
}

