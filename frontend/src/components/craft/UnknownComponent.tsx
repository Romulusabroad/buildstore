import { useNode } from '@craftjs/core';


export const UnknownComponent = ({ type, content }: { type: string, content?: any }) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref)); }} 
      className="p-4 border-2 border-red-500 bg-red-50 text-red-700 rounded-lg m-4"
    >
      <h3 className="font-bold">⚠️ Unknown Component: {type}</h3>
      <pre className="text-xs mt-2 overflow-auto max-h-40 bg-white p-2 border border-red-200 rounded">
        {JSON.stringify(content, null, 2)}
      </pre>
    </div>
  );
};

UnknownComponent.craft = {
  displayName: 'Unknown',
  props: {
    type: 'Unknown',
    content: {},
  },
  rules: {
    canDrag: () => true,
  }
};
