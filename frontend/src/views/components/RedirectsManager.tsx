import { useState, useEffect } from 'react';
import { Trash2, ArrowRight, CornerDownRight } from 'lucide-react';

interface Redirect {
  id: string;
  from_path: string;
  to_path: string;
  type: string;
  created_at: string;
}

import { API_BASE } from '../../config';


export function RedirectsManager({ siteId }: { siteId: string }) {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRedirect, setNewRedirect] = useState({ from: '', to: '' });

  useEffect(() => {
    fetchRedirects();
  }, [siteId]);

  const fetchRedirects = async () => {
    try {
      const res = await fetch(`${API_BASE}/redirects?siteId=${siteId}`);
      if (res.ok) {
        setRedirects(await res.json());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newRedirect.from || !newRedirect.to) return;
    try {
      const res = await fetch(`${API_BASE}/redirects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_id: siteId,
          from_path: newRedirect.from,
          to_path: newRedirect.to,
        }),
      });
      if (res.ok) {
        fetchRedirects();
        setNewRedirect({ from: '', to: '' });
      } else {
        alert('Failed to create redirect');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this redirect?')) return;
    try {
      await fetch(`${API_BASE}/redirects/${id}`, { method: 'DELETE' });
      setRedirects(redirects.filter(r => r.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Redirect</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Original Path (Old URL)</label>
            <div className="flex">
              <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg px-3 py-2 text-slate-500 text-sm">/</span>
              <input
                type="text"
                placeholder="old-page"
                value={newRedirect.from}
                onChange={e => setNewRedirect({ ...newRedirect, from: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <ArrowRight className="text-slate-300 mb-3" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Path (New URL)</label>
             <div className="flex">
              <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg px-3 py-2 text-slate-500 text-sm">/</span>
              <input
                type="text"
                placeholder="new-page"
                value={newRedirect.to}
                onChange={e => setNewRedirect({ ...newRedirect, to: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!newRedirect.from || !newRedirect.to}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-[1px]"
          >
            Add Redirect
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
             <h3 className="font-semibold text-slate-700">Active Redirects</h3>
             <span className="text-sm text-slate-400">{redirects.length} redirects</span>
         </div>
         {loading ? (
             <div className="p-10 text-center text-slate-400">Loading...</div>
         ) : redirects.length === 0 ? (
             <div className="p-10 text-center text-slate-400">
                 No redirects found.
             </div>
         ) : (
            <div className="divide-y divide-slate-100">
                {redirects.map(r => (
                    <div key={r.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <CornerDownRight size={16} />
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="font-mono text-slate-600 bg-red-50 px-2 py-0.5 rounded text-red-700">/{r.from_path}</span>
                                <ArrowRight size={14} className="text-slate-300" />
                                <span className="font-mono text-slate-600 bg-green-50 px-2 py-0.5 rounded text-green-700">/{r.to_path}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-500 uppercase">301 Permanent</span>
                            <button
                                onClick={() => handleDelete(r.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
         )}
      </div>
    </div>
  );
}
