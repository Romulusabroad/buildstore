import { useNode } from '@craftjs/core';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  companyName: string;
  description: string;
  links: { title: string; items: string[] }[];
  showNewsletter: boolean;
  darkMode: boolean;
}

export const Footer = ({
  companyName = 'Company Name',
  description = 'Building the future of digital experiences.',
  links = [
    { title: 'Product', items: ['Features', 'Pricing', 'Showcase', 'Reviews'] },
    { title: 'Company', items: ['About', 'Team', 'Careers', 'Contact'] },
    { title: 'Resources', items: ['Blog', 'Documentation', 'Community', 'Help'] }
  ],
  showNewsletter = true,
  darkMode = true,
}: FooterProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <footer
      ref={(ref) => { if (ref) connect(drag(ref as HTMLElement)); }}
      className={cn(
        "w-full py-16 px-6 @3xl:px-12 transition-colors",
        darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"
      )}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 @3xl:grid-cols-4 gap-10">
        {/* Brand & Newsletter */}
        <div className="@3xl:col-span-1 space-y-4">
          <h3 className="text-xl font-bold tracking-tight">{companyName}</h3>
          <p className={cn("text-sm leading-relaxed", darkMode ? "text-slate-400" : "text-gray-600")}>
            {description}
          </p>
          
          {showNewsletter && (
            <div className="pt-4">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70">Subscribe</label>
              <div className="flex gap-2 mt-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className={cn(
                    "w-full px-3 py-2 rounded-md text-sm border focus:outline-none focus:ring-2",
                    darkMode 
                      ? "bg-slate-800 border-slate-700 focus:ring-blue-500 placeholder-slate-500" 
                      : "bg-white border-gray-300 focus:ring-black placeholder-gray-400"
                  )}
                />
                <button className={cn(
                  "p-2 rounded-md transition-colors",
                  darkMode 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-black hover:bg-gray-800 text-white"
                )}>
                  <Mail size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Links Columns */}
        <div className="@3xl:col-span-3 grid grid-cols-2 @3xl:grid-cols-3 gap-8">
            {links.map((column, i) => (
                <div key={i} className="space-y-4">
                    <h4 className="font-semibold">{column.title}</h4>
                    <ul className="space-y-2">
                        {column.items.map((item, j) => (
                            <li key={j}>
                                <a href="#" className={cn(
                                    "text-sm hover:underline transition-colors",
                                    darkMode ? "text-slate-400 hover:text-white" : "text-gray-600 hover:text-black"
                                )}>
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
      </div>

      <div className={cn(
          "max-w-7xl mx-auto mt-12 pt-8 border-t flex flex-col @3xl:flex-row items-center justify-between gap-4",
          darkMode ? "border-slate-800" : "border-gray-200"
      )}>
          <p className={cn("text-xs", darkMode ? "text-slate-500" : "text-gray-500")}>
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
             <Facebook size={18} className="opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
             <Twitter size={18} className="opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
             <Instagram size={18} className="opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
             <Linkedin size={18} className="opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
          </div>
      </div>
    </footer>
  );
};

const FooterSettings = () => {
    const { actions: { setProp }, props } = useNode((node) => ({
      props: node.data.props,
    }));
  
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase">Company Name</label>
          <input
            type="text"
            value={props.companyName}
            onChange={(e) => setProp((p: FooterProps) => p.companyName = e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>

        <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
            <textarea
              value={props.description}
              onChange={(e) => setProp((p: FooterProps) => p.description = e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm h-20"
            />
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            checked={props.showNewsletter}
            onChange={(e) => setProp((p: FooterProps) => p.showNewsletter = e.target.checked)}
          />
          <label className="text-sm">Show Newsletter</label>
        </div>
  
         <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={props.darkMode}
            onChange={(e) => setProp((p: FooterProps) => p.darkMode = e.target.checked)}
          />
          <label className="text-sm">Dark Mode</label>
        </div>
      </div>
    );
};

Footer.craft = {
    displayName: 'Footer',
    props: {
        companyName: 'Company Name',
        description: 'Building the future.',
        links: [
            { title: 'Product', items: ['Features', 'Pricing', 'Reviews'] },
            { title: 'Company', items: ['About', 'Contact'] },
            { title: 'Resources', items: ['Blog', 'Help'] }
        ],
        showNewsletter: true,
        darkMode: true,
    },
    related: {
        settings: FooterSettings,
    },
};
