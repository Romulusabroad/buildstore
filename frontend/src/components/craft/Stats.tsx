import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';

export interface StatItem {
    label: string;
    value: string;
}

export interface StatsProps {
  items: StatItem[];
  className?: string;
}

const defaultItems: StatItem[] = [
    { label: 'Active Users', value: '10k+' },
    { label: 'Countries', value: '50+' },
    { label: 'Uptime', value: '99.9%' },
];

export const Stats = ({
  items = defaultItems,
  className,
}: StatsProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={cn(
        'w-full grid grid-cols-2 @3xl:grid-cols-4 gap-8 py-8 px-4 border-y border-gray-100 bg-white/50 backdrop-blur-sm',
        className
      )}
    >
      {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center justify-center text-center">
              <span className="text-3xl @3xl:text-4xl font-extrabold text-blue-600 tracking-tight">
                  {item.value}
              </span>
              <span className="mt-2 text-sm @3xl:text-base font-medium text-gray-500 uppercase tracking-widest">
                  {item.label}
              </span>
          </div>
      ))}
    </div>
  );
};

Stats.craft = {
  displayName: 'Stats',
  props: {
    items: defaultItems,
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: StatsSettings,
  },
};

function StatsSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));
  
  const items = props.items || defaultItems;

  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    setProp((p: StatsProps) => {
        const newItems = [...(p.items || defaultItems)];
        newItems[index] = { ...newItems[index], [field]: value };
        p.items = newItems;
    });
  };

  const addItem = () => {
    setProp((p: StatsProps) => {
        p.items = [...(p.items || defaultItems), { label: 'Label', value: '0' }];
    });
  };

  const removeItem = (index: number) => {
      setProp((p: StatsProps) => {
          const newItems = [...(p.items || defaultItems)];
          newItems.splice(index, 1);
          p.items = newItems;
      });
  };

  return (
    <div className="space-y-4 p-2">
        <button
          onClick={addItem}
          className="w-full px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Stat
        </button>
        {items.map((item: StatItem, index: number) => (
            <div key={index} className="flex items-center space-x-2 border p-2 rounded bg-gray-50">
                <div className="flex-1 space-y-1">
                     <input
                        className="w-full text-xs p-1 border rounded font-bold"
                        value={item.value}
                        onChange={(e) => updateStat(index, 'value', e.target.value)}
                        placeholder="Value"
                    />
                    <input
                        className="w-full text-xs p-1 border rounded uppercase tracking-wide"
                        value={item.label}
                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                        placeholder="Label"
                    />
                </div>
                <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700"
                >
                    ×
                </button>
            </div>
        ))}
    </div>
  );
}
