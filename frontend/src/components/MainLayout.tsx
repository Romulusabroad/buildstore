
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, FileText, Settings } from 'lucide-react';

export function MainLayout() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-slate-50">
      {/* High-level Sidebar */}
      <aside className="w-16 flex flex-col items-center py-4 bg-slate-900 text-white z-50 shadow-xl">
        <div className="mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
                B
            </div>
        </div>

        <nav className="flex flex-col gap-4 w-full">
            <Link 
                to="/design" 
                className={`flex flex-col items-center justify-center p-2 w-full transition-colors ${isActive('/design') ? 'text-blue-400 bg-white/10 border-l-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}
                title="Web Design"
            >
                <Layout size={24} />
                <span className="text-[10px] mt-1">Design</span>
            </Link>

            <Link 
                to="/pages" 
                className={`flex flex-col items-center justify-center p-2 w-full transition-colors ${isActive('/pages') ? 'text-blue-400 bg-white/10 border-l-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}
                title="Pages"
            >
                <FileText size={24} />
                <span className="text-[10px] mt-1">Pages</span>
            </Link>
        </nav>

        <div className="mt-auto">
             <button className="p-2 text-slate-400 hover:text-white">
                <Settings size={20} />
             </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <Outlet />
      </div>
    </div>
  );
}
