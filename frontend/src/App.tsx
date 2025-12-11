import { useState, useEffect, useCallback } from 'react';
import { API_BASE } from './config';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { PageManager } from './views/PageManager';
import { DynamicTemplateRenderer } from './views/DynamicTemplateRenderer';
import { Frame, Element, useEditor } from '@craftjs/core';
// Legacy components (backward compat)
import { Container } from './components/user/Container';
import { Text } from './components/user/Text';
import { Button } from './components/user/Button';
import { RawHTML } from './components/editor/RawHTML';
// New Atomic Design components
import { Section } from './components/craft/Section';
import { Grid } from './components/craft/Grid';
import { FlexStack } from './components/craft/FlexStack';
import { Typography } from './components/craft/Typography';
import { ImageBlock } from './components/craft/ImageBlock';
import { Icon } from './components/craft/Icon';
import { CtaButton } from './components/craft/CtaButton';

// E-commerce Components
import { LogoTicker } from './components/craft/LogoTicker';
import { ProductDetail } from './components/craft/ProductDetail';
import { ProductCard } from './components/craft/ProductCard';
import { Accordion } from './components/craft/Accordion';
import { HeroCarousel } from './components/craft/HeroCarousel';
import { Pricing } from './components/craft/Pricing';
import { Stats } from './components/craft/Stats';
import { Feature } from './components/craft/Feature';
import { Testimonial } from './components/craft/Testimonial';
// Campaign Components
import { CountdownTimer } from './components/craft/CountdownTimer';
import { BannerStrip } from './components/craft/BannerStrip';
import { NavBar } from './components/craft/NavBar';
import { Footer } from './components/craft/Footer';
import { DecorationLayer } from './components/craft/DecorationLayer';
import { UnknownComponent } from './components/craft/UnknownComponent';
// Editor Components
import { EditorToolbar } from './components/editor/EditorToolbar';
import { SidebarLeft } from './components/SidebarLeft';
import { SettingsPanel } from './components/SettingsPanel';
// Wizard
import { CustomCursor } from './components/site-addons/CustomCursor';
import { ScrollProgress } from './components/site-addons/ScrollProgress';
import { PageLoader } from './components/site-addons/PageLoader';
import { CreationWizard } from './components/wizard/CreationWizard';

import { InputModal } from './components/ui/InputModal';
import { PublicSiteRenderer } from './views/PublicSiteRenderer';

// Helper to ensure text is string (prevents object-as-child crash)
const safeString = (val: unknown): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object' && val !== null) {
      // Fix for AI returning { text: "...", className: "..." }
      const v = val as Record<string, unknown>;
      if (typeof v.text === 'string') return v.text;
      if (typeof v.content === 'string') return v.content;
      if (typeof v.value === 'string') return v.value;
      return JSON.stringify(val);
  }
  return String(val);
};

interface ViewportProps {
  deviceWidth: string;
  showCustomCursor?: boolean;
  showScrollProgress?: boolean;
  showPageLoader?: boolean;
}

function Viewport({ deviceWidth, showCustomCursor, showScrollProgress, showPageLoader }: ViewportProps) {
  return (
    <div className="flex-1 overflow-auto p-4 md:p-10 flex items-start justify-center relative">
        {/* Custom Cursor moved out to avoid being trapped by transform, ensuring correct window coordinates */}
        {showCustomCursor && <CustomCursor />}

        <div 
          className="@container bg-white shadow-2xl transition-all duration-300 ease-in-out overflow-auto relative"
          style={{ 
              width: deviceWidth, 
              minHeight: '80vh', 
              maxWidth: '100%',
              transform: 'translate(0)', // TRAP: Creates a containing block for fixed descendants (NavBar, ScrollProgress)
          }}
        >
            <Frame>
                <Element is={Section} canvas bgColor="#f8fafc" paddingY="lg">
                    <Element is={FlexStack} canvas direction="column" gap="md" align="center" justify="center">
                        <Typography variant="h1" text="✨ Welcome to BuildStore" className="text-center" />
                        <Typography variant="body" text="Click 'Create New Site' to start building with AI" className="text-center text-gray-600" />
                    </Element>
                </Element>
            </Frame>
            
            {/* Site Addons - Trapped inside device screen */}
            {showScrollProgress && <ScrollProgress />}
            {showPageLoader && <PageLoader />}
        </div>
    </div>
  );
}

