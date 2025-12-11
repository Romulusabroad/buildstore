import { useState, useRef } from 'react';
// @ts-expect-error: No type declaration available for color-thief-browser
import ColorThief from 'color-thief-browser';
import { 
  Store, Globe, DollarSign, Package, Upload, Users, 
  Target, ChevronRight, ChevronLeft, Sparkles,
  Sun, Gift, Star, Layers, CheckCircle2, Circle, Calendar
} from 'lucide-react';

// Types
interface WizardData {
  shopName: string;
  pageType: 'landing' | 'product' | 'story' | 'contact' | 'blog';
  industry: string;
  language: string;
  currency: string;
  productName: string;
  productDescription: string;
  logoUrl: string;
  productImageUrl: string;
  primaryColor: string;
  targetAudience: string;
  competitiveStrategy: 'cost' | 'premium' | 'innovation' | 'trust' | 'efficiency';
  // New Design System (4 Dimensions)
  designLayout: 'minimalist' | 'grid' | 'magazine' | 'immersive' | 'split';
  designPalette: 'monochromatic' | 'morandi' | 'contrast' | 'earthy' | 'pastel';
  designTone: 'high-key' | 'low-key' | 'warm' | 'cool' | 'neutral';
  designArt: 'minimalist' | 'classic' | 'abstract' | 'pop' | 'organic' | 'cyberpunk';
  campaignMode: 'standard' | 'blackfriday' | 'christmas' | 'newyear' | 'summer';
  // New Content Options
  voiceTone: 'professional' | 'friendly' | 'humorous' | 'luxury' | 'confident';
  textLength: 'short' | 'medium' | 'long';
  sections: string[];
  scrollEffect: 'none' | 'parallax' | 'fixed' | 'multilayer';
  parallaxSpeed: 'slow' | 'medium' | 'fast';
  animationStyle: 'none' | 'gentle' | 'moderate' | 'energetic';
  // Addons
  showCustomCursor: boolean;
  showScrollProgress: boolean;
  showPageLoader: boolean;
}

interface CreationWizardProps {
  onComplete: (data: WizardData) => void;
  onCancel: () => void;
}

// Pre-defined shop names for quick selection
const shopNameSuggestions = [
  { name: 'Lumina', icon: '✨' },
  { name: 'Artisan Studio', icon: '🎨' },
  { name: 'Urban Style', icon: '🏙️' },
  { name: 'Nature\'s Best', icon: '🌿' },
  { name: 'Tech Hub', icon: '💻' },
  { name: 'Gourmet Kitchen', icon: '👨‍🍳' },
];

const industries = [
  { id: 'saas', name: 'SaaS / Tech', icon: '💻', color: 'from-blue-500 to-cyan-500' },
  { id: 'fashion', name: 'Fashion', icon: '👗', color: 'from-pink-500 to-rose-500' },
  { id: 'food', name: 'Food & Drink', icon: '🍕', color: 'from-orange-500 to-amber-500' },
  { id: 'beauty', name: 'Beauty', icon: '💄', color: 'from-purple-500 to-pink-500' },
  { id: 'home', name: 'Home & Decor', icon: '🏠', color: 'from-emerald-500 to-teal-500' },
  { id: 'services', name: 'Services', icon: '💼', color: 'from-slate-500 to-gray-600' },
];

const pageTypes = [
  { id: 'landing', name: 'Homepage', icon: '🏠', desc: 'Balanced mix for any business' },
  { id: 'product', name: 'Product Showcase', icon: '🛍️', desc: 'Focus on selling products', highlight: true },
  { id: 'story', name: 'Brand Story', icon: '📖', desc: 'Narrative & values focus' },
  { id: 'contact', name: 'Contact Us', icon: '📞', desc: 'Locations & easy contact' },
  { id: 'blog', name: 'Blog / News', icon: '📰', desc: 'Articles & updates' },
];

