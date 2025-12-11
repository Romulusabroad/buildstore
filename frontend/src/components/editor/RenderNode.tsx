import { useNode, useEditor } from '@craftjs/core';
import { cn } from '@/lib/utils';

interface RenderNodeProps {
  render: React.ReactElement;
}

export const RenderNode = ({ render }: RenderNodeProps) => {
  const { id } = useNode();
  const { isActive } = useEditor((_, query) => ({
    isActive: query.getEvent('selected').contains(id),
  }));

  const {
    isHover,
    name,
    connectors: { drag },
  } = useNode((node) => ({
    isHover: node.events.hovered,
    name: node.data.custom?.displayName || node.data.displayName || node.data.name || 'Component',
  }));

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={cn(
        'relative',
        isHover && !isActive && 'outline-2 outline-dashed outline-blue-300',
        isActive && 'outline-2 outline-solid outline-blue-500 ring-2 ring-blue-500'
      )}
    >
      {/* Selection Label */}
      {isActive && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-t font-medium z-50 shadow-sm">
          {name}
        </div>
      )}
      {render}
    </div>
  );
};

export default RenderNode;