const resolver = {
  Container, Text, Button, RawHTML,
  Section, Grid, FlexStack, Typography, ImageBlock, Icon, CtaButton,  // E-commerce
  LogoTicker, ProductCard, Accordion, HeroCarousel, Pricing, Stats, Feature, Testimonial, ProductDetail,
  // Campaign
  CountdownTimer, BannerStrip, NavBar, Footer, DecorationLayer, UnknownComponent
};

// Helper to map Tailwind colors to Hex (simplified)
// Helper to map Tailwind colors to Hex
const inputToColor = (input: unknown): string => {
  if (!input || typeof input !== 'string') return '';
  let color = input.trim();
  if (color.startsWith('#') || color.startsWith('rgb')) return color;
  
  // Strip tailwind prefixes
  color = color.replace(/^(bg-|text-)/, '');

  // Comprehensive Tailwind Color Map
  const colorMap: Record<string, string> = {
    'white': '#ffffff', 'black': '#000000', 'transparent': 'transparent',
    'slate-50': '#f8fafc', 'slate-100': '#f1f5f9', 'slate-200': '#e2e8f0', 'slate-300': '#cbd5e1', 'slate-400': '#94a3b8', 'slate-500': '#64748b', 'slate-600': '#475569', 'slate-700': '#334155', 'slate-800': '#1e293b', 'slate-900': '#0f172a', 'slate-950': '#020617',
    'gray-50': '#f9fafb', 'gray-100': '#f3f4f6', 'gray-200': '#e5e7eb', 'gray-300': '#d1d5db', 'gray-400': '#9ca3af', 'gray-500': '#6b7280', 'gray-600': '#4b5563', 'gray-700': '#374151', 'gray-800': '#1f2937', 'gray-900': '#111827', 'gray-950': '#030712',
    'zinc-900': '#18181b', 'zinc-950': '#09090b',
    'neutral-900': '#171717', 'neutral-950': '#0a0a0a',
    'stone-900': '#1c1917', 'stone-950': '#0c0a09',
    'red-500': '#ef4444', 'red-600': '#dc2626', 'red-700': '#b91c1c',
    'orange-500': '#f97316', 'orange-600': '#ea580c',
    'amber-500': '#f59e0b', 'amber-600': '#d97706',
    'yellow-400': '#facc15', 'yellow-500': '#eab308',
    'lime-500': '#84cc16',
    'green-500': '#22c55e', 'green-600': '#16a34a', 'green-700': '#15803d',
    'emerald-500': '#10b981', 'emerald-600': '#059669', 'emerald-700': '#047857',
    'teal-500': '#14b8a6', 'teal-600': '#0d9488', 'teal-700': '#0f766e',
    'cyan-500': '#06b6d4', 'cyan-600': '#0891b2',
    'sky-500': '#0ea5e9', 'sky-600': '#0284c7',
    'blue-500': '#3b82f6', 'blue-600': '#2563eb', 'blue-700': '#1d4ed8', 'blue-800': '#1e40af', 'blue-900': '#1e3a8a', 'blue-950': '#172554',
    'indigo-500': '#6366f1', 'indigo-600': '#4f46e5', 'indigo-700': '#4338ca', 'indigo-800': '#3730a3', 'indigo-900': '#312e81', 'indigo-950': '#1e1b4b',
    'violet-500': '#8b5cf6', 'violet-600': '#7c3aed', 'violet-700': '#6d28d9',
    'purple-500': '#a855f7', 'purple-600': '#9333ea', 'purple-700': '#7e22ce',
    'fuchsia-500': '#d946ef', 'fuchsia-600': '#c026d3',
    'pink-500': '#ec4899', 'pink-600': '#db2777',
    'rose-500': '#f43f5e', 'rose-600': '#e11d48',
  };
  return colorMap[color] || input; 
}

