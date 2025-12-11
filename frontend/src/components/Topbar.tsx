import { useState, useEffect } from 'react';

import { useEditor } from '@craftjs/core';

export const Topbar = () => {
  const { query } = useEditor();
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  // Auto-dismiss notification after 3 seconds
  useEffect(() => {
    if (saveStatus.message) {
      const timer = setTimeout(() => {
        setSaveStatus({ type: null, message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus.message]);

  const handleSave = async () => {
    setLoading(true);
    setSaveStatus({ type: null, message: '' });
    try {
        const json = query.serialize();
        console.log('[Save] Serialized JSON length:', json.length);
        
        // 1. Create Site
        const siteRes = await fetch('http://localhost:3000/sites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'My AI Site', subdomain: `site-${Date.now()}` })
        });
        
        if (!siteRes.ok) {
            const errorBody = await siteRes.text();
            console.error('[Save] Site creation failed:', siteRes.status, errorBody);
            throw new Error(`Site Create Failed: ${siteRes.statusText} - ${errorBody}`);
        }
        const site = await siteRes.json();
        console.log('[Save] Site created:', site.id);

        // 2. Create Page
        const pagePayload = { 
            site_id: site.id, 
            title: 'Home', 
            slug: 'home',
            content: JSON.parse(json) 
        };
        console.log('[Save] Creating page with payload size:', JSON.stringify(pagePayload).length);

        const pageRes = await fetch('http://localhost:3000/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pagePayload)
        });

        if (!pageRes.ok) {
            const errorBody = await pageRes.text();
            console.error('[Save] Page creation failed:', pageRes.status, errorBody);
            throw new Error(`Page Create Failed: ${pageRes.statusText} - ${errorBody}`);
        }
        const page = await pageRes.json();
        console.log('[Save] Page created:', page.id);

        setSaveStatus({ 
            type: 'success', 
            message: `Saved! Site ID: ${site.id.slice(0,8)}...` 
        });
        console.log('Saved Page:', page);

    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('[Save] Error:', err);
        setSaveStatus({ 
            type: 'error', 
            message: `Error: ${errorMessage}` 
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-2 flex gap-4 items-center justify-between h-14 shadow-sm z-10 relative">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">BuildStore</h1>
      </div>

      <div className="flex-1 flex justify-center">
        {saveStatus.message && (
            <div className={`px-4 py-1 rounded text-sm font-medium ${
                saveStatus.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
                {saveStatus.message}
            </div>
        )}
      </div>

      <div className="flex items-center gap-3 flex-1 justify-end">
        <button 
          onClick={() => {
            const json = query.serialize();
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "site-design.json";
            a.click();
          }}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded text-sm font-medium transition-colors"
        >
          Export JSON
        </button>
        <button 
          onClick={handleSave}
          disabled={loading}
          className={`px-4 py-2 text-white rounded text-sm font-medium transition-colors shadow-sm disabled:opacity-50 ${
              loading ? 'bg-gray-500' : 'bg-gray-900 hover:bg-black'
          }`}
        >
          {loading ? 'Saving...' : 'Save Site'}
        </button>
      </div>
    </div>
  );
};
