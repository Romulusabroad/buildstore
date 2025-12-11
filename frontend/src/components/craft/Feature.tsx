
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

export interface FeatureProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
}

import { motion } from 'framer-motion';

export const Feature = ({
  icon = 'Zap',
  title = 'Fast Performance',
  description = 'Optimized for speed and reliability, ensuring your users get the best experience.',
  className,
}: FeatureProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <motion.div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={cn(
        'flex flex-col items-start p-6 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all',
        className
      )}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
      whileHover={{ y: -5 }}
    >
      <div className="mb-4 p-3 bg-blue-100 rounded-lg text-blue-600">
        <Icon name={icon} size="md" color="currentColor" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

Feature.craft = {
  displayName: 'Feature',
  props: {
    icon: 'Zap',
    title: 'Fast Performance',
    description: 'Optimized for speed and reliability, ensuring your users get the best experience.',
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: FeatureSettings,
  },
};

function FeatureSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-3 p-3">
        <label className="block text-xs font-medium text-gray-700">Icon Name (Lucide)</label>
        <input
            className="w-full text-sm p-2 border rounded"
            value={props.icon}
            onChange={(e) => setProp((p: FeatureProps) => p.icon = e.target.value)}
        />
        
        <label className="block text-xs font-medium text-gray-700">Title</label>
        <input
            className="w-full text-sm p-2 border rounded"
            value={props.title}
            onChange={(e) => setProp((p: FeatureProps) => p.title = e.target.value)}
        />

        <label className="block text-xs font-medium text-gray-700">Description</label>
        <textarea
            rows={3}
            className="w-full text-sm p-2 border rounded"
            value={props.description}
            onChange={(e) => setProp((p: FeatureProps) => p.description = e.target.value)}
        />
    </div>
  );
}
