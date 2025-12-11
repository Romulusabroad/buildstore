import React from 'react';
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface AccordionProps {
  items?: FAQItem[];
  className?: string;
}

const defaultItems: FAQItem[] = [
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day money-back guarantee on all products. If you are not satisfied, simply return the item in its original condition for a full refund.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days delivery. Free shipping on orders over $50.',
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship to over 100 countries worldwide. International shipping rates and times vary by location.',
  },
];

export const Accordion = ({
  items = defaultItems,
  className,
}: AccordionProps) => {
  const { connectors: { connect, drag } } = useNode();
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={cn('w-full space-y-2', className)}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">{item.question}</span>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-gray-500 transition-transform duration-200',
                openIndex === index && 'rotate-180'
              )}
            />
          </button>
          
          <div
            className={cn(
              'overflow-hidden transition-all duration-200',
              openIndex === index ? 'max-h-96' : 'max-h-0'
            )}
          >
            <div className="p-4 pt-0 text-gray-600 leading-relaxed">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

Accordion.craft = {
  displayName: 'Accordion',
  props: {
    items: defaultItems,
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: AccordionSettings,
  },
};

function AccordionSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  const items = props.items || defaultItems;

  const updateItem = (index: number, field: 'question' | 'answer', value: string) => {
    setProp((p: AccordionProps) => {
      const newItems = [...(p.items || defaultItems)];
      newItems[index] = { ...newItems[index], [field]: value };
      p.items = newItems;
    });
  };

  const addItem = () => {
    setProp((p: AccordionProps) => {
      p.items = [...(p.items || defaultItems), { question: 'New Question?', answer: 'Answer here...' }];
    });
  };

  const removeItem = (index: number) => {
    setProp((p: AccordionProps) => {
      const newItems = [...(p.items || defaultItems)];
      newItems.splice(index, 1);
      p.items = newItems;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">FAQ Items</label>
        <button
          onClick={addItem}
          className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add
        </button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {items.map((item: FAQItem, index: number) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Item {index + 1}</span>
              <button
                onClick={() => removeItem(index)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              value={item.question}
              onChange={(e) => updateItem(index, 'question', e.target.value)}
              placeholder="Question"
              className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
            />
            <textarea
              value={item.answer}
              onChange={(e) => updateItem(index, 'answer', e.target.value)}
              placeholder="Answer"
              rows={2}
              className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
