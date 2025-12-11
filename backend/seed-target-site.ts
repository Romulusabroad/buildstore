
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const TARGET_SITE_ID = '728fd2e2-a803-47d4-a9eb-7403e6f92857'; // From check-data.ts output

async function seed() {
  console.log('Seeding into SPECIFIC Site:', TARGET_SITE_ID);

  // 1. Create Product (The Data)
  const productSlug = 'airmax-90-test-' + Date.now();
  const { data: product, error: pErr } = await supabase.from('products').insert({
    site_id: TARGET_SITE_ID,
    title: 'Nike Air Max 90 (Seeded)',
    slug: productSlug,
    price: 129.99,
    description: 'The classic sneaker that started it all.',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800']
  }).select().single();

  if (pErr) console.error('Product Error:', pErr);
  else console.log('Product Created:', product.slug);

  // 2. Create Template Page (The View)
  const templateContent = {
     "ROOT": {
        "type": { "resolvedName": "Container" },
        "isCanvas": true,
        "props": { "width": "100%", "height": "auto", "backgroundColor": "#ffffff" },
        "displayName": "Container",
        "custom": { "displayName": "App" },
        "nodes": ["node-title-1", "node-price-1"]
     },
     "node-title-1": {
        "type": { "resolvedName": "Typography" },
        "props": { 
            "text": "Product: {{ product.title }}", 
            "fontSize": "32px", 
            "textAlign": "center" 
        },
        "displayName": "Typography",
        "parent": "ROOT",
     },
     "node-price-1": {
        "type": { "resolvedName": "Typography" },
        "props": { 
            "text": "Price: ${{ product.price }}", 
            "fontSize": "24px", 
            "textAlign": "center",
            "color": "#2563eb"
        },
        "displayName": "Typography",
        "parent": "ROOT",
     }
  };

  const { data: page, error: pgErr } = await supabase.from('pages').insert({
    site_id: TARGET_SITE_ID,
    slug: 'product-template-target', 
    title: 'Product Template Target',
    type: 'template',
    entity_type: 'product',
    content: templateContent,
    is_deletable: true
  }).select().single();

  if (pgErr) console.error('Page Error:', pgErr);
  else console.log('Template Created:', page.id);

  console.log(`\nVERIFICATION URL: http://localhost:5173/product/${productSlug}`);
}

seed();