// Helper to safely extract list items from AI content (searches recursively)
const getItems = (content: any): any[] => {
  if (!content) return [];
  // Direct arrays
  if (Array.isArray(content.items)) return content.items;
  if (Array.isArray(content.list)) return content.list;
  if (Array.isArray(content.features)) return content.features;
  if (Array.isArray(content.products)) return content.products;
  if (Array.isArray(content.cards)) return content.cards;
  if (Array.isArray(content.testimonials)) return content.testimonials;
  if (Array.isArray(content.questions)) return content.questions;
  if (Array.isArray(content.faqs)) return content.faqs;
  // If content itself is an array
  if (Array.isArray(content)) return content;
  return [];
};

// Helper to extract text from various AI response formats
const extractText = (val: any, fallback: string = ''): string => {
  if (!val) return fallback;
  if (typeof val === 'string') return val;
  // Handle nested Typography objects: { type: "Typography", props: { text: "..." } }
  if (val.props?.text && typeof val.props.text === 'string') return val.props.text;
  if (val.text && typeof val.text === 'string') return val.text;
  if (val.content && typeof val.content === 'string') return val.content;
  return fallback;
};

// Helper to extract item data from AI structures (handles both simple objects and component trees)
const extractItemData = (item: any): { title: string; description: string; icon: string; image: string } => {
  if (!item) return { title: '', description: '', icon: 'Star', image: '' };
  
  // If it's a simple data object
  if (typeof item.title === 'string' || typeof item.name === 'string' || typeof item.headline === 'string') {
    return {
      title: item.title || item.name || item.headline || '',
      description: item.description || item.body || item.desc || item.text || '',
      icon: item.icon || 'Star',
      image: item.image || item.src || item.imageUrl || '',
    };
  }
  
  // If it's a component structure (e.g., {type: "CraftCard", props: {...}, components: [...]})
  if (item.type && item.props) {
    const result = { title: '', description: '', icon: 'Star', image: '' };
    
    // Extract from props first
    result.title = extractText(item.props.title) || extractText(item.props.name) || extractText(item.props.headline) || '';
    result.description = extractText(item.props.description) || extractText(item.props.body) || extractText(item.props.text) || '';
    result.icon = item.props.icon || 'Star';
    result.image = extractText(item.props.image) || extractText(item.props.src) || '';
    
    // Search nested children/components for Typography text
    const searchChildren = (children: any[]): void => {
      if (!Array.isArray(children)) return;
      for (const child of children) {
        if (!child) continue;
        if (child.type === 'Typography' && child.props?.text) {
          const text = extractText(child.props.text);
          // First Typography becomes title, second becomes description
          if (!result.title) result.title = text;
          else if (!result.description) result.description = text;
        }
        if (child.type === 'Icon' && child.props?.name) {
          result.icon = child.props.name;
        }
        if (child.type === 'ImageBlock' && child.props?.src) {
          result.image = child.props.src;
        }
        // Recurse into nested children
        if (child.components) searchChildren(child.components);
        if (child.children) searchChildren(child.children);
      }
    };
    
    if (item.components) searchChildren(item.components);
    if (item.children) searchChildren(item.children);
    
    return result;
  }
  
  return { title: '', description: '', icon: 'Star', image: '' };
};

