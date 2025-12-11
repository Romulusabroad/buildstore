import { useNode } from '@craftjs/core';
import { Megaphone } from 'lucide-react';

interface BannerStripProps {
  text: string;
  bgColor?: string;
  textColor?: string;
  icon?: boolean;
}

export const BannerStrip = ({ 
  text = 'Free Shipping on Orders over $50! 🚚',
  bgColor = '#1e40af',
  textColor = '#ffffff',
  icon = true,
}: BannerStripProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref as HTMLElement)); }}
      className="w-full py-2 px-4 text-center text-sm font-medium"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && <Megaphone className="w-4 h-4" />}
        <span className="animate-pulse">{text}</span>
      </div>
    </div>
  );
};

const BannerStripSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Text</label>
        <input
          type="text"
          value={props.text || ''}
          onChange={(e) => setProp((p: BannerStripProps) => p.text = e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
          placeholder="Free Shipping on Orders over $50!"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Background</label>
          <input
            type="color"
            value={props.bgColor || '#1e40af'}
            onChange={(e) => setProp((p: BannerStripProps) => p.bgColor = e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Text</label>
          <input
            type="color"
            value={props.textColor || '#ffffff'}
            onChange={(e) => setProp((p: BannerStripProps) => p.textColor = e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showIcon"
          checked={props.icon !== false}
          onChange={(e) => setProp((p: BannerStripProps) => p.icon = e.target.checked)}
          className="rounded"
        />
        <label htmlFor="showIcon" className="text-sm text-gray-600">Show Icon</label>
      </div>
    </div>
  );
};

BannerStrip.craft = {
  displayName: 'Banner Strip',
  props: {
    text: 'Free Shipping on Orders over $50! 🚚',
    bgColor: '#1e40af',
    textColor: '#ffffff',
    icon: true,
  },
  related: {
    settings: BannerStripSettings,
  },
};

export default BannerStrip;
