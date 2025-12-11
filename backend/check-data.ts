
import fetch from 'node-fetch';

async function check() {
  // 1. Get Site
  const sitesRes = await fetch('http://localhost:3000/sites');
  const sites = await sitesRes.json() as any[];
  const siteId = sites[0].id;
  console.log('Site ID:', siteId);

  // 2. Get Pages
  const pagesRes = await fetch(`http://localhost:3000/pages?siteId=${siteId}`);
  const pages = await pagesRes.json() as any[];
  console.log('Total Pages:', pages.length);
  
  const templates = pages.filter((p: any) => p.type === 'template');
  console.log('Templates Found:', templates.map((p: any) => ({ 
      title: p.title, 
      type: p.type, 
      entity_type: p.entity_type 
  })));
}

check();
