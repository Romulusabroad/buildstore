import { useState, useEffect, useCallback } from 'react';
import { Menu as MenuIcon, Plus, Save, GripVertical, Trash2, ChevronDown } from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import { InputModal } from '../../components/ui/InputModal';

import { API_BASE } from '../../config';


interface MenuItem {
    id: string;
    label: string;
    type: 'page' | 'url';
    pageId?: string;
    url?: string;
}

interface Menu {
    id: string;
    name: string;
    items: MenuItem[];
    updated_at: string;
}

interface Page {
    id: string;
    title: string;
    slug: string;
}

const DraggableItem = ({ item, pages, onUpdate, onDelete }: { 
    item: MenuItem, 
    pages: Page[],
    onUpdate: (id: string, updates: Partial<MenuItem>) => void,
    onDelete: (id: string) => void
}) => {
    const controls = useDragControls();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Reorder.Item 
            value={item} 
            dragListener={false} 
            dragControls={controls}
            className="bg-white border border-slate-200 rounded-lg mb-2 overflow-hidden shadow-sm"
        >
            <div className="flex items-center gap-3 p-3 bg-slate-50 border-b border-slate-100">
                <div 
                    className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
                    onPointerDown={(e) => controls.start(e)}
                >
                    <GripVertical size={18} />
                </div>
                
                <div className="flex-1 font-medium text-slate-700">{item.label || 'Untitled Link'}</div>
                
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${item.type === 'page' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                        {item.type}
                    </span>
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"
                    >
                        <ChevronDown size={16} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    <button 
                        onClick={() => onDelete(item.id)}
                        className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="p-4 grid gap-4 grid-cols-2 bg-white">
                    <div className="col-span-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Label</label>
                        <input 
                            type="text" 
                            value={item.label}
                            onChange={(e) => onUpdate(item.id, { label: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                            placeholder="Link Text"
                        />
                    </div>
                    <div className="col-span-1">
                         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Type</label>
                         <select 
                            value={item.type}
                            onChange={(e) => onUpdate(item.id, { type: e.target.value as 'page' | 'url' })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                         >
                             <option value="page">Internal Page</option>
                             <option value="url">Custom URL</option>
                         </select>
                    </div>

                    {item.type === 'page' ? (
                        <div className="col-span-2">
                             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Destination</label>
                             <select 
                                value={item.pageId || ''}
                                onChange={(e) => onUpdate(item.id, { pageId: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                             >
                                 <option value="">Select a page...</option>
                                 {pages.map(p => (
                                     <option key={p.id} value={p.id}>{p.title} (/{p.slug})</option>
                                 ))}
                             </select>
                        </div>
                    ) : (
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">URL</label>
                             <input 
                                type="text" 
                                value={item.url || ''}
                                onChange={(e) => onUpdate(item.id, { url: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                placeholder="https://..."
                            />
                        </div>
                    )}
                </div>
            )}
        </Reorder.Item>
    );
};

export function NavigationManager({ siteId }: { siteId: string }) {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    
    // Editor State
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [currentItems, setCurrentItems] = useState<MenuItem[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const fetchMenus = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/navigation?siteId=${siteId}`);
            if (res.ok) {
                const data = await res.json();
                setMenus(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Failed to fetch menus:', err);
        }
    }, [siteId]);

    const fetchPages = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/pages?siteId=${siteId}`);
            if (res.ok) {
                const data = await res.json();
                setPages(data);
            }
        } catch (err) {
            console.error('Failed to fetch pages:', err);
        }
    }, [siteId]);

    useEffect(() => {
        if (!siteId) return;
        fetchMenus();
        fetchPages();
    }, [siteId, fetchMenus, fetchPages]);

    const handleCreateSubmit = async (name: string) => {
        const res = await fetch(`${API_BASE}/navigation`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ site_id: siteId, name, items: [] })
        });
        
        if(res.ok) {
            const newMenu = await res.json();
            setMenus([...menus, newMenu]);
            // Automatically open for editing
            setActiveMenuId(newMenu.id);
            setCurrentItems([]);
        }
    };

    const startEditing = (menu: Menu) => {
        setActiveMenuId(menu.id);
        setCurrentItems(menu.items || []);
    };

    const handleSave = async () => {
        if(!activeMenuId) return;
        setIsSaving(true);
        try {
            const res = await fetch(`${API_BASE}/navigation/${activeMenuId}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ items: currentItems })
            });
            
            if(res.ok) {
                const updated = await res.json();
                setMenus(menus.map(m => m.id === activeMenuId ? updated : m));
                setActiveMenuId(null);
            }
        } catch(err) {
            console.error('Failed to save menu:', err);
            alert('Failed to save menu changes');
        } finally {
            setIsSaving(false);
        }
    };

    const addItem = () => {
        const newItem: MenuItem = {
            id: crypto.randomUUID(),
            label: 'New Link',
            type: 'page',
            pageId: ''
        };
        setCurrentItems([...currentItems, newItem]);
    };

    const updateItem = (itemId: string, updates: Partial<MenuItem>) => {
        setCurrentItems(items => items.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
        ));
    };

    const deleteItem = (itemId: string) => {
        if(confirm('Remove this item?')) {
            setCurrentItems(items => items.filter(item => item.id !== itemId));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Menus</h3>
                {!activeMenuId && (
                    <button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
                        <Plus size={16}/> New Menu
                    </button>
                )}
            </div>
            
            <div className="grid gap-6">
                {!activeMenuId ? (
                    // Menu List View
                    <div className="grid gap-4">
                        {menus.map(menu => (
                            <div key={menu.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                            <MenuIcon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">{menu.name}</h4>
                                            <p className="text-sm text-slate-500">{(menu.items || []).length} items • Updated {new Date(menu.updated_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => startEditing(menu)}
                                        className="text-sm font-medium px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors"
                                    >
                                        Edit Menu
                                    </button>
                                </div>
                            </div>
                        ))}
                         {menus.length === 0 && (
                            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                <p className="text-slate-500">No menus created yet.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    // Editor View
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                <MenuIcon size={18} className="text-blue-600"/>
                                Editing: {menus.find(m => m.id === activeMenuId)?.name}
                            </h4>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setActiveMenuId(null)}
                                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : <><Save size={16}/> Save Changes</>}
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 bg-slate-50/50 min-h-[400px]">
                            <Reorder.Group axis="y" values={currentItems} onReorder={setCurrentItems}>
                                {currentItems.map((item) => (
                                    <DraggableItem 
                                        key={item.id} 
                                        item={item} 
                                        pages={pages}
                                        onUpdate={updateItem}
                                        onDelete={deleteItem}
                                    />
                                ))}
                            </Reorder.Group>

                             <button 
                                onClick={addItem}
                                className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all mt-4"
                            >
                                <Plus size={20} />
                                <span>Add Menu Item</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <InputModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreateSubmit}
                title="Create New Menu"
                placeholder="e.g. Main Header"
                submitLabel="Create Menu"
            />
        </div>
    );
}
