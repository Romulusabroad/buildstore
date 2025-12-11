import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { CtaButton } from './CtaButton';

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  cta: string;
}

export interface PricingProps {
  plans?: PricingPlan[];
  currency?: string;
  className?: string;
}

const defaultPlans: PricingPlan[] = [
  {
    name: 'Starter',
    price: '29',
    features: ['5 Projects', 'Basic Analytics', '24/7 Support'],
    isPopular: false,
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '99',
    features: ['Unlimited Projects', 'Advanced Analytics', 'Priority Support', 'Custom Domain'],
    isPopular: true,
    cta: 'Try Pro',
  },
  {
    name: 'Enterprise',
    price: '299',
    features: ['Dedicated Account Manager', 'SLA', 'Custom Integrations', 'SSO'],
    isPopular: false,
    cta: 'Contact Sales',
  },
];

import { motion } from 'framer-motion';

export const Pricing = ({
  plans = defaultPlans,
  currency = '$',
  className,
}: PricingProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={cn('w-full py-12 px-4', className)}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 @xl:grid-cols-2 @3xl:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className={cn(
              'relative flex flex-col p-8 bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl',
              plan.isPopular ? 'border-blue-500 shadow-lg scale-105 z-10' : 'border-gray-200'
            )}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
            whileHover={{ y: -10 }}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 -mr-1 -mt-1 w-24 h-24 overflow-hidden rounded-tr-2xl">
                 <div className="absolute top-0 right-0 py-1 px-4 text-xs font-bold text-white bg-blue-500 transform rotate-45 translate-x-6 translate-y-4 shadow-sm">
                   POPULAR
                 </div>
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-500 uppercase tracking-wide">{plan.name}</h3>
              <div className="mt-4 flex items-baseline text-gray-900">
                <span className="text-4xl font-extrabold tracking-tight">{currency}{plan.price}</span>
                <span className="ml-1 text-xl font-semibold text-gray-500">/mo</span>
              </div>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">{feature}</p>
                </li>
              ))}
            </ul>

            <CtaButton 
                text={plan.cta}
                variant={plan.isPopular ? 'default' : 'outline'}
                fullWidth
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

Pricing.craft = {
  displayName: 'Pricing',
  props: {
    plans: defaultPlans,
    currency: '$',
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: PricingSettings,
  },
};

function PricingSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  const plans = props.plans || defaultPlans;

  const updatePlan = (index: number, field: keyof PricingPlan, value: any) => {
    setProp((p: PricingProps) => {
      const newPlans = [...(p.plans || defaultPlans)];
      newPlans[index] = { ...newPlans[index], [field]: value };
      p.plans = newPlans;
    });
  };
  
  const updateFeature = (planIndex: number, featureIndex: number, value: string) => {
      setProp((p: PricingProps) => {
          const newPlans = [...(p.plans || defaultPlans)];
          const newFeatures = [...newPlans[planIndex].features];
          newFeatures[featureIndex] = value;
          newPlans[planIndex].features = newFeatures;
          p.plans = newPlans;
      });
  };

  return (
    <div className="space-y-4">
        {plans.map((plan: PricingPlan, index: number) => (
            <div key={index} className="p-4 bg-gray-50 border rounded-md space-y-3">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">Plan {index + 1}</span>
                    <label className="flex items-center space-x-2 text-xs">
                        <input 
                            type="checkbox" 
                            checked={plan.isPopular} 
                            onChange={(e) => updatePlan(index, 'isPopular', e.target.checked)} 
                        />
                        <span>Popular</span>
                    </label>
                </div>
                <input 
                    className="w-full text-sm p-1 border rounded"
                    value={plan.name} 
                    onChange={(e) => updatePlan(index, 'name', e.target.value)}
                    placeholder="Plan Name"
                />
                <input 
                    className="w-full text-sm p-1 border rounded"
                    value={plan.price} 
                    onChange={(e) => updatePlan(index, 'price', e.target.value)}
                    placeholder="Price"
                />
                 <input 
                    className="w-full text-sm p-1 border rounded"
                    value={plan.cta} 
                    onChange={(e) => updatePlan(index, 'cta', e.target.value)}
                    placeholder="CTA Text"
                />
                <div className="text-xs text-gray-500">Features (comma sep for now or simple list)</div>
                {plan.features.map((feature, fIdx) => (
                    <input 
                        key={fIdx}
                        className="w-full text-xs p-1 border rounded mb-1"
                        value={feature}
                        onChange={(e) => updateFeature(index, fIdx, e.target.value)}
                    />
                ))}
            </div>
        ))}
    </div>
  );
}