// Transformer to convert Semantic JSON -> Craft.js Node Tree
const transformSection = (section: any, wizData: any = {}): any => {
  try {
    // 1. If it's already a component node
    if (['Section', 'Grid', 'FlexStack', 'Typography', 'DecorationLayer', 'BannerStrip', 'NavBar', 'Footer'].includes(section.type)) {
      return section;
    }

    // 2. Semantic Transformers
    const type = section.type?.toUpperCase();
    // CRITICAL FIX: AI returns content at section.props.content OR section.content
    const content = section.content || section.props?.content || {};
    const bgColor = inputToColor(section.background || section.props?.backgroundColor);
    
    // DEBUG: Log content extraction details
    console.log('[DEBUG] Section type:', type);
    console.log('[DEBUG] section.content:', JSON.stringify(section.content)?.substring(0, 200));
    console.log('[DEBUG] section.props?.content:', JSON.stringify(section.props?.content)?.substring(0, 200));
    console.log('[DEBUG] Resolved content keys:', Object.keys(content));
    console.log('[DEBUG] content.headline:', JSON.stringify(content.headline)?.substring(0, 100));
    console.log('[DEBUG] getItems result:', getItems(content).length, 'items');
    
    // Use user uploaded image for HERO if available
    const heroImage = (type === 'HERO' && wizData.productImageUrl) ? wizData.productImageUrl : content.image;

    switch (type) {
      case 'HERO':
        return {
          type: 'Section',
          props: { 
              paddingY: 'xl', 
              fullWidth: true, 
              bgImage: heroImage, 
              bgColor: bgColor || wizData.primaryColor || '#1e40af',
              backgroundPattern: section.props?.backgroundPattern,
              overlayOpacity: heroImage ? 0.5 : 0,
              scrollEffect: wizData.scrollEffect || 'none',
              parallaxStrength: wizData.parallaxSpeed === 'slow' ? 0.2 : wizData.parallaxSpeed === 'fast' ? 0.6 : 0.4,
              animationStyle: wizData.animationStyle || 'none'
          },
          children: [
            {
              type: 'FlexStack', 
              props: { direction: 'column', gap: 'md', align: 'center', justify: 'center' },
              children: [
                { type: 'Typography', props: { variant: 'h1', text: extractText(content.headline, 'Welcome'), className: 'text-center text-white drop-shadow-md' } },
                { type: 'Typography', props: { variant: 'h3', text: extractText(content.subheadline || content.body, ''), className: 'text-center text-slate-100 max-w-2xl drop-shadow' } },
                { type: 'CtaButton', props: { text: extractText(content.cta, 'Shop Now'), variant: 'primary' } }
              ]
            }
          ]
        };

      case 'FEATURES':
        return {
          type: 'Section',
          props: { paddingY: 'lg', bgColor: bgColor || '#ffffff' },
          children: [
            { type: 'Typography', props: { variant: 'h2', text: extractText(content.headline, 'Features'), className: 'text-center mb-8' } },
            {
              type: 'Grid',
              props: { cols: 3, gap: 'md' },
              children: getItems(content).map((item: any) => {
                if (!item) return null;
                const data = extractItemData(item);
                return {
                  type: 'CraftCard',
                  props: { padding: 'lg', className: 'h-full' },
                  children: [
                    {
                      type: 'FlexStack',
                      props: { direction: 'column', gap: 'sm', align: 'start' },
                      children: [
                         { type: 'Icon', props: { name: data.icon || 'Star', className: 'w-8 h-8 text-blue-600 mb-2' } },
                         { type: 'Typography', props: { variant: 'h4', text: data.title || 'Feature', className: 'font-bold' } },
                         { type: 'Typography', props: { variant: 'body', text: data.description || '', className: 'text-gray-600 text-sm' } }
                      ]
                    }
                  ]
                };
              }).filter(Boolean)
            }
          ]
        };

      case 'PRODUCTS':
      case 'CATALOG':
        return {
          type: 'Section',
          props: { paddingY: 'lg', bgColor: bgColor || '#f8fafc' },
          children: [
            { type: 'Typography', props: { variant: 'h2', text: extractText(content.headline, 'Our Products'), className: 'text-center mb-8' } },
            {
              type: 'Grid',
              props: { cols: 3, gap: 'md' },
              children: getItems(content).map((prod: any) => {
                if (!prod) return null;
                const data = extractItemData(prod);
                
                // Parse price for <del> tags
                let displayPrice = prod.price || '';
                let originalPrice = prod.originalPrice || '';
                
                if (typeof displayPrice === 'string' && displayPrice.includes('<del>')) {
                    const match = displayPrice.match(/<del>(.*?)<\/del>/);
                    if (match) {
                        originalPrice = match[1];
                        displayPrice = displayPrice.replace(match[0], '').trim();
                    }
                }

                return {
                  type: 'ProductCard',
                  props: { 
                    title: data.title || 'Product', 
                    price: displayPrice, 
                    originalPrice: originalPrice,
                    image: data.image,
                    category: prod.category || ''
                  }
                };
              }).filter(Boolean)
            }
          ]
        };
        
      case 'TESTIMONIALS':
        return {
          type: 'Section',
          props: { paddingY: 'lg', bgColor: bgColor || '#ffffff' },
          children: [
            { type: 'Typography', props: { variant: 'h2', text: extractText(content.headline, 'Testimonials'), className: 'text-center mb-8' } },
            {
              type: 'Grid',
              props: { cols: 2, gap: 'lg' },
              children: getItems(content).map((t: any) => {
                if (!t) return null;
                return {
                  type: 'FlexStack',
                  props: { direction: 'column', className: 'p-6 bg-slate-50 rounded-xl' },
                  children: [
                    { type: 'Typography', props: { variant: 'body', text: `"${safeString(t.quote || t.body)}"`, className: 'italic text-slate-600' } },
                    { type: 'Typography', props: { variant: 'caption', text: `- ${safeString(t.author || 'Customer')}`, className: 'font-bold mt-2' } }
                  ]
                };
              }).filter(Boolean)
            }
          ]
        };
      
      case 'FAQ':
        return {
          type: 'Section',
          props: { paddingY: 'lg', bgColor: bgColor || '#ffffff' },
          children: [
             { type: 'Typography', props: { variant: 'h2', text: extractText(content.headline, 'FAQ'), className: 'text-center mb-8' } },
             {
               type: 'FlexStack',
               props: { direction: 'column', gap: 'sm' },
               children: getItems(content).map((q: any) => {
                 if (!q) return null;
                 return {
                    type: 'Accordion',
                    props: { items: [{ question: safeString(q.question), answer: safeString(q.answer) }] } 
                 };
               }).filter(Boolean)
             }
          ]
        };

      case 'FOOTER': {
        const footerLinks = content.links || [
          { title: 'Shop', items: ['New Arrivals', 'Best Sellers', 'Sale'] },
          { title: 'About', items: ['Our Story', 'Careers', 'Press'] },
          { title: 'Support', items: ['FAQ', 'Returns', 'Contact'] }
        ];
        return {
          type: 'Footer',
          props: { 
            companyName: safeString(section.shopName || content.companyName || 'Store'), 
            description: safeString(content.description || content.text || 'Building the future.'),
            links: footerLinks,
            showNewsletter: true,
            darkMode: true
          }
        };
      }

      case 'NAVBAR':
        return {
          type: 'NavBar',
          props: { 
            brandName: safeString(section.shopName || content.brandName || 'Store'), 
            links: content.links || ['Home', 'Shop'],
            transparent: false
          }
        };

      case 'BANNER':
      case 'BANNERSTRIP':
        return {
          type: 'BannerStrip',
          props: { text: safeString(content.text || content.headline || 'Welcome'), bgColor: bgColor || '#1e40af', icon: true }
        };

      default:
        console.warn('Unknown component type:', type);
        return {
          type: 'UnknownComponent',
          props: { type: type || 'Unknown', content },
        };
    }
  } catch (err) {
    console.error('Transformer Error:', err, section);
    return {
       type: 'Section',
       children: [{ type: 'Typography', props: { text: 'Section Error', color: 'red' } }]
    };
  }
};

