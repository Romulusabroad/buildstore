import { useEditor } from '@craftjs/core';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Undo2, 
  Redo2, 
  Eye,
  Save,
  Download,
  ChevronRight,
  CheckCircle,
  XCircle,
  Wand2,
  Loader2,
  FilePlus
} from 'lucide-react';

interface EditorToolbarProps {
  deviceWidth: string;
  onDeviceChange: (width: string) => void;
  onOpenWizard: () => void;
  isGenerating: boolean;
  onSave: () => void;
  saveStatus: { type: 'success' | 'error' | null, message: string };
  isSaving: boolean;
  onNew: () => void;
}

export const EditorToolbar = ({ 
  deviceWidth, 
  onDeviceChange,
  onOpenWizard,
  isGenerating,
  onSave,
  saveStatus,
  isSaving,
  onNew
}: EditorToolbarProps) => {
  const { actions, query, canUndo, canRedo, selected } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    return {
      canUndo: query.history.canUndo(),
      canRedo: query.history.canRedo(),
      selected: currentNodeId ? state.nodes[currentNodeId] : null,
    };
  });

  // Build breadcrumb from selected node
  const getBreadcrumb = () => {
    if (!selected) return ['Canvas'];
    const path: string[] = [];
    let currentId = selected.id;
    
    while (currentId) {
      const node = query.node(currentId).get();
      if (node) {
        path.unshift(node.data.displayName || node.data.name || 'Node');
        currentId = node.data.parent || '';
      } else {
        break;
      }
    }
    return path.length > 0 ? path : ['Canvas'];
  };

  const breadcrumb = getBreadcrumb();
  const deviceOptions = [
    { width: '100%', icon: Monitor, label: 'Desktop' },
    { width: '768px', icon: Tablet, label: 'Tablet' },
    { width: '375px', icon: Smartphone, label: 'Mobile' },
  ];

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 h-14 shadow-sm relative z-40">
      {/* Left: Logo & Breadcrumb */}
      <div className="flex items-center gap-4 min-w-fit">
        <h1 className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          BuildStore
        </h1>
        
        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-1 text-sm text-gray-500">
          {breadcrumb.map((item, index) => (
            <span key={index} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="w-3 h-3" />}
              <span className={index === breadcrumb.length - 1 ? 'text-gray-800 font-medium' : ''}>
                {item}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Center: Device Controls & History */}
      <div className="flex items-center justify-center gap-4 flex-1">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => actions.history.undo()} 
            disabled={!canUndo}
            className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 transition-all"
            title="Undo"
          >
            <Undo2 className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={() => actions.history.redo()} 
            disabled={!canRedo}
            className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 transition-all"
            title="Redo"
          >
            <Redo2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-gray-200" />

        {/* Device Switcher */}
        <div className="flex items-center bg-gray-100/50 p-1 rounded-lg border border-gray-100">
          {deviceOptions.map((option) => (
            <button
              key={option.width}
              onClick={() => onDeviceChange(option.width)}
              className={`p-1.5 rounded-md transition-all ${
                deviceWidth === option.width 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'hover:bg-gray-200/50 text-gray-400 hover:text-gray-600'
              }`}
              title={option.label}
            >
              <option.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center justify-end gap-2 min-w-fit">
        {/* Notification */}
        {saveStatus.message && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all animate-in fade-in mr-2 ${
            saveStatus.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-100' 
              : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {saveStatus.type === 'success' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {saveStatus.message}
          </div>
        )}

        {/* Preview */}
        <button 
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
          title="Preview"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Export */}
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
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
          title="Export JSON"
        >
          <Download className="w-4 h-4" />
        </button>

         {/* New Page */}
         <button 
           onClick={onNew}
           className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
           title="New Page"
         >
           <FilePlus className="w-4 h-4" />
         </button>

         {/* Save */}
         <button 
          onClick={onSave}
          disabled={isSaving}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
          title="Save Project"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        </button>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        {/* Create New Site - Button */}
        <button
          onClick={onOpenWizard}
          disabled={isGenerating}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-sm transition-all text-sm ${
              isGenerating 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-blue-500/20 hover:shadow-blue-500/40'
          }`}
        >
          {isGenerating ? (
               <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
               <Wand2 className="w-4 h-4" />
          )}
          <span>{isGenerating ? 'Generating...' : 'Create Site'}</span>
        </button>

      </div>
    </div>
  );
};

export default EditorToolbar;
