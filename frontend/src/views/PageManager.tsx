import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, File, Settings, Share2, Layers, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageSettingsModal } from './components/PageSettingsModal';
import { RedirectsManager } from './components/RedirectsManager';
import { NavigationManager } from './components/NavigationManager';
import { DomainManager } from './components/DomainManager';
import { InputModal } from '../components/ui/InputModal';

interface Page {
  id: string;
  title: string;
  slug: string;
  updated_at: string;
  status?: string;
  is_published?: boolean; // Legacy
  seo_title?: string;
  type?: 'landing' | 'system' | 'template';
  is_deletable?: boolean;
}

interface Site {
  id: string;
  name: string;
  subdomain: string;
}

// Helper to render status badge
const StatusBadge = ({ status }: { status?: string }) => {
    if(status === 'published') return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">Published</span>;
    if(status === 'scheduled') return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">Scheduled</span>;
    if(status === 'archived') return <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">Archived</span>;
    return <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">Draft</span>;
};

// Internal Component for Card
const PageCard = ({ page, onSettings, onDelete }: any) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between group hover:shadow-md transition-all hover:border-blue-100">
            <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors border ${page.type === 'system' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 border-slate-100'}`}>
                    {page.type === 'system' ? <Layers size={22} /> : <File size={22} />}
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 flex items-center gap-2">
                        {page.title}
                        {page.type === 'system' && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 font-semibold uppercase tracking-wider">System</span>}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                        <StatusBadge status={page.status || (page.is_published ? 'published' : 'draft')} />
                        <span className="flex items-center gap-1 font-mono bg-slate-50 px-1.5 py-0.5 rounded text-slate-500 border border-slate-100">
                            /{page.slug}
                        </span>
                        <span>•</span>
                        <span>Updated {new Date(page.updated_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                <Link 
                    to={`/design/${page.id}`} 
                    className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm"
                >
                    <Edit size={16} />
                    Design
                </Link>
                
                <button 
                    onClick={onSettings}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Page Settings"
                >
                    <Settings size={18} />
                </button>

                {page.is_deletable !== false && (
                    <button 
                        onClick={onDelete}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                        title="Delete Page"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

import { API_BASE } from '../config';

// Remove local definition if it exists
// const API_BASE = 'http://localhost:3000';

export function PageManager() {
  const [activeTab, setActiveTab] = useState<'pages' | 'navigation' | 'redirects' | 'domains'>('pages');
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  
  // Modal State
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    initializeSiteAndPages();
  }, []);

  const initializeSiteAndPages = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Fetch all sites for the user
      const sitesRes = await fetch(`${API_BASE}/sites`);
      if (!sitesRes.ok) throw new Error('Failed to fetch sites');
      const sites = await sitesRes.json();

      let site = sites[0];

      // 2. If no sites exist, create a default one
      if (!site) {
        const createRes = await fetch(`${API_BASE}/sites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: 'My Website', 
            subdomain: `site-${Date.now()}` 
          })
        });
        if (!createRes.ok) throw new Error('Failed to create site');
        site = await createRes.json();
      }

      setCurrentSite(site);
      fetchPages(site.id);
    } catch (err) {
      console.error('Error initializing:', err);
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async (siteId: string) => {
    const pagesRes = await fetch(`${API_BASE}/pages?siteId=${siteId}`);
    if (pagesRes.ok) {
      setPages(await pagesRes.json());
    }
  };

  const handleAddPage = () => {
      setIsCreateModalOpen(true);
  };

  const handleCreatePageSubmit = async (title: string) => {
    if (!currentSite) return;

    const slug = title.toLowerCase().replace(/\s+/g, '-');

    try {
      const res = await fetch(`${API_BASE}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_id: currentSite.id,
          title,
          slug,
          status: 'draft',
          type: 'landing', // Explicitly creating landing pages
          content: {}
        })
      });

      if (!res.ok) throw new Error('Failed to create page');
      const newPage = await res.json();
      setPages([newPage, ...pages]);
      
      // Open settings immediately for fine tuning
      setEditingPage(newPage);
      setIsSettingsOpen(true);
    } catch (err) {
      console.error('Error creating page:', err);
      alert('Failed to create page');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const res = await fetch(`${API_BASE}/pages/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete page');
      setPages(pages.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting page:', err);
      alert('Failed to delete page');
    }
  };

  const handleUpdatePage = async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/pages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    if (!res.ok) throw new Error('Failed to update page');
    
    // Refresh list to update slugs/titles/status
    if(currentSite) fetchPages(currentSite.id);
  };

  const openSettings = (page: Page) => {
      setEditingPage(page);
      setIsSettingsOpen(true);
  };

  if (loading) {
    return (
      <div className="p-10 h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading pages...</p>
        </div>
      </div>
    );
  }

  // Helper to render status badge
// StatusBadge removed (unused)


  return (
    <div className="h-full overflow-hidden flex flex-col bg-slate-50">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Site Management</h1>
            <p className="text-slate-500 text-sm mt-1">{currentSite?.name} ({currentSite?.subdomain}.buildstore.com)</p>
          </div>
          <div className="flex gap-3">
             <Link to="/" className="text-slate-500 hover:text-slate-700 px-4 py-2 font-medium">Dashboard</Link>
             <button 
                onClick={handleAddPage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all font-medium"
             >
                <Plus size={18} />
                <span>New Page</span>
             </button>
          </div>
      </div>

      {/* Tabs */}
      <div className="px-8 border-b border-slate-200 bg-white shrink-0 scrollbar-hide overflow-x-auto">
          <div className="flex gap-8">
              <button 
                onClick={() => setActiveTab('pages')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'pages' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                 <File size={16} /> Pages
              </button>
              <button 
                onClick={() => setActiveTab('navigation')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'navigation' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                 <Layers size={16} /> Navigation
              </button>
              <button 
                onClick={() => setActiveTab('redirects')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'redirects' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                 <Share2 size={16} /> URL Redirects
              </button>
              <button 
                onClick={() => setActiveTab('domains')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'domains' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                 <Globe size={16} /> Domains
              </button>
          </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
         <div className="max-w-5xl mx-auto">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
                    {error}
                </div>
            )}

            {activeTab === 'pages' && (
                <div className="space-y-8">
                    {/* System Pages Section */}
                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pl-1">Storefront & System</h2>
                        <div className="grid gap-3">
                            {pages.filter(p => p.type === 'system').map((page) => (
                                <PageCard 
                                    key={page.id} 
                                    page={page} 
                                    onEdit={() => {}} // System pages might have visual editor or not, keeping enabled
                                    onSettings={() => openSettings(page)}
                                    onDelete={() => handleDelete(page.id)}
                                />
                            ))}
                            {pages.filter(p => p.type === 'system').length === 0 && (
                                <div className="text-slate-400 text-sm italic pl-2">No system pages found (Seed required).</div>
                            )}
                        </div>
                    </div>

                    {/* Landing Pages Section */}
                    <div className="space-y-3">
                         <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pl-1">Marketing & Landing</h2>
                         </div>
                        <div className="grid gap-3">
                            {pages.filter(p => p.type === 'landing' || !p.type).map((page) => (
                                <PageCard 
                                    key={page.id} 
                                    page={page} 
                                    onEdit={() => {}} 
                                    onSettings={() => openSettings(page)}
                                    onDelete={() => handleDelete(page.id)}
                                />
                            ))}
                             {pages.filter(p => p.type === 'landing' || !p.type).length === 0 && (
                                <div className="text-slate-400 text-sm italic pl-2">No landing pages yet. Create one!</div>
                            )}
                        </div>
                    </div>

                    {/* Templates Section (Future) */}
                     {pages.some(p => p.type === 'template') && (
                        <div className="space-y-3">
                             <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pl-1">Templates</h2>
                            <div className="grid gap-3">
                                {pages.filter(p => p.type === 'template').map((page) => (
                                    <PageCard 
                                        key={page.id} 
                                        page={page} 
                                        onEdit={() => {}}
                                        onSettings={() => openSettings(page)}
                                        onDelete={() => handleDelete(page.id)}
                                    />
                                ))}
                            </div>
                        </div>
                     )}
                </div>
            )}

            {activeTab === 'navigation' && currentSite && (
                <NavigationManager siteId={currentSite.id} />
            )}

            {activeTab === 'redirects' && currentSite && (
                 <RedirectsManager siteId={currentSite.id} />
            )}

            {activeTab === 'domains' && currentSite && (
                 <DomainManager siteId={currentSite.id} />
            )}
         </div>
      </div>

      <PageSettingsModal 
        page={editingPage}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleUpdatePage}
      />

      <InputModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePageSubmit}
          title="Create New Page"
          placeholder="e.g. Landing Page"
          submitLabel="Create Page"
      />
    </div>
  );
}