// Generation Handler Component
function GenerationHandler({ wizardData, onComplete }: { wizardData: any; onComplete: () => void }) {
  const { actions } = useEditor();
  const [hasStarted, setHasStarted] = useState(false);

  const runGeneration = useCallback(async () => {
    if (!wizardData || hasStarted) return;
    setHasStarted(true);

    console.log('[Generation] Starting...', wizardData);

    try {


const response = await fetch(`${API_BASE}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Create a landing page for ${wizardData.shopName}`,
          style: wizardData.artStyle,
          sections: wizardData.sections,
          industry: wizardData.industry,
          productName: wizardData.productName,
          productDescription: wizardData.productDescription,
          targetAudience: wizardData.targetAudience,
          competitiveStrategy: wizardData.competitiveStrategy,
          shopName: wizardData.shopName,
          language: wizardData.language,
          currency: wizardData.currency,
          pageType: wizardData.pageType,
          primaryColor: wizardData.primaryColor,
          // New Design System
          designLayout: wizardData.designLayout,
          designPalette: wizardData.designPalette,
          designTone: wizardData.designTone,
          designArt: wizardData.designArt,
          scrollEffect: wizardData.scrollEffect,
          parallaxSpeed: wizardData.parallaxSpeed,
          animationStyle: wizardData.animationStyle,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status} ${response.statusText}: ${errorText}`);
      }
      
      const rawText = await response.text();
      console.log('[Generation] Raw Response:', rawText.substring(0, 500));
      
      // JSON Sanitizer
      let cleanJson = rawText.trim();

      // Remove Markdown code blocks if present
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }

      let result;
      try {
        result = JSON.parse(cleanJson);
      } catch (e) {
        // Fallback: Try to find JSON object or array bounds
        const firstCurly = cleanJson.indexOf('{');
        const firstSquare = cleanJson.indexOf('[');
        let start = -1;
        let end = -1;

        if (firstCurly !== -1 && (firstSquare === -1 || firstCurly < firstSquare)) {
           start = firstCurly;
           end = cleanJson.lastIndexOf('}');
        } else if (firstSquare !== -1) {
           start = firstSquare;
           end = cleanJson.lastIndexOf(']');
        }

        if (start !== -1 && end !== -1) {
           try {
             result = JSON.parse(cleanJson.substring(start, end + 1));
           } catch (e2) {
             console.error('JSON Parse Failed (Retry). Raw:', rawText);
             throw new Error('Failed to parse AI response. See console for details.');
           }
        } else {
             console.error('JSON Parse Failed (No bounds). Raw:', rawText);
             throw new Error('Failed to parse AI response. See console for details.');
        }
      }

      if (result.error) throw new Error(result.message);

      // Handle both { components: [...] } and direct [...] array
      const components = result.components || (Array.isArray(result) ? result : []);
      
      if (!components.length) {
         // Fallback/Smoke Test: Create a dummy section if AI failed to return any
         console.warn("No components returned, implementing Smoke Test fallback.");
         // We push a fallback Section
         components.push({ 
            type: 'Section', 
            props: { paddingY: 'xl' }, 
            children: [{ type: 'Typography', props: { variant: 'h2', text: 'AI returned empty content', align: 'center' } }] 
         });
      }

      console.log('[Generation] Got components:', components.length);

      // Recursive builder that handles the transformed structure
      const nodeMap: Record<string, any> = {
        ROOT: {
          type: { resolvedName: 'Section' }, // Use Section for ROOT
          isCanvas: true,
          props: { 
            fullWidth: true, 
            height: 'screen', 
            bgColor: '#ffffff',
            paddingY: 'none'
          },
          displayName: 'Section',
          custom: {},
          hidden: false,
          nodes: [],
          linkedNodes: {},
        },
      };

      let id = 1;
      const makeId = () => `n${id++}`;

      const buildNode = (comp: any, parent: string): string => {
        const nodeId = makeId();
        const kids: string[] = [];
        
        let children: any[] = [];
        if (comp.children && Array.isArray(comp.children)) {
            children = comp.children;
        }

        for (const child of children) {
          if (!child || typeof child === 'string') continue;
          kids.push(buildNode(child, nodeId));
        }

        nodeMap[nodeId] = {
          type: { resolvedName: comp.type },
          isCanvas: true,
          props: comp.props || {},
          displayName: comp.type,
          custom: {},
          hidden: false,
          nodes: kids,
          linkedNodes: {},
          parent,
        };
        return nodeId;
      };

      const rootKids: string[] = [];
      for (const rawComp of components) {
        if (!rawComp) continue; 
        const comp = transformSection(rawComp, wizardData);
        console.log('[Transformer] Input Component:', JSON.stringify(comp).substring(0, 100));
        rootKids.push(buildNode(comp, 'ROOT'));
      }
      
      nodeMap.ROOT.nodes = rootKids;
      console.log('[NodeMap] ROOT children:', rootKids);
      console.log('[NodeMap] Full Map (first 5 keys):', Object.keys(nodeMap).slice(0, 5));

      console.log('[Generation] Applying', Object.keys(nodeMap).length, 'nodes...');
      
      // Sanitize nodes before deserialization
      try {
          // Check for unknown components and replace them
          // resolver is defined in outer scope
          const validTypes = Object.keys(resolver); 
          
          Object.keys(nodeMap).forEach(key => {
             const node = nodeMap[key];
             if (node.type && node.type.resolvedName) {
                 // Check against resolver. explicit checks for Canvas/Section if they aren't in resolver (Section is).
                 if (!validTypes.includes(node.type.resolvedName) && node.type.resolvedName !== 'Canvas') {
                     console.warn(`[Generation] Unknown type '${node.type.resolvedName}' in node ${key}. Replacing with UnknownComponent.`);
                     node.type.resolvedName = 'UnknownComponent';
                     node.props = { ...node.props, originalType: node.type.resolvedName };
                     node.displayName = 'UnknownComponent';
                 }
             }
          });
          
          actions.deserialize(nodeMap);
      } catch (desError) {
          console.error('[Generation] Deserialization CRASH:', desError);
          // @ts-expect-error - error typing
          throw new Error(`Deserialization Failed: ${desError.message}`);
      }
      
      console.log('[Generation] Done!');

    } catch (err) {
      console.error('[Generation] Error:', err);
      alert('Generation Error: ' + (err as Error).message); // Wizard
    } finally {
      onComplete();
    }
  }, [wizardData, hasStarted, actions, onComplete]);

  useEffect(() => {
    if (wizardData && !hasStarted) {
      runGeneration();
    }
  }, [wizardData, hasStarted, runGeneration]);

  return null;
}


function EditorContent() {
  const { pageId } = useParams();
  const { query, actions } = useEditor();
  const [deviceWidth, setDeviceWidth] = useState('100%');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [wizardData, setWizardData] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Reset status after 3s
  useEffect(() => {
    if (saveStatus.message) {
        const t = setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
        return () => clearTimeout(t);
    }
  }, [saveStatus.message]);

  // Load page content on mount or pageId change
  useEffect(() => {
    if (pageId) {
      const fetchPage = async () => {
        try {
          const res = await fetch(`${API_BASE}/pages/${pageId}`);
          if (!res.ok) throw new Error('Failed to load page');
          const data = await res.json();
          
          if (data.content && Object.keys(data.content).length > 0) {
            console.log('Loading content for page:', pageId);
            
            // Sanitize nodes to prevent deserialization crashes
            const nodes = data.content;
            const validTypes = Object.keys(resolver);
            
            Object.keys(nodes).forEach(key => {
                const node = nodes[key];
                // Check if node type exists in resolver
                // Note: ROOT node typically has resolvedName="Section" or "Container"
                if (node.type && node.type.resolvedName) {
                    // HTML elements like 'div', 'h1' etc might be used directly if not mapped, 
                    // but usually Craft uses components. 
                    // If resolvedName is not in resolver, Craft crashes.
                    // Exception: "Canvas" is an internal type? No, usually not exposed this way.
                    
                    if (!validTypes.includes(node.type.resolvedName)) {
                        console.warn(`[SafeLoad] Unknown component type: ${node.type.resolvedName}. Replacing with UnknownComponent.`);
                        // Mutate the node to be safe
                        node.type.resolvedName = 'UnknownComponent';
                        node.props = { ...node.props, originalType: node.type.resolvedName };
                        node.displayName = 'UnknownComponent';
                    }
                }
            });

            actions.deserialize(nodes);
          } else {
             console.log('Page has no content, skipping deserialization');
          }
        } catch (err) {
          console.error('Error loading page:', err);
          setSaveStatus({ type: 'error', message: 'Failed to load page content' });
        }
      };
      
      fetchPage();
    }
  }, [pageId, actions]);
  
  const handleSave = async () => {
    if (pageId) {
        // Update existing
        handleSaveSubmit();
    } else {
        // Create new -> Open Modal
        setIsSaveModalOpen(true);
    }
  };

  const handleSaveSubmit = async (title?: string) => {
    setSaveLoading(true);
    setSaveStatus({ type: null, message: '' });
    
    try {
        const json = query.serialize();
        
        // If updating an existing page (pageId is from params)
        if (pageId) {
             const res = await fetch(`${API_BASE}/pages/${pageId}`, {
                 method: 'PATCH',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ content: JSON.parse(json) })
             });
             
             if (!res.ok) throw new Error(await res.text());
             
             setSaveStatus({ type: 'success', message: 'Page updated successfully' });
        } else {
             // Creating a new page
             if (!title) {
                 setSaveLoading(false);
                 return;
             }

             // 1. Get default site
             const sitesRes = await fetch(`${API_BASE}/sites`);
             const sites = await sitesRes.json();
             let siteId = sites[0]?.id;
             
             // If no site exists, create one
             if (!siteId) {
                 const newSiteRes = await fetch(`${API_BASE}/sites`, {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ name: 'My Website', subdomain: `site-${Date.now()}` })
                 });
                 const newSite = await newSiteRes.json();
                 siteId = newSite.id;
             }

             // 2. Create the page
             const pageRes = await fetch(`${API_BASE}/pages`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                     site_id: siteId,
                     title: title,
                     slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
                     content: JSON.parse(json),
                     status: 'draft',
                     type: 'landing'
                 })
             });
             
             if (!pageRes.ok) throw new Error(await pageRes.text());
             
             setSaveStatus({ type: 'success', message: 'New page created!' });
             const newPage = await pageRes.json();
             // Update URL to avoid creating duplicate pages on next save
             window.history.pushState({}, '', `/design/${newPage.id}`);
             // Force a reload or state update might be needed if useParams doesn't trigger effect automatically on pushState
             window.location.reload(); 
        }
        
    } catch (err) {
        console.error('[Save] Error:', err);
        setSaveStatus({ type: 'error', message: (err as Error).message });
    } finally {
        setSaveLoading(false);
    }
  };

  const handleWizardComplete = (data: any) => {
    console.log('[Wizard] Complete:', data);
    setShowWizard(false);
    setIsGenerating(true);
    setWizardData(data);
  };

  const handleGenerationComplete = () => {
    setIsGenerating(false);
    setWizardData(null);
  };

  const handleNewPage = () => {
    if (confirm('Create a new page? Any unsaved changes will be lost.')) {
      window.location.href = '/design';
    }
  };

  return (
    <div className="h-full w-full overflow-hidden flex flex-col bg-slate-200">
      {/* Generation Handler */}
      {wizardData && (
        <GenerationHandler wizardData={wizardData} onComplete={handleGenerationComplete} />
      )}

      <InputModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSubmit={handleSaveSubmit}
        title="Save New Page"
        placeholder="e.g. My Landing Page"
        submitLabel="Save Page"
      />

      {/* Wizard Modal (Centered, not fullscreen) */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <CreationWizard 
            onComplete={handleWizardComplete}
            onCancel={() => setShowWizard(false)}
          />
        </div>
      )}

      {/* Toolbar */}
      <EditorToolbar 
        deviceWidth={deviceWidth} 
        onDeviceChange={setDeviceWidth}
        onOpenWizard={() => setShowWizard(true)}
        isGenerating={isGenerating}
        onSave={handleSave}
        saveStatus={saveStatus}
        isSaving={saveLoading}
        onNew={handleNewPage}
      />
      
      {/* Main Workspace */}
      <div className="flex flex-row flex-1 overflow-hidden h-full">
          <SidebarLeft 
            isOpen={isLeftSidebarOpen} 
            onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          />
          <Viewport 
            deviceWidth={deviceWidth} 
            showCustomCursor={wizardData?.showCustomCursor}
            showScrollProgress={wizardData?.showScrollProgress}
            showPageLoader={wizardData?.showPageLoader}
        />
          <SettingsPanel isOpen={isRightSidebarOpen} onToggle={() => setIsRightSidebarOpen(!isRightSidebarOpen)} />
      </div>
    </div>
  );
}




function App() {
  // Domain Routing Logic: Synchronous check to avoid flash
  const hostname = window.location.hostname;
  const systemDomains = ['localhost', '127.0.0.1', 'app.buildstore.com', 'admin.buildstore.com'];
  const isPublicDomain = !systemDomains.includes(hostname) && !hostname.includes('vercel.app');

  if (isPublicDomain) {
      console.log('[Domain Router] Detected Public Access:', hostname);
      return <PublicSiteRenderer domain={hostname} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
           <Route index element={<Navigate to="/pages" replace />} />
           <Route path="pages" element={<PageManager />} />
           <Route path="design" element={<EditorContent />} />
           <Route path="design/:pageId" element={<EditorContent />} />
           <Route path="templates/:entityType/:slug" element={<DynamicTemplateRenderer entityType="product" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
