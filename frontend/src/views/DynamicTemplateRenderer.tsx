
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Editor, Frame } from '@craftjs/core';
// Import all components for the resolver (Same as App.tsx)
import { Container } from '../components/user/Container';
import { Text } from '../components/user/Text';
import { Button } from '../components/user/Button';
import { RawHTML } from '../components/editor/RawHTML';
import { Section } from '../components/craft/Section';
import { Grid } from '../components/craft/Grid';
import { FlexStack } from '../components/craft/FlexStack';
import { Typography } from '../components/craft/Typography';
import { ImageBlock } from '../components/craft/ImageBlock';
import { Icon } from '../components/craft/Icon';
import { CtaButton } from '../components/craft/CtaButton';
import { CraftCard } from '../components/craft/CraftCard';
import { ProductCard } from '../components/craft/ProductCard';
import { ProductDetail } from '../components/craft/ProductDetail';
import { Accordion } from '../components/craft/Accordion';
import { HeroCarousel } from '../components/craft/HeroCarousel';
import { Pricing } from '../components/craft/Pricing';
import { Stats } from '../components/craft/Stats';
import { Feature } from '../components/craft/Feature';
import { Testimonial } from '../components/craft/Testimonial';
import { CountdownTimer } from '../components/craft/CountdownTimer';
import { BannerStrip } from '../components/craft/BannerStrip';
import { NavBar } from '../components/craft/NavBar';
import { Footer } from '../components/craft/Footer';
import { DecorationLayer } from '../components/craft/DecorationLayer';
import { UnknownComponent } from '../components/craft/UnknownComponent';
import { LogoTicker } from '../components/craft/LogoTicker';

const resolver = {
  Container, Text, Button, RawHTML,
  Section, Grid, FlexStack, Typography, ImageBlock, Icon, CtaButton, CraftCard,
  LogoTicker, ProductCard, Accordion, HeroCarousel, Pricing, Stats, Feature, Testimonial, ProductDetail,
  CountdownTimer, BannerStrip, NavBar, Footer, DecorationLayer, UnknownComponent
};

interface DynamicTemplateRendererProps {
  entityType: 'product' | 'collection' | 'blog';
}

import { API_BASE } from '../config';


// ------------------------------------------------------------------
// The "Data Binding Engine"
// Recursively walks the JSON tree and replaces {{ key }} with values
// ------------------------------------------------------------------
const bindData = (node: any, data: any): any => {
  if (!node) return node;

  // 1. Strings: Perform replacement
  if (typeof node === 'string') {
     // Regex to find {{ object.key }}
     // Simple version: supports {{ product.title }}
     return node.replace(/\{\{\s*(\w+)\.(\w+)\s*\}\}/g, (match, entity, field) => {
         if (entity === 'product' && data) {
             return data[field] || '';
         }
         return match; 
     });
  }

  // 2. Arrays: Recurse
  if (Array.isArray(node)) {
    return node.map(item => bindData(item, data));
  }

  // 3. Objects: Recurse values
  if (typeof node === 'object') {
    const result: any = {};
    Object.keys(node).forEach(key => {
        result[key] = bindData(node[key], data);
    });
    return result;
  }

  return node;
}


export function DynamicTemplateRenderer({ entityType }: DynamicTemplateRendererProps) {
  const { slug } = useParams(); // e.g. "iphone-15"
  const [nodes, setNodes] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Site ID (assuming single site for now)
        const sitesRes = await fetch(`${API_BASE}/sites`);
        const sites = await sitesRes.json();
        const siteId = sites[0]?.id;
        if (!siteId) throw new Error('No site found');

        // 2. Fetch the "Template Page" for this entity type
        // Query: type=template & entity_type=product
        // For MVP: We might need to just fetch ALL pages and filter client side if backend filtering isn't strict yet
        // Let's assume we have an endpoint or filter.
        // Or simpler: We define a convention that the template slug is "product-template"
        
        const pagesRes = await fetch(`${API_BASE}/pages?siteId=${siteId}`);
        const allPages = await pagesRes.json();
        const templatePage = allPages.find((p: any) => p.type === 'template' && p.entity_type === entityType);

        if (!templatePage) {
            throw new Error(`No template found for ${entityType}. Please create a page with type='template' and entity_type='${entityType}'`);
        }

        // 3. Fetch the Entity Data (The "Product")
        let entityData = null;
        if (entityType === 'product' && slug) {
            const prodRes = await fetch(`${API_BASE}/products/slug/${slug}?siteId=${siteId}`);
            if (!prodRes.ok) throw new Error('Product not found');
            entityData = await prodRes.json();
        }

        // 4. Perform Data Binding
        const rawContent = templatePage.content;
        if (!rawContent || Object.keys(rawContent).length === 0) {
            throw new Error('Template page is empty');
        }

        console.log('[Engine] Binding template with data:', entityData);
        const hydratedContent = bindData(rawContent, entityData);
        setNodes(hydratedContent);

      } catch (err) {
        console.error('Render Error:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, entityType]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  
  if (error) return (
      <div className="h-screen flex items-center justify-center flex-col gap-4">
          <h1 className="text-2xl font-bold text-red-600">Rendering Error</h1>
          <p className="text-gray-600">{error}</p>
          <a href="/pages" className="text-blue-600 underline">Back to Pages</a>
      </div>
  );

  return (
    <div className="w-full min-h-screen bg-white">
       {/* Read-Only Craft Editor */}
       <Editor resolver={resolver} enabled={false}>
          <Frame json={nodes} />
       </Editor>
    </div>
  );
}
