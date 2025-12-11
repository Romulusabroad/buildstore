import { useNode } from '@craftjs/core';


export const Text = ({ text, fontSize, textAlign }: { text: string; fontSize: string; textAlign: string }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref!)); }} 
      className="p-2 m-1 border border-transparent hover:border-blue-500 cursor-text min-w-[50px] min-h-[30px]"
      style={{ fontSize: fontSize + 'px', textAlign: textAlign as any }}
    >
        {/* We use specific class to ensure text is visible even if empty */}
      <p className="text-gray-800 break-words">{text}</p>
    </div>
  );
};

const TextSettings = () => {
  const { setProp, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm text-gray-600">
        Text Content
        <input 
            type="text" 
            value={props.text} 
            onChange={(e) => setProp((props: any) => props.text = e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
        />
      </label>
      <label className="text-sm text-gray-600">
        Font Size (px)
        <input 
            type="number" 
            value={props.fontSize} 
            onChange={(e) => setProp((props: any) => props.fontSize = e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
        />
      </label>
      <label className="text-sm text-gray-600">
        Alignment
        <div className="flex gap-2 mt-1">
            {['left', 'center', 'right'].map((align) => (
                <button
                    key={align}
                    className={`flex-1 p-2 border rounded ${props.textAlign === align ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-200'}`}
                    onClick={() => setProp((props: any) => props.textAlign = align)}
                >
                    {align}
                </button>
            ))}
        </div>
      </label>
    </div>
  )
}

Text.craft = {
    displayName: 'Text',
    props: {
        text: 'Edit me',
        fontSize: '16',
        textAlign: 'left',
    },
    related: {
        settings: TextSettings,
    },
    rules: {
        canDrag: () => true,
    }
}
