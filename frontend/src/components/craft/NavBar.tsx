import { useNode } from '@craftjs/core';
import { Menu, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavBarProps {
  brandName: string;
  links: string[];
  logo?: boolean;
  transparent?: boolean;
  darkMode?: boolean;
  behavior?: 'static' | 'fixed' | 'scroll-hide';
}

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

export const NavBar = ({
  brandName = 'Brand Name',
  links = ['Home', 'Shop', 'About', 'Contact'],
  logo = true,
  transparent = false,
  darkMode = false,
  behavior = 'fixed',
}: NavBarProps) => {
  const { connectors: { connect, drag } } = useNode();
  
  // Scroll Logic for Hide/Show
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (behavior !== 'scroll-hide') {
        setHidden(false);
        return;
    }
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Simplified SubLinks logic
  const getSubLinks = (link: string) => {
    const l = link.toLowerCase();
    if (l.includes('shop') || l.includes('product')) return ['New Arrivals', 'Best Sellers', 'Accessories', 'Sale'];
    if (l.includes('about') || l.includes('story')) return ['Our Story', 'Team', 'Careers', 'Press'];
    if (l.includes('contact') || l.includes('support')) return ['Email Us', 'Live Chat', 'Locations'];
    return ['Overview', 'Updates', 'Features'];
  };

  return (
    <motion.nav
      ref={(ref) => { if (ref) connect(drag(ref as HTMLElement)); }}
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        "w-full px-6 py-4 flex items-center justify-between transition-colors duration-300 z-50",
        behavior !== 'static' ? 'fixed top-0 left-0 right-0' : 'relative hidden', // hidden is a placeholder error? No wait.
        // If static, it should be relative.
        behavior !== 'static' ? 'fixed top-0 left-0 right-0' : 'relative',
        
        // Background Logic
        transparent 
            ? "bg-transparent border-transparent" 
            : "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm",
            
        darkMode && !transparent && "bg-gray-900/90 border-gray-800 text-white",
        darkMode && transparent && "text-white"
      )}
    >
      {/* Brand / Logo */}
      <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
        {logo && <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", darkMode ? "bg-white text-black" : "bg-black text-white")}>B</div>}
        <span>{brandName}</span>
      </div>

      {/* Desktop Links with Hover Dropdown */}
      <div className="hidden @3xl:flex items-center gap-1">
        {links.map((link, i) => (
          <div key={i} className="group relative">
            <a 
                href="#" 
                className={cn(
                    "block px-4 py-2 text-sm font-medium rounded-full transition-all",
                    "hover:bg-gray-100/50",
                    darkMode && "hover:bg-white/10"
                )}
            >
              {link}
            </a>
            
            {/* Dropdown Menu - Simplified Display Logic */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 hidden group-hover:block z-50">
                <div className="w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex flex-col gap-1">
                        {getSubLinks(link).map((sub, j) => (
                            <a 
                                key={j} 
                                href="#" 
                                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
                            >
                                {sub}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
            <User className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="@3xl:hidden p-2">
            <Menu className="w-6 h-6" />
        </button>
      </div>
    </motion.nav>
  );
};

const NavBarSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase">Brand Name</label>
        <input
          type="text"
          value={props.brandName}
          onChange={(e) => setProp((p: NavBarProps) => p.brandName = e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>
      
      <div className="space-y-2">
         <label className="text-xs font-semibold text-gray-500 uppercase">Links (comma separated)</label>
         <input
            type="text"
            value={props.links.join(', ')}
            onChange={(e) => setProp((p: NavBarProps) => p.links = e.target.value.split(',').map(s => s.trim()))}
            className="w-full px-3 py-2 border rounded-md text-sm"
         />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          checked={props.transparent}
          onChange={(e) => setProp((p: NavBarProps) => p.transparent = e.target.checked)}
        />
        <label className="text-sm">Transparent Background</label>
      </div>

       {/* Behavior */}
       <div className="space-y-2 pt-2">
         <label className="text-xs font-semibold text-gray-500 uppercase">Behavior</label>
         <select
            value={props.behavior || 'fixed'}
            onChange={(e) => setProp((p: NavBarProps) => p.behavior = e.target.value as any)}
            className="w-full px-3 py-2 border rounded-md text-sm"
         >
            <option value="static">Static (Scrolls with page)</option>
            <option value="fixed">Sticky (Always Visible)</option>
            <option value="scroll-hide">Smart (Hide on Scroll)</option>
         </select>
       </div>

       <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={props.darkMode}
          onChange={(e) => setProp((p: NavBarProps) => p.darkMode = e.target.checked)}
        />
        <label className="text-sm">Dark Mode</label>
      </div>
    </div>
  );
};

NavBar.craft = {
  displayName: 'Navigation Bar',
  props: {
    brandName: 'Brand',
    links: ['Home', 'Shop', 'About', 'Contact'],
    logo: true,
    transparent: false,
    darkMode: false,
  },
  related: {
    settings: NavBarSettings,
  },
};
