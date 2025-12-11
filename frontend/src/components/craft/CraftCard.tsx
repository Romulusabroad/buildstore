import React from 'react';
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';

export interface CraftCardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  bgColor?: string;
  borderColor?: string;
  children?: React.ReactNode;
}

const paddingMap = { none: 'p-0', sm: 'p-2', md: 'p-4', lg: 'p-6' };
const radiusMap = { none: 'rounded-none', sm: 'rounded', md: 'rounded-lg', lg: 'rounded-2xl' };
const shadowMap = { none: 'shadow-none', sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-lg' };

export const CraftCard = ({
  padding = 'md',
  radius = 'lg',
  shadow = 'md',
  bgColor = '#ffffff',
  borderColor = '#e5e7eb',
  children,
}: CraftCardProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={cn(
        'border',
        paddingMap[padding],
        radiusMap[radius],
        shadowMap[shadow]
      )}
      style={{ backgroundColor: bgColor, borderColor }}
    >
      {children}
    </div>
  );
};

CraftCard.craft = {
  displayName: 'Card',
  props: {
    padding: 'md',
    radius: 'lg',
    shadow: 'md',
    bgColor: '#ffffff',
    borderColor: '#e5e7eb',
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: CraftCardSettings,
  },
};


function CraftCardSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-6">
      {/* Visual Props */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Appearance</label>
        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-xs text-gray-400 mb-1 block">Padding</label>
                <select
                    value={props.padding || 'md'}
                    onChange={(e) => setProp((p: CraftCardProps) => (p.padding = e.target.value as CraftCardProps['padding']))}
                    className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5"
                >
                    <option value="none">None</option>
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                </select>
             </div>
             <div>
                <label className="text-xs text-gray-400 mb-1 block">Radius</label>
                <select
                    value={props.radius || 'lg'}
                    onChange={(e) => setProp((p: CraftCardProps) => (p.radius = e.target.value as CraftCardProps['radius']))}
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

       {/* Shadow */}
       <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Shadow</label>
         <div className="flex rounded-md shadow-sm" role="group">
            {['none', 'sm', 'md', 'lg'].map((shadow) => (
                <button
                    key={shadow}
                    onClick={() => setProp((p: CraftCardProps) => p.shadow = shadow as any)}
                    className={cn(
                        "flex-1 px-2 py-2 text-xs font-medium border first:rounded-l-lg last:rounded-r-lg focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-700 uppercase",
                        props.shadow === shadow
                            ? "bg-blue-50 border-blue-500 text-blue-700 z-10"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                >
                    {shadow}
                </button>
            ))}
        </div>
       </div>

      {/* Colors */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Colors</label>
        <div className="grid grid-cols-1 gap-3">
             <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Background</span>
                <input
                    type="color"
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) => setProp((p: CraftCardProps) => (p.bgColor = e.target.value))}
                    className="w-8 h-8 rounded border-2 border-gray-200 cursor-pointer"
                />
             </div>
        </div>
      </div>
    </div>
  );
}

