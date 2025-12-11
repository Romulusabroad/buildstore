import { useNode } from '@craftjs/core';


interface ButtonProps {
  text?: string;
  color?: string; // e.g., 'blue', 'green', 'red'
}

export const Button = ({ text = "Click me", color = "blue" }: ButtonProps) => {
  const { connectors: { connect, drag } } = useNode();
  
  const getColorClass = (c: string) => {
      switch(c) {
          case 'red': return 'bg-red-500 hover:bg-red-600';
          case 'green': return 'bg-green-500 hover:bg-green-600';
          case 'purple': return 'bg-purple-500 hover:bg-purple-600';
          default: return 'bg-blue-500 hover:bg-blue-600'; // blue
      }
  };

  return (
    <button 
      ref={(ref) => { if (ref) connect(drag(ref!)); }} 
      className={`px-4 py-2 text-white rounded shadow transition-colors ${getColorClass(color)}`}
    >
      {text}
    </button>
  );
};

const ButtonSettings = () => {
  const { setProp, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm text-gray-600">
        Button Text
        <input 
            type="text" 
            value={props.text} 
            onChange={(e) => setProp((props: any) => props.text = e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
        />
      </label>
      <label className="text-sm text-gray-600">
        Color
        <select
            value={props.color}
            onChange={(e) => setProp((props: any) => props.color = e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
        >
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="red">Red</option>
            <option value="purple">Purple</option>
        </select>
      </label>
    </div>
  )
}

Button.craft = {
    displayName: 'Button',
    props: {
        text: 'Click me',
        color: 'blue'
    },
    related: {
        settings: ButtonSettings,
    },
    rules: {
        canDrag: () => true,
    }
}
