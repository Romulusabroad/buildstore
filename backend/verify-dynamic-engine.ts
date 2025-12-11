
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function seed() {
  console.log('Seeding Verification Data...');

  // 1. Get Site
  const { data: sites } = await supabase.from('sites').select('id').limit(1);
  const siteId = sites![0].id;
  console.log('Using Site:', siteId);

  // 2. Create Product (The Data)
  const productSlug = 'airmax-90-test-' + Date.now();
  const { data: product, error: pErr } = await supabase.from('products').insert({
    site_id: siteId,
    title: 'Nike Air Max 90',
    slug: productSlug,
    price: 129.99,
    description: 'The classic sneaker that started it all.',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800']
  }).select().single();

  if (pErr) console.error('Product Error:', pErr);
  else console.log('Product Created:', product.slug);

  // 3. Create Template Page (The View)
  // We use a simple Text node with the variable
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
    site_id: siteId,
    slug: 'product-template-test', // Slug doesn't matter for templates usually, but good to have
    title: 'Product Template',
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
