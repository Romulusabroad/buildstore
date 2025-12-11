/**
 * Art Style Dictionary
 * 
 * Defines Tailwind CSS class configurations for different artistic styles.
 * Each style completely transforms the visual appearance of components.
 */

export type StyleName = 'minimal' | 'brutalism' | 'swiss' | 'glass';

export interface TypographyStyles {
  h1: string;
  h2: string;
  h3: string;
  p: string;
}

export interface StyleConfig {
  name: string;
  description: string;
  card: string;
  button: string;
  buttonOutline: string;
  section: string;
  grid: string;
  flexStack: string;
  image: string;
  icon: string;
  // E-commerce components
  productCard: string;
  logoTicker: string;
  accordion: string;
  typography: TypographyStyles;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
}

export const styles: Record<StyleName, StyleConfig> = {
  minimal: {
    name: 'Minimal',
    description: 'Clean, sophisticated dark mode with subtle gradients and glassmorphism',
    card: 'bg-slate-900/50 border border-white/10 backdrop-blur-md rounded-xl shadow-2xl',
    button: 'bg-white text-slate-900 hover:bg-slate-100 rounded-lg font-medium shadow-lg transition-all duration-300',
    buttonOutline: 'bg-transparent border border-white/20 text-white hover:bg-white/10 rounded-lg font-medium transition-all duration-300',
    section: 'bg-slate-950',
    grid: 'gap-8',
    flexStack: 'gap-6',
    image: 'rounded-xl overflow-hidden',
    icon: 'text-white/80',
    productCard: 'bg-slate-900/50 border border-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden',
    logoTicker: 'opacity-50 grayscale',
    accordion: 'border border-white/10 rounded-lg bg-slate-900/30',
    typography: {
      h1: 'font-medium tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60',
      h2: 'font-medium tracking-tight text-white',
      h3: 'font-normal text-white/90',
      p: 'text-white/60 leading-relaxed',
    },
    colors: {
      primary: '#ffffff',
      secondary: '#94a3b8',
      background: '#020617',
      text: '#f8fafc',
      accent: '#3b82f6',
    },
  },

  brutalism: {
    name: 'Brutalism',
    description: 'Bold, raw, unapologetic design with hard shadows and thick borders',
    card: 'bg-yellow-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none',
    button: 'bg-black text-white hover:bg-white hover:text-black border-4 border-black font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all duration-150',
    buttonOutline: 'bg-transparent text-black hover:bg-black hover:text-white border-4 border-black font-black uppercase tracking-wider',
    section: 'bg-white border-b-4 border-black',
    grid: 'gap-6',
    flexStack: 'gap-4',
    image: 'border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
    icon: 'text-black',
    productCard: 'bg-yellow-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden',
    logoTicker: 'grayscale-0 opacity-100',
    accordion: 'border-4 border-black rounded-none bg-white',
    typography: {
      h1: 'font-black tracking-normal uppercase text-black',
      h2: 'font-black tracking-tight uppercase text-black',
      h3: 'font-bold uppercase text-black',
      p: 'text-black font-medium',
    },
    colors: {
      primary: '#000000',
      secondary: '#fef08a',
      background: '#ffffff',
      text: '#000000',
      accent: '#ef4444',
    },
  },

  swiss: {
    name: 'Swiss',
    description: 'International typographic style with grid precision and clean hierarchy',
    card: 'bg-white border-l-4 border-red-600 shadow-sm',
    button: 'bg-red-600 text-white hover:bg-red-700 font-semibold tracking-wide uppercase text-sm',
    buttonOutline: 'bg-transparent text-red-600 hover:bg-red-50 border-2 border-red-600 font-semibold tracking-wide uppercase text-sm',
    section: 'bg-neutral-50',
    grid: 'gap-12',
    flexStack: 'gap-8',
    image: 'grayscale hover:grayscale-0 transition-all duration-500',
    icon: 'text-red-600',
    productCard: 'bg-white border-l-4 border-red-600 shadow-sm overflow-hidden',
    logoTicker: 'grayscale opacity-60',
    accordion: 'border-l-4 border-red-600 bg-white',
    typography: {
      h1: 'font-bold tracking-tight text-neutral-900 leading-none',
      h2: 'font-semibold tracking-tight text-neutral-800',
      h3: 'font-medium text-neutral-700 uppercase tracking-widest text-sm',
      p: 'text-neutral-600 leading-loose',
    },
    colors: {
      primary: '#dc2626',
      secondary: '#171717',
      background: '#fafafa',
      text: '#171717',
      accent: '#dc2626',
    },
  },

  glass: {
    name: 'Glass',
    description: 'Ethereal glassmorphism with soft blurs, gradients and luminous effects',
    card: 'bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
    button: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-full font-medium shadow-lg shadow-purple-500/25 transition-all duration-300',
    buttonOutline: 'bg-white/5 backdrop-blur-sm border border-white/30 text-white hover:bg-white/10 rounded-full font-medium',
    section: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    grid: 'gap-8',
    flexStack: 'gap-6',
    image: 'rounded-2xl ring-1 ring-white/10',
    icon: 'text-purple-300',
    productCard: 'bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden',
    logoTicker: 'opacity-70',
    accordion: 'bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl',
    typography: {
      h1: 'font-semibold tracking-tight text-white drop-shadow-lg',
      h2: 'font-medium text-white/90',
      h3: 'font-normal text-purple-200',
      p: 'text-white/70 leading-relaxed',
    },
    colors: {
      primary: '#a855f7',
      secondary: '#ec4899',
      background: '#0f0a1a',
      text: '#ffffff',
      accent: '#c084fc',
    },
  },
};

/**
 * Get style configuration by name
 */
export function getStyle(styleName: StyleName): StyleConfig {
  return styles[styleName];
}

/**
 * Get all available style names
 */
export function getStyleNames(): StyleName[] {
  return Object.keys(styles) as StyleName[];
}

/**
 * Get style options for UI dropdowns
 */
export function getStyleOptions(): Array<{ value: StyleName; label: string; description: string }> {
  return Object.entries(styles).map(([key, config]) => ({
    value: key as StyleName,
    label: config.name,
    description: config.description,
  }));
}
