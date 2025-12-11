import type { ReactNode } from 'react';
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';

export interface GridProps {
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  mobileCollapse?: boolean;
  layout?: 'grid' | 'masonry';
  children?: ReactNode;
}

const columnsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 @3xl:grid-cols-2',
  3: 'grid-cols-1 @3xl:grid-cols-2 @5xl:grid-cols-3',
  4: 'grid-cols-1 @3xl:grid-cols-2 @5xl:grid-cols-4',
  6: 'grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-6',
  12: 'grid-cols-4 @3xl:grid-cols-6 @5xl:grid-cols-12',
};

const gapMap = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-8',
};

const masonryMap = {
  1: 'columns-1',
  2: 'columns-1 @3xl:columns-2',
  3: 'columns-1 @3xl:columns-2 @5xl:columns-3',
  4: 'columns-1 @3xl:columns-2 @5xl:columns-4',
  6: 'columns-2 @3xl:columns-3 @5xl:columns-6',
  12: 'columns-4', // Fallback
};

import { motion } from 'framer-motion';

export const Grid = ({
  columns = 2,
  gap = 'md',
  mobileCollapse = true,
  layout = 'grid',
  children,
}: GridProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <motion.div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={cn(
        layout === 'masonry' ? 'block' : 'grid',
        layout === 'masonry' 
            ? cn(masonryMap[columns], gapMap[gap], 'space-y-4') // space-y for masonry items vertical gap
            : cn(mobileCollapse ? columnsMap[columns] : `grid-cols-${columns}`, gapMap[gap])
      )}
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

Grid.craft = {
  displayName: 'Grid',
  props: {
    columns: 2,
    gap: 'md',
    mobileCollapse: true,
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: GridSettings,
  },
};


function GridSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-6">
       {/* Layout Type */}
       <div className="flex bg-gray-100 p-1 rounded-lg">
           <button
             onClick={() => setProp((p: GridProps) => p.layout = 'grid')}
             className={cn(
               "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
               (!props.layout || props.layout === 'grid') ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"
             )}
           >
             Grid
           </button>
           <button
             onClick={() => setProp((p: GridProps) => p.layout = 'masonry')}
             className={cn(
               "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
               props.layout === 'masonry' ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"
             )}
           >
             Masonry
           </button>
       </div>

      {/* Columns */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Columns</label>
            <span className="text-xs font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">{props.columns || 2}</span>
        </div>
        <input
          type="range"
          min="1"
          max="6"
          step="1"
          value={props.columns || 2}
          onChange={(e) => setProp((p: GridProps) => (p.columns = parseInt(e.target.value) as GridProps['columns']))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 font-mono">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
        </div>
      </div>

      {/* Gap */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gap</label>
        <div className="grid grid-cols-4 gap-2">
            {['none', 'sm', 'md', 'lg'].map((gap) => (
                <button
                    key={gap}
                    onClick={() => setProp((p: GridProps) => p.gap = gap as any)}
                    className={cn(
                        "text-xs py-2 rounded border transition-all capitalized",
                        props.gap === gap
                            ? "bg-blue-50 border-blue-500 text-blue-700 font-medium ring-1 ring-blue-500"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                >
                    {gap}
                </button>
            ))}
        </div>
      </div>

      {/* Mobile Collapse */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">Collapse on Mobile</span>
        <button
            onClick={() => setProp((p: GridProps) => p.mobileCollapse = !p.mobileCollapse)}
            className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                props.mobileCollapse !== false ? "bg-blue-600" : "bg-gray-200"
            )}
        >
            <span
                className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    props.mobileCollapse !== false ? "translate-x-6" : "translate-x-1"
                )}
            />
        </button>
      </div>
    </div>
  );
}