const languages = [
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'zh', name: '中文', flag: '🇨🇳' },
  { id: 'ja', name: '日本語', flag: '🇯🇵' },
  { id: 'ko', name: '한국어', flag: '🇰🇷' },
  { id: 'es', name: 'Español', flag: '🇪🇸' },
  { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

const currencies = [
  { id: 'USD', symbol: '$', name: 'USD' },
  { id: 'CNY', symbol: '¥', name: 'CNY' },
  { id: 'JPY', symbol: '¥', name: 'JPY' },
  { id: 'EUR', symbol: '€', name: 'EUR' },
  { id: 'GBP', symbol: '£', name: 'GBP' },
  { id: 'KRW', symbol: '₩', name: 'KRW' },
];

// Pre-defined product templates by industry
const productTemplates: Record<string, { name: string; desc: string; icon: string }[]> = {
  saas: [
    { name: 'AI Assistant Pro', desc: 'Smart automation tool', icon: '🤖' },
    { name: 'CloudSync', desc: 'Seamless data sync', icon: '☁️' },
    { name: 'Analytics Dashboard', desc: 'Business insights', icon: '📊' },
  ],
  fashion: [
    { name: 'Designer Handbag', desc: 'Italian leather', icon: '👜' },
    { name: 'Cashmere Sweater', desc: 'Premium wool', icon: '🧥' },
    { name: 'Silk Scarf', desc: 'Handcrafted luxury', icon: '🧣' },
  ],
  food: [
    { name: 'Artisan Coffee', desc: 'Single origin beans', icon: '☕' },
    { name: 'Organic Honey', desc: 'Farm fresh', icon: '🍯' },
    { name: 'Gourmet Chocolate', desc: 'Belgian craftsmanship', icon: '🍫' },
  ],
  beauty: [
    { name: 'Serum Collection', desc: 'Anti-aging formula', icon: '💧' },
    { name: 'Luxury Lipstick', desc: 'Long-lasting color', icon: '💋' },
    { name: 'Skincare Set', desc: 'Complete routine', icon: '✨' },
  ],
  home: [
    { name: 'Smart Lamp', desc: 'Voice controlled', icon: '💡' },
    { name: 'Cozy Throw Blanket', desc: 'Soft cashmere', icon: '🛋️' },
    { name: 'Ceramic Vase', desc: 'Handmade artisan', icon: '🏺' },
  ],
  services: [
    { name: 'Consulting Package', desc: 'Expert guidance', icon: '📋' },
    { name: 'Coaching Program', desc: '1-on-1 sessions', icon: '🎯' },
    { name: 'Design Service', desc: 'Custom solutions', icon: '🎨' },
  ],
};

// Pre-defined audience templates
const audienceTemplates = [
  { id: 'professionals', name: 'Busy Professionals', icon: '💼', desc: '25-45, career focused' },
  { id: 'students', name: 'Students', icon: '📚', desc: '18-25, budget conscious' },
  { id: 'parents', name: 'Parents', icon: '👨‍👩‍👧', desc: 'Family focused' },
  { id: 'creatives', name: 'Creatives', icon: '🎨', desc: 'Designers, artists' },
  { id: 'entrepreneurs', name: 'Entrepreneurs', icon: '🚀', desc: 'Startup founders' },
  { id: 'luxury', name: 'Luxury Seekers', icon: '💎', desc: 'High-end taste' },
];

const strategies = [
  { id: 'cost', emoji: '💰', name: 'Best Value', desc: 'Competitive pricing', color: 'from-green-500 to-emerald-600' },
  { id: 'premium', emoji: '💎', name: 'Premium', desc: 'Luxury positioning', color: 'from-amber-500 to-yellow-600' },
  { id: 'innovation', emoji: '🚀', name: 'Innovation', desc: 'Tech-forward', color: 'from-blue-500 to-indigo-600' },
  { id: 'trust', emoji: '🤝', name: 'Trust', desc: 'Reliability first', color: 'from-teal-500 to-cyan-600' },
  { id: 'efficiency', emoji: '⚡', name: 'Speed', desc: 'Fast & easy', color: 'from-orange-500 to-red-600' },
];

const designLayouts = [
  { id: 'minimalist', name: 'Minimalist', desc: 'Clean, airy, focused', icon: '✨' },
  { id: 'grid', name: 'Grid-based', desc: 'Structured & orderly', icon: '▦' },
  { id: 'magazine', name: 'Magazine', desc: 'Editorial narrative', icon: '📰' },
  { id: 'immersive', name: 'Immersive', desc: 'Full-screen visuals', icon: '🎬' },
  { id: 'split', name: 'Split-screen', desc: 'Dual focus', icon: '🌗' },
];

const designPalettes = [
  { id: 'monochromatic', name: 'Monochromatic', desc: 'Clean & cohesive', color: 'from-slate-200 to-slate-800', preview: '⚫' },
  { id: 'morandi', name: 'Morandi', desc: 'Muted & elegant', color: 'from-stone-300 to-stone-400', preview: '🟤' },
  { id: 'contrast', name: 'High Contrast', desc: 'Bold & energetic', color: 'from-yellow-400 to-black', preview: '🌓' },
  { id: 'earthy', name: 'Earthy', desc: 'Natural & warm', color: 'from-emerald-700 to-amber-800', preview: '🌿' },
  { id: 'pastel', name: 'Pastel', desc: 'Soft & dreamy', color: 'from-pink-200 to-blue-200', preview: '🌸' },
];

const designTones = [
  { id: 'high-key', name: 'High Key', desc: 'Bright & pure', icon: '☀️' },
  { id: 'low-key', name: 'Low Key', desc: 'Dark & dramatic', icon: '🌑' },
  { id: 'warm', name: 'Warm', desc: 'Cozy & nostalgic', icon: '🔥' },
  { id: 'cool', name: 'Cool', desc: 'Calm & sleek', icon: '❄️' },
  { id: 'neutral', name: 'Neutral', desc: 'Balanced & real', icon: '⚖️' },
];

const designArts = [
  { id: 'minimalist', name: 'Minimalist Art', desc: 'Simple forms', color: 'from-slate-800 to-slate-900', preview: '⚪' },
  { id: 'classic', name: 'Classic', desc: 'Timeless style', color: 'from-amber-700 to-amber-900', preview: '🏛️' },
  { id: 'abstract', name: 'Abstract', desc: 'Emotional forms', color: 'from-indigo-500 to-purple-600', preview: '🎨' },
  { id: 'pop', name: 'Pop Art', desc: 'Bold & colorful', color: 'from-pink-500 to-yellow-400', preview: '🍭' },
  { id: 'organic', name: 'Organic', desc: 'Natural flow', color: 'from-green-600 to-teal-700', preview: '🍃' },
  { id: 'cyberpunk', name: 'Cyberpunk', desc: 'Neon future', color: 'from-fuchsia-600 to-cyan-500', preview: '🤖' },
];

const campaigns = [
  { id: 'standard', name: 'Standard', desc: 'Everyday', icon: Star, bgClass: 'bg-gray-100', textClass: 'text-gray-700' },
  { id: 'blackfriday', name: 'Black Friday', desc: 'Big Sale', icon: Target, bgClass: 'bg-gradient-to-br from-gray-900 to-red-900', textClass: 'text-white' },
  { id: 'christmas', name: 'Christmas', desc: 'Holiday', icon: Gift, bgClass: 'bg-gradient-to-br from-red-600 to-green-700', textClass: 'text-white' },
  { id: 'newyear', name: 'New Year', desc: 'Fresh Start', icon: Sparkles, bgClass: 'bg-gradient-to-br from-amber-500 to-red-600', textClass: 'text-white' },
  { id: 'summer', name: 'Summer', desc: 'Hot Deals', icon: Sun, bgClass: 'bg-gradient-to-br from-yellow-400 to-orange-500', textClass: 'text-white' },
];

const voiceTones = [
  { id: 'professional', name: 'Professional', desc: 'Trust & Expertise', icon: '👔' },
  { id: 'friendly', name: 'Friendly', desc: 'Warm & Welcoming', icon: '👋' },
  { id: 'humorous', name: 'Humorous', desc: 'Fun & Witty', icon: '🤪' },
  { id: 'luxury', name: 'Luxury', desc: 'Elegant & Refined', icon: '💎' },
  { id: 'confident', name: 'Confident', desc: 'Bold & Direct', icon: '🦁' },
];

const textLengths = [
  { id: 'short', name: 'Short', desc: 'Concise & punchy', icon: '⚡' },
  { id: 'medium', name: 'Medium', desc: 'Balanced detail', icon: '📝' },
  { id: 'long', name: 'Long', desc: 'Detailed storytelling', icon: '📖' },
];

const sectionsByPageType: Record<string, { id: string; name: string; icon: string; required: boolean }[]> = {
  landing: [
    { id: 'hero', name: 'Hero Section', icon: '✨', required: true },
    { id: 'features', name: 'Features', icon: '⭐', required: false },
    { id: 'products', name: 'Product Grid', icon: '🛍️', required: false },
    { id: 'testimonials', name: 'Testimonials', icon: '💬', required: false },
    { id: 'faq', name: 'FAQ', icon: '❓', required: false },
    { id: 'newsletter', name: 'Newsletter', icon: '✉️', required: false },
    { id: 'footer', name: 'Footer', icon: '👣', required: true },
  ],
  product: [
    { id: 'hero', name: 'Product Hero', icon: '📸', required: true },
    { id: 'features', name: 'Specs & Details', icon: '📏', required: true },
    { id: 'products', name: 'Gallery', icon: '🖼️', required: false },
    { id: 'reviews', name: 'Reviews', icon: '⭐', required: false }, // New
    { id: 'faq', name: 'FAQ', icon: '❓', required: false },
    { id: 'cta', name: 'Buy Now Banner', icon: '💳', required: false }, // New
    { id: 'footer', name: 'Footer', icon: '👣', required: true },
  ],
  story: [
    { id: 'hero', name: 'Hero (Atmospheric)', icon: '✨', required: true },
    { id: 'story', name: 'Our Story', icon: '📖', required: true }, // New
    { id: 'timeline', name: 'Timeline', icon: '⏳', required: false }, // New
    { id: 'values', name: 'Core Values', icon: '💎', required: false }, // New
    { id: 'team', name: 'Meet the Team', icon: '👥', required: false }, // New
    { id: 'footer', name: 'Footer', icon: '👣', required: true },
  ],
  contact: [
    { id: 'hero', name: 'Simple Hero', icon: '✨', required: true },
    { id: 'contact_grid', name: 'Contact Methods', icon: '📞', required: true },
    { id: 'locations', name: 'Our Locations', icon: '🗺️', required: false },
    { id: 'faq', name: 'FAQ', icon: '❓', required: false },
    { id: 'form', name: 'Message Form', icon: '✉️', required: false },
    { id: 'footer', name: 'Footer', icon: '👣', required: true },
  ],
  blog: [
    { id: 'hero', name: 'Featured Post', icon: '📰', required: true },
    { id: 'articles', name: 'Latest Articles', icon: '📝', required: true },
    { id: 'categories', name: 'Categories', icon: '🏷️', required: false },
    { id: 'newsletter', name: 'Newsletter', icon: '✉️', required: false },
    { id: 'footer', name: 'Footer', icon: '👣', required: true },
  ],
};

export const CreationWizard = ({ onComplete, onCancel }: CreationWizardProps) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    shopName: '',
    pageType: 'landing',
    industry: 'saas',
    language: 'en',
    currency: 'USD',
    productName: '',
    productDescription: '',
    logoUrl: '',
    productImageUrl: '',
    primaryColor: '#3B82F6',
    targetAudience: 'professionals',
    competitiveStrategy: 'innovation',

    designLayout: 'minimalist',
    designPalette: 'monochromatic',
    designTone: 'neutral',
    designArt: 'minimalist',
    campaignMode: 'standard',
    voiceTone: 'professional',
    textLength: 'medium',
    sections: ['hero', 'features', 'products', 'testimonials', 'footer'],
    scrollEffect: 'none',
    parallaxSpeed: 'medium',
    animationStyle: 'gentle',
    showCustomCursor: false,
    showScrollProgress: false,
    showPageLoader: false,
  });

  const productImageRef = useRef<HTMLInputElement>(null);

  const updateData = (updates: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  // derived state
  const currentAvailableSections = sectionsByPageType[data.pageType] || sectionsByPageType.landing;

  const handlePageTypeChange = (typeId: WizardData['pageType']) => {
    const newSections = (sectionsByPageType[typeId] || sectionsByPageType.landing)
        .filter(s => s.required)
        .map(s => s.id);
    
    // Add default optional sections if needed
    if (newSections.length < 3) {
         (sectionsByPageType[typeId] || sectionsByPageType.landing).slice(0, 4).forEach(s => {
            if(!newSections.includes(s.id)) newSections.push(s.id);
        });
    }
    
    updateData({ pageType: typeId, sections: newSections });
  };

  // Color extraction from uploaded image
  const extractColor = async (imageUrl: string) => {
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const colorThief = new ColorThief();
      const [r, g, b] = colorThief.getColor(img);
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      updateData({ primaryColor: hex });
    } catch (error) {
      console.error('Color extraction failed:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const url = reader.result as string;
      updateData({ productImageUrl: url });
      await extractColor(url);
    };
    reader.readAsDataURL(file);
  };

  const selectProduct = (product: { name: string; desc: string }) => {
    updateData({ productName: product.name, productDescription: product.desc });
  };

  const canProceed = () => {
    switch (step) {
      case 1: return data.shopName.length > 0;
      case 2: return data.productName.length > 0;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else onComplete(data);
  };

  const toggleSection = (sectionId: string) => {
    const required = currentAvailableSections.find(s => s.id === sectionId)?.required;
    if (required) return;

    const current = new Set(data.sections);
    if (current.has(sectionId)) {
      current.delete(sectionId);
    } else {
      current.add(sectionId);
    }
    updateData({ sections: Array.from(current) });
  };

  const stepTitles = ['Brand', 'Product', 'Strategy', 'Style'];

  return (
    <div className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-slate-900/80 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Build with BuildStore</h1>
            <p className="text-sm text-slate-400">Step {step}/4: {stepTitles[step - 1]}</p>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10">
            ✕
          </button>
        </div>
        {/* Progress */}
        <div className="mt-3 flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-blue-500' : 'bg-slate-700'}`}
            />
          ))}
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {/* Step 1: Brand */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center mb-8">
              <Store className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white">Your Brand Identity</h2>
            </div>

            {/* Page Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">What are you building?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {pageTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handlePageTypeChange(type.id as WizardData['pageType'])}
                    className={`relative p-4 rounded-xl border text-left transition-all ${
                      data.pageType === type.id
                        ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                     <div className="flex items-center gap-3">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <div className="text-white font-semibold">{type.name}</div>
                          <div className="text-xs text-slate-400">{type.desc}</div>
                        </div>
                     </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Shop Name Cards */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Shop Name - Pick or Type</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-3">
                {shopNameSuggestions.map((shop) => (
                  <button
                    key={shop.name}
                    onClick={() => updateData({ shopName: shop.name })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      data.shopName === shop.name
                        ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">{shop.icon}</span>
                    <div className="text-xs text-white mt-1">{shop.name}</div>
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={data.shopName}
                onChange={(e) => updateData({ shopName: e.target.value })}
                placeholder="Or type your own..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500"
              />
            </div>

            {/* Industry Cards */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Industry</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {industries.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => updateData({ industry: ind.id })}
                    className={`relative p-4 rounded-xl border overflow-hidden transition-all ${
                      data.industry === ind.id
                        ? 'border-white ring-2 ring-white'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${ind.color} opacity-80`} />
                    <div className="relative text-white text-center">
                      <span className="text-3xl">{ind.icon}</span>
                      <div className="font-semibold text-sm mt-2">{ind.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language & Currency */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  <Globe className="w-4 h-4 inline mr-1" /> Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => updateData({ language: lang.id })}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        data.language === lang.id
                          ? 'bg-blue-500/20 border-blue-500'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <div className="text-xs text-white mt-1">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  <DollarSign className="w-4 h-4 inline mr-1" /> Currency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {currencies.map((cur) => (
                    <button
                      key={cur.id}
                      onClick={() => updateData({ currency: cur.id })}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        data.currency === cur.id
                          ? 'bg-blue-500/20 border-blue-500'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xl font-bold text-white">{cur.symbol}</span>
                      <div className="text-xs text-slate-400 mt-1">{cur.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Product */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center mb-8">
              <Package className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white">What Are You Selling?</h2>
            </div>

            {/* Product Templates */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Quick Pick - {industries.find(i => i.id === data.industry)?.name}</label>
              <div className="grid grid-cols-3 gap-3">
                {(productTemplates[data.industry] || productTemplates.saas).map((product) => (
                  <button
                    key={product.name}
                    onClick={() => selectProduct(product)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      data.productName === product.name
                        ? 'bg-green-500/20 border-green-500 ring-2 ring-green-500'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-3xl">{product.icon}</span>
                    <div className="text-white font-medium mt-2">{product.name}</div>
                    <div className="text-xs text-slate-400">{product.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Product Input */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Product Name</label>
                <input
                  type="text"
                  value={data.productName}
                  onChange={(e) => updateData({ productName: e.target.value })}
                  placeholder="Your product name..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Key Selling Point</label>
                <input
                  type="text"
                  value={data.productDescription}
                  onChange={(e) => updateData({ productDescription: e.target.value })}
                  placeholder="Why it's special..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Product Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Product Image (Auto Theme Color)</label>
              <input
                ref={productImageRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => productImageRef.current?.click()}
                  className="flex-1 h-32 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center hover:border-white/40"
                >
                  {data.productImageUrl ? (
                    <img src={data.productImageUrl} alt="Product" className="max-h-28 max-w-full object-contain" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-500 mb-2" />
                      <span className="text-sm text-slate-500">Click to Upload</span>
                    </>
                  )}
                </button>
                {data.productImageUrl && (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div 
                      className="w-16 h-16 rounded-xl shadow-lg"
                      style={{ backgroundColor: data.primaryColor }}
                    />
                    <span className="text-xs text-slate-400">Theme Color</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Strategy */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center mb-8">
              <Target className="w-12 h-12 text-orange-400 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white">Your Strategy</h2>
            </div>

            {/* Audience Cards */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                <Users className="w-4 h-4 inline mr-1" /> Target Audience
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {audienceTemplates.map((aud) => (
                  <button
                    key={aud.id}
                    onClick={() => updateData({ targetAudience: aud.id })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      data.targetAudience === aud.id
                        ? 'bg-orange-500/20 border-orange-500 ring-2 ring-orange-500'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">{aud.icon}</span>
                    <div className="text-white font-medium mt-2">{aud.name}</div>
                    <div className="text-xs text-slate-400">{aud.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Competition Strategy */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Competitive Strategy</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {strategies.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => updateData({ competitiveStrategy: s.id as WizardData['competitiveStrategy'] })}
                    className={`relative p-4 rounded-xl border overflow-hidden transition-all ${
                      data.competitiveStrategy === s.id
                        ? 'border-white ring-2 ring-white'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-80`} />
                    <div className="relative text-white text-center">
                      <span className="text-2xl">{s.emoji}</span>
                      <div className="font-semibold text-sm mt-1">{s.name}</div>
                      <div className="text-xs opacity-80">{s.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>


            {/* Page Structure */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                <Layers className="w-4 h-4 inline mr-1" /> Page Structure
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currentAvailableSections.map((sec) => {
                  const isSelected = data.sections.includes(sec.id);
                  return (
                    <button
                      key={sec.id}
                      onClick={() => toggleSection(sec.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-500/20 border-blue-500 ring-1 ring-blue-500'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      } ${sec.required ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{sec.icon}</span>
                        <span className="text-sm text-white">{sec.name}</span>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Style */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Design DNA Sections */}
            <div className="space-y-6">
              
              {/* 1. Layout */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">1. Layout Structure</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {designLayouts.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => updateData({ designLayout: l.id as WizardData['designLayout'] })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        data.designLayout === l.id
                          ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-2xl block mb-2">{l.icon}</span>
                      <div className="text-white text-sm font-semibold">{l.name}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{l.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Color Palette */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">2. Color Palette</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {designPalettes.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => updateData({ designPalette: p.id as WizardData['designPalette'] })}
                      className={`relative p-3 rounded-xl border overflow-hidden transition-all ${
                        data.designPalette === p.id
                          ? 'border-white ring-2 ring-white'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-80`} />
                      <div className="relative z-10 text-center">
                        <span className="text-xl block mb-1">{p.preview}</span>
                        <div className="text-white text-sm font-semibold shadow-black drop-shadow-md">{p.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Image Tone */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">3. Image Tone</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {designTones.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => updateData({ designTone: t.id as WizardData['designTone'] })}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          data.designTone === t.id
                            ? 'bg-purple-500/20 border-purple-500 ring-2 ring-purple-500'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-2xl block mb-2">{t.icon}</span>
                        <div className="text-white text-sm font-semibold">{t.name}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{t.desc}</div>
                      </button>
                    ))}
                </div>
              </div>

               {/* 4. Art Style */}
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">4. Art Style</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                   {designArts.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => updateData({ designArt: a.id as WizardData['designArt'] })}
                      className={`relative p-3 rounded-xl border overflow-hidden transition-all ${
                        data.designArt === a.id
                          ? 'border-white ring-2 ring-white'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${a.color} opacity-40`} />
                      <div className="relative z-10 flex items-center gap-3">
                        <span className="text-2xl">{a.preview}</span>
                        <div className="text-left">
                           <div className="text-white text-sm font-semibold">{a.name}</div>
                           <div className="text-[10px] text-slate-300">{a.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Campaign Mode */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                <Calendar className="w-4 h-4 inline mr-1" /> Campaign Mode
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {campaigns.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateData({ campaignMode: c.id as WizardData['campaignMode'] })}
                    className={`p-4 rounded-xl border transition-all ${c.bgClass} ${
                      data.campaignMode === c.id
                        ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <c.icon className={`w-6 h-6 ${c.textClass} mb-2`} />
                    <div className={`font-bold ${c.textClass}`}>{c.name}</div>
                    <div className={`text-xs opacity-80 ${c.textClass}`}>{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Style (New) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* 5. Voice Tone */}
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">6. Voice Tone</label>
                  <div className="grid grid-cols-3 gap-3">
                    {voiceTones.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => updateData({ voiceTone: v.id as WizardData['voiceTone'] })}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          data.voiceTone === v.id
                            ? 'bg-indigo-500/20 border-indigo-500 ring-2 ring-indigo-500'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xl block mb-1">{v.icon}</span>
                        <div className="text-white text-xs font-semibold">{v.name}</div>
                        <div className="text-[10px] text-slate-400">{v.desc}</div>
                      </button>
                    ))}
                  </div>
               </div>

               {/* 6. Text Length */}
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">7. Text Length</label>
                  <div className="grid grid-cols-3 gap-3">
                    {textLengths.map((len) => (
                      <button
                        key={len.id}
                        onClick={() => updateData({ textLength: len.id as WizardData['textLength'] })}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          data.textLength === len.id
                            ? 'bg-teal-500/20 border-teal-500 ring-2 ring-teal-500'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-xl block mb-1">{len.icon}</span>
                        <div className="text-white text-xs font-semibold">{len.name}</div>
                        <div className="text-[10px] text-slate-400">{len.desc}</div>
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            {/* 5. Advanced Options */}
            <div className="pt-6 border-t border-white/10">
              <label className="block text-sm font-medium text-slate-300 mb-3">5. Advanced Options</label>
              {/* Scroll Effect Selection */}
              <div className="grid grid-cols-2 gap-3">
                 {[
                   { id: 'none', label: 'None', desc: 'Standard scrolling' },
                   { id: 'parallax', label: 'Classic Parallax', desc: 'Background moves slower' },
                   { id: 'fixed', label: 'Fixed Window', desc: 'Background stays static' },
                   { id: 'multilayer', label: '3D Multi-layer', desc: 'Complex depth effects' }
                 ].map((effect) => (
                   <div
                      key={effect.id}
                      onClick={() => updateData({ scrollEffect: effect.id as any })}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        data.scrollEffect === effect.id
                          ? 'bg-blue-500/20 border-blue-500 ring-1 ring-blue-500'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                   >
                     <div className="flex items-center gap-2 mb-1">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                           data.scrollEffect === effect.id ? 'border-blue-400 bg-blue-500' : 'border-slate-500'
                        }`}>
                           {data.scrollEffect === effect.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <div className="text-sm font-medium text-white">{effect.label}</div>
                     </div>
                     <div className="text-xs text-slate-400 pl-6">{effect.desc}</div>
                   </div>
                 ))}
              </div>

              {/* Parallax Speed (For Parallax and Mulltilayer) */}
              {(data.scrollEffect === 'parallax' || data.scrollEffect === 'multilayer') && (
                <div className="mt-3 ml-4 pl-4 border-l border-white/10 animate-in fade-in slide-in-from-top-2">
                   <label className="block text-xs font-medium text-slate-400 mb-2">Effect Speed</label>
                   <div className="flex bg-white/5 p-1 rounded-lg w-fit">
                      {['slow', 'medium', 'fast'].map(speed => (
                        <button
                          key={speed}
                          onClick={() => updateData({ parallaxSpeed: speed as WizardData['parallaxSpeed'] })}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                             data.parallaxSpeed === speed 
                              ? 'bg-blue-500 text-white shadow-sm' 
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {speed}
                        </button>
                      ))}
                   </div>
                </div>
              )}

              {/* Animation Style */}
              <div className="pt-6 mt-6 border-t border-white/10">
                 <label className="block text-sm font-medium text-slate-300 mb-3">Animation Style</label>
                 <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'none', label: 'None' },
                      { id: 'gentle', label: 'Gentle', desc: 'Fade In' },
                      { id: 'moderate', label: 'Moderate', desc: 'Slide Up' },
                      { id: 'energetic', label: 'Energetic', desc: 'Zoom/Scale' },
                    ].map((anim) => (
                      <div
                         key={anim.id}
                         onClick={() => updateData({ animationStyle: anim.id as any })}
                         className={`p-2 rounded-lg border cursor-pointer transition-all text-center ${
                           data.animationStyle === anim.id
                             ? 'bg-purple-500/20 border-purple-500 ring-1 ring-purple-500'
                             : 'bg-white/5 border-white/10 hover:bg-white/10'
                         }`}
                      >
                        <div className={`text-xs font-semibold ${data.animationStyle === anim.id ? 'text-purple-300' : 'text-slate-300'}`}>
                           {anim.label}
                        </div>
                        {anim.desc && <div className="text-[10px] text-slate-500 mt-1">{anim.desc}</div>}
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex-shrink-0 bg-slate-900 border-t border-white/10 px-8 py-6 flex justify-between items-center">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : onCancel()}
          className="flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          {step > 1 ? 'Back' : 'Cancel'}
        </button>

        <button
          disabled={!canProceed()}
          onClick={handleNext}
          className={`flex items-center px-8 py-3 rounded-xl font-bold text-lg transition-all ${
             canProceed()
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {step === 4 ? (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Site
            </>
          ) : (
            <>
              Next Step
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};


export default CreationWizard;
