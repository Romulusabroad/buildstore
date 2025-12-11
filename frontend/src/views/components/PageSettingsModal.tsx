import { useState, useEffect } from 'react';
import { X, Globe, Share2, Code, Calendar } from 'lucide-react';

interface PageSettingsModalProps {
  page: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: any) => Promise<void>;
}

export function PageSettingsModal({ page, isOpen, onClose, onSave }: PageSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'advanced'>('general');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    status: 'draft',
    scheduled_at: '',
    seo_title: '',
    seo_description: '',
    social_image: '',
    schema_markup: '{}'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        status: page.status || 'draft',
        scheduled_at: page.scheduled_at ? new Date(page.scheduled_at).toISOString().slice(0, 16) : '',
        seo_title: page.seo_title || page.title || '',
        seo_description: page.seo_description || '',
        social_image: page.social_image || '',
        schema_markup: page.schema_markup ? JSON.stringify(page.schema_markup, null, 2) : '{}'
      });
    }
  }, [page]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(page.id, {
        ...formData,
        scheduled_at: formData.scheduled_at || null,
        schema_markup: JSON.parse(formData.schema_markup || '{}')
      });
      onClose();
    } catch (err) {
      alert('Failed to save settings: ' + err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Page Settings</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'seo' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            SEO & Social
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'advanced' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Advanced
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Page Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
                  <div className="flex">
                    <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg px-3 py-2 text-slate-500 text-sm flex items-center">
                      /
                    </span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-amber-600 mt-1">Warning: Changing this will create a 301 redirect from the old URL.</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {formData.status === 'scheduled' && (
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Schedule Publish Date</label>
                     <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input
                            type="datetime-local"
                            value={formData.scheduled_at}
                            onChange={e => setFormData({ ...formData, scheduled_at: e.target.value })}
                            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>
                   </div>
                )}
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-semibold text-slate-900 border-b pb-2 mb-2">Search Engine Optimization</h3>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">SEO Title</label>
                         <input
                            type="text"
                            value={formData.seo_title}
                            onChange={e => setFormData({ ...formData, seo_title: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={formData.title}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                         <textarea
                            value={formData.seo_description}
                            onChange={e => setFormData({ ...formData, seo_description: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                            placeholder="A brief summary of your page..."
                        />
                    </div>
                 </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-semibold text-slate-900 border-b pb-2 mb-2">Social Sharing (Open Graph)</h3>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Social Image URL</label>
                         <input
                            type="text"
                            value={formData.social_image}
                            onChange={e => setFormData({ ...formData, social_image: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://..."
                        />
                    </div>
                  </div>
              </div>

              {/* Previews */}
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Globe size={14} /> Google Search Preview
                    </h3>
                    <div className="font-sans">
                        <div className="text-[#1a0dab] text-xl cursor-pointer hover:underline truncate">
                            {formData.seo_title || formData.title || 'Page Title'}
                        </div>
                        <div className="text-[#006621] text-sm truncate">
                            yourwebsite.com/{formData.slug}
                        </div>
                        <div className="text-[#545454] text-sm mt-1 line-clamp-2">
                            {formData.seo_description || 'No description provided. Google will generate one automatically from the page content.'}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-0 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Share2 size={14} /> Social Share Preview
                        </h3>
                    </div>
                    <div className="bg-slate-100 h-48 w-full flex items-center justify-center overflow-hidden">
                        {formData.social_image ? (
                             <img src={formData.social_image} className="w-full h-full object-cover" alt="Social Preview" />
                        ) : (
                             <div className="text-slate-400 flex flex-col items-center">
                                 <Share2 size={32} className="mb-2 opacity-50"/>
                                 <span className="text-sm">No Image Set</span>
                             </div>
                        )}
                    </div>
                    <div className="p-4 bg-[#f0f2f5]">
                        <div className="text-xs text-slate-500 font-medium uppercase mb-1">YOURWEBSITE.COM</div>
                        <div className="text-slate-900 font-bold mb-1 truncate">{formData.seo_title || formData.title}</div>
                        <div className="text-slate-600 text-sm line-clamp-1">{formData.seo_description}</div>
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
             <div className="space-y-6 h-full flex flex-col">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col">
                    <h3 className="font-semibold text-slate-900 border-b pb-2 mb-4 flex items-center gap-2">
                        <Code size={18} className="text-blue-600" />
                        Structured Data (JSON-LD)
                    </h3>
                    <p className="text-slate-500 text-sm mb-4">
                        Add custom Schema.org JSON-LD markup here to help search engines understand your content.
                    </p>
                    <textarea
                        value={formData.schema_markup}
                        onChange={e => setFormData({ ...formData, schema_markup: e.target.value })}
                        className="w-full flex-1 p-4 font-mono text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                        placeholder="{}"
                    />
                </div>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
          <button
             onClick={onClose}
             className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
