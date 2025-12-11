import { useNode } from '@craftjs/core';
import React from 'react';

export const Container = ({ children, padding, backgroundColor }: { children?: React.ReactNode; padding: string; backgroundColor: string }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref)); }} 
      className="w-full border border-dashed border-gray-200 min-h-[100px] transition-colors"
      style={{ padding: `${padding}px`, backgroundColor }}
    >
      {children}
    </div>
  );
};

const ContainerSettings = () => {
    const { setProp, props } = useNode((node) => ({
      props: node.data.props,
    }));
  
    return (
      <div className="flex flex-col gap-3">
        <label className="text-sm text-gray-600">
          Padding (px)
          <input 
              type="number" 
              value={props.padding} 
              onChange={(e) => setProp((props: any) => props.padding = e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="text-sm text-gray-600">
          Background Color
          <input 
              type="color" 
              value={props.backgroundColor} 
              onChange={(e) => setProp((props: any) => props.backgroundColor = e.target.value)}
              className="w-full mt-1 h-10 border border-gray-300 rounded cursor-pointer"
          />
        </label>
      </div>
    )
  }

Container.craft = {
    displayName: 'Container',
    props: {
        padding: '20',
        backgroundColor: '#ffffff',
    },
    related: {
        settings: ContainerSettings,
    },
    rules: {
        canDrag: () => true,
    }
}
