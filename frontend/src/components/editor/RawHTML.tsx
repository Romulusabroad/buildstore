import { useNode } from '@craftjs/core';


export const RawHTML = ({ html = "<div>Empty HTML</div>" }: { html?: string }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref)); }} 
      className="p-2 border border-dashed border-transparent hover:border-blue-500 min-h-[50px]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

RawHTML.craft = {
    displayName: 'AI Content',
    props: {
        html: '<div>Generated Content</div>',
    },
    rules: {
        canDrag: () => true,
    }
}
