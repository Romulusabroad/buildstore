
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

export interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  avatar?: string;
  rating?: number;
  className?: string;
}

export const Testimonial = ({
  content = "This product completely transformed our workflow. Highly recommended!",
  author = "Jane Doe",
  role = "CEO, TechCorp",
  avatar = "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  rating = 5,
  className,
}: TestimonialProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={cn(
        'flex flex-col p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="flex space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={cn(
              "w-4 h-4", 
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            )} 
          />
        ))}
      </div>
      
      <p className="flex-1 text-gray-700 italic mb-6 leading-relaxed">"{content}"</p>
      
      <div className="flex items-center">
        {avatar && (
            <img 
                src={avatar} 
                alt={author} 
                className="w-10 h-10 rounded-full object-cover mr-3 bg-gray-200"
            />
        )}
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{author}</h4>
          <p className="text-gray-500 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
};

Testimonial.craft = {
  displayName: 'Testimonial',
  props: {
    content: "This product completely transformed our workflow. Highly recommended!",
    author: "Jane Doe",
    role: "CEO, TechCorp",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    rating: 5,
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: TestimonialSettings,
  },
};

function TestimonialSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-3 p-3">
        <label className="block text-xs font-medium text-gray-700">Quote</label>
        <textarea
            className="w-full text-sm p-2 border rounded"
            rows={3}
            value={props.content}
            onChange={(e) => setProp((p: TestimonialProps) => p.content = e.target.value)}
        />
        
        <label className="block text-xs font-medium text-gray-700">Author</label>
        <input
            className="w-full text-sm p-2 border rounded"
            value={props.author}
            onChange={(e) => setProp((p: TestimonialProps) => p.author = e.target.value)}
        />

        <label className="block text-xs font-medium text-gray-700">Role</label>
        <input
            className="w-full text-sm p-2 border rounded"
            value={props.role}
            onChange={(e) => setProp((p: TestimonialProps) => p.role = e.target.value)}
        />

         <label className="block text-xs font-medium text-gray-700">Avatar URL</label>
        <input
            className="w-full text-sm p-2 border rounded"
            value={props.avatar}
            onChange={(e) => setProp((p: TestimonialProps) => p.avatar = e.target.value)}
        />
        
         <label className="block text-xs font-medium text-gray-700">Rating (1-5)</label>
        <input
            type="number"
            min={1}
            max={5}
            className="w-full text-sm p-2 border rounded"
            value={props.rating}
            onChange={(e) => setProp((p: TestimonialProps) => p.rating = parseInt(e.target.value))}
        />
    </div>
  );
}
