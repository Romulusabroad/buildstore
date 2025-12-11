
import { useEditor, Element } from '@craftjs/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// Atomic Design Components
import { Section } from './craft/Section';
import { Grid } from './craft/Grid';
import { FlexStack } from './craft/FlexStack';
import { Typography } from './craft/Typography';
import { ImageBlock } from './craft/ImageBlock';
import { Icon } from './craft/Icon';
import { CtaButton } from './craft/CtaButton';
import { CraftCard } from './craft/CraftCard';
// E-commerce Components
import { LogoTicker } from './craft/LogoTicker';
import { ProductCard } from './craft/ProductCard';
import { Accordion } from './craft/Accordion';
import { HeroCarousel } from './craft/HeroCarousel';
import { Pricing } from './craft/Pricing';
import { Stats } from './craft/Stats';
import { Feature } from './craft/Feature';
import { Testimonial } from './craft/Testimonial';
import { NavBar } from './craft/NavBar';
import { Footer } from './craft/Footer';

interface SidebarLeftProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const SidebarLeft = ({ isOpen, onToggle }: SidebarLeftProps) => {
    const { connectors } = useEditor();

    return (
        <div 
          className={`bg-white border-r border-gray-200 flex flex-col h-full bg-gray-50 transition-all duration-300 relative ${isOpen ? 'w-80' : 'w-0'}`}
        >
            {/* Collapse Toggle Button */}
            <button 
                onClick={onToggle}
                className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-md z-50 hover:bg-gray-50 text-gray-500 flex items-center justify-center w-6 h-6"
                style={{ right: '-12px' }}
            >
                {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            {/* Content Container */}
            <div className="flex flex-col h-full w-80 overflow-hidden">

                {/* Component Toolbox */}
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 bg-gray-50">

                    {/* Navigation */}
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</label>
                        <div className="grid grid-cols-2 gap-2">
                             <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <NavBar brandName="MyBrand" links={['Home', 'About', 'Contact']} />); }}
                            >
                                <div className="w-full h-2 bg-gray-200 mb-1 rounded-sm group-hover:bg-blue-100"></div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">NavBar</span>
                            </div>
                             <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <Footer companyName="MyBrand" description="Building the future" links={[{title: "Shop", items: ["Products"]}, {title: "Legal", items: ["Privacy"]}]} showNewsletter={true} darkMode={true} />); }}
                            >
                                <div className="w-full h-2 bg-gray-800 mt-1 rounded-sm"></div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Footer</span>
                            </div>
                        </div>
                    </div>

                    {/* Marketing Components */}
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Marketing</label>
                        <div className="grid grid-cols-3 gap-2">
                            <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <HeroCarousel slides={[{title: "Welcome", subtitle: "Start building today", image: "https://placehold.co/1920x1080", ctaText: "Learn More"}]} />); }}
                            >
                                <div className="w-6 h-4 bg-purple-100 border border-purple-300 rounded-sm flex items-center justify-center">
                                    <div className="w-1 h-1 bg-purple-500 rounded-full mx-0.5"></div>
                                    <div className="w-1 h-1 bg-purple-300 rounded-full mx-0.5"></div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Hero</span>
                            </div>

                            <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <Feature title="Feature Title" description="Feature description goes here." icon="Star" />); }}
                            >
                                <div className="w-6 h-4 flex flex-col justify-between p-0.5">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Feature</span>
                            </div>

                             <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <Pricing plans={[{name: "Basic", price: "29", features: ["Feature 1", "Feature 2"], cta: "Get Started"}]} />); }}
                            >
                                <div className="w-6 h-4 border border-gray-300 rounded-sm grid grid-cols-3 gap-px p-0.5">
                                    <div className="bg-gray-200"></div>
                                    <div className="bg-blue-200"></div>
                                    <div className="bg-gray-200"></div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Pricing</span>
                            </div>

                            <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <Stats items={[{value: "100+", label: "Customers"}, {value: "50k", label: "Downloads"}]} />); }}
                            >
                                <div className="w-6 h-4 flex gap-0.5 items-end justify-center">
                                    <div className="w-1 h-1 bg-gray-400"></div>
                                    <div className="w-1 h-2 bg-gray-600"></div>
                                    <div className="w-1 h-3 bg-blue-500"></div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Stats</span>
                            </div>

                            <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <Testimonial content="Amazing product!" author="Jane Doe" role="CEO" />); }}
                            >
                                <div className="w-6 h-4 bg-gray-50 rounded-sm flex items-center justify-center text-[10px]">
                                    " "
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Quote</span>
                            </div>

                             <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <LogoTicker />); }}
                            >
                                <div className="flex gap-0.5">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Logos</span>
                            </div>
                        </div>
                    </div>

                    {/* Layout Components */}
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Layout</label>
                        <div className="grid grid-cols-3 gap-2">
                            <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <Element is={Section} canvas bgColor="#f8fafc" paddingY="lg" />); }}
                            >
                                <div className="w-6 h-4 border-2 border-gray-400 rounded-sm group-hover:border-blue-500"></div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Section</span>
                            </div>

                            <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <Grid columns={2} />); }}
                            >
                                <div className="w-6 h-4 grid grid-cols-2 gap-0.5 group-hover:border-blue-500">
                                    <div className="bg-gray-400 rounded-sm"></div>
                                    <div className="bg-gray-400 rounded-sm"></div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Grid</span>
                            </div>

                            <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <FlexStack />); }}
                            >
                                <div className="w-6 h-4 flex gap-0.5">
                                    <div className="flex-1 bg-gray-400 rounded-sm"></div>
                                    <div className="flex-1 bg-gray-400 rounded-sm"></div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Flex</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Components */}
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Content</label>
                        <div className="grid grid-cols-3 gap-2">
                            <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <Typography text="Heading" variant="h2" />); }}
                            >
                                <span className="text-sm font-bold text-gray-600 group-hover:text-blue-500">Aa</span>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Text</span>
                            </div>

                            <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <ImageBlock />); }}
                            >
                                <div className="w-6 h-4 bg-gray-300 rounded-sm flex items-center justify-center">
                                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Image</span>
                            </div>

                            <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <CtaButton text="Click Me" />); }}
                            >
                                <div className="px-2 py-0.5 bg-blue-500 rounded text-[8px] text-white font-bold">BTN</div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Button</span>
                            </div>

                            <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <Icon name="Star" />); }}
                            >
                                <div className="text-gray-500 group-hover:text-blue-500">★</div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Icon</span>
                            </div>

                            <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <CraftCard />); }}
                            >
                                <div className="w-6 h-5 bg-white border border-gray-300 rounded-sm shadow-sm"></div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Card</span>
                            </div>
                        </div>
                    </div>

                    {/* E-commerce Components */}
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">E-commerce</label>
                        <div className="grid grid-cols-3 gap-2">
                            <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <ProductCard />); }}
                            >
                                <div className="w-6 h-5 bg-gray-200 rounded-sm flex items-center justify-center text-[8px] font-bold text-gray-500">$</div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Product</span>
                            </div>

                            <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <LogoTicker />); }}
                            >
                                <div className="flex gap-0.5">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">Logos</span>
                            </div>

                            <div 
                                className="bg-white p-2 border border-gray-200 rounded cursor-move hover:shadow-md hover:border-blue-400 transition-all flex flex-col items-center gap-1 group"
                                ref={(ref) => { if (ref) connectors.create(ref, <Accordion />); }}
                            >
                                <div className="w-6 h-4 flex flex-col gap-0.5">
                                    <div className="h-1 bg-gray-400 rounded-sm"></div>
                                    <div className="h-1 bg-gray-300 rounded-sm"></div>
                                    <div className="h-1 bg-gray-300 rounded-sm"></div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-500">FAQ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
