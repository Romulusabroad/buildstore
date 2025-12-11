import { Injectable } from '@nestjs/common';
import { vertex } from '@ai-sdk/google-vertex';
import { generateText } from 'ai';

/**
 * Extended Business Context Interface
 */
interface BusinessContext {
  industry?: string;
  productName?: string;
  productDescription?: string;
  targetAudience?: string;
  competitiveStrategy?:
    | 'cost'
    | 'premium'
    | 'innovation'
    | 'trust'
    | 'efficiency';
  // Wizard Extended
  shopName?: string;
  language?: string;
  currency?: string;
  campaignMode?:
    | 'standard'
    | 'blackfriday'
    | 'christmas'
    | 'newyear'
    | 'summer';
  pageType?: 'landing' | 'product' | 'story' | 'contact' | 'blog';
  primaryColor?: string;
  // New Design System
  designLayout?: 'minimalist' | 'grid' | 'magazine' | 'immersive' | 'split';
  designPalette?: 'monochromatic' | 'morandi' | 'contrast' | 'earthy' | 'pastel';
  designTone?: 'high-key' | 'low-key' | 'warm' | 'cool' | 'neutral';
  designArt?: 'minimalist' | 'classic' | 'abstract' | 'pop' | 'organic' | 'cyberpunk';
  voiceTone?: 'professional' | 'friendly' | 'humorous' | 'luxury' | 'confident';
  textLength?: 'short' | 'medium' | 'long';
}

// Currency symbols map
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  CNY: '¥',
  JPY: '¥',
  EUR: '€',
  GBP: '£',
  KRW: '₩',
};

// Language names for prompt
const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  zh: 'Chinese (Simplified)',
  ja: 'Japanese',
  ko: 'Korean',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
};

/**
 * CAMPAIGN MODE RULES
 */
const CAMPAIGN_RULES: Record<string, string> = {
  standard: `
CAMPAIGN: STANDARD MODE
- Normal branding, no special promotional elements
- Focus on product value proposition
`,
  blackfriday: `
CAMPAIGN: BLACK FRIDAY 🖤
MANDATORY REQUIREMENTS:
- Add CountdownTimer component in Hero section
- ALL buttons must be RED (#ef4444) or BLACK (#000000)
- BannerStrip at top: "BLACK FRIDAY - LIMITED TIME ONLY"
- Copy must include: "Limited Time", "Once a Year", "Hurry", "Biggest Sale"
- Show aggressive discounts: "50% OFF", "70% OFF"
- Prices with strikethrough showing "original" prices
- Add urgency messaging everywhere
`,
  christmas: `
CAMPAIGN: CHRISTMAS 🎄
MANDATORY REQUIREMENTS:
- Enable DecorationLayer with SNOW effect
- Color palette: Red (#dc2626), Green (#16a34a), Gold (#eab308), White
- BannerStrip: "Holiday Gift Guide 🎁 Free Gift Wrapping"
- Copy tone: Warm, Joyful, Gifting-focused
- Keywords: "Gift", "Joy", "Warmth", "Love", "Holiday", "Celebration"
- Hero headline pattern: "Give the Gift of [Product]" or "Make This Holiday Special"
- Add CountdownTimer: "Christmas Sale Ends In"
`,
  newyear: `
CAMPAIGN: NEW YEAR 🎆
MANDATORY REQUIREMENTS:
- Color palette: Gold, Black, Silver
- BannerStrip: "New Year, New You 🎆 Start Fresh"
- Copy tone: Aspirational, Fresh Start, Goal-focused
- Keywords: "New Beginning", "Fresh Start", "Transform", "2024", "Resolution"
- Add CountdownTimer if applicable
`,
  summer: `
CAMPAIGN: SUMMER SALE ☀️
MANDATORY REQUIREMENTS:
- Bright, vibrant colors: Yellow, Orange, Cyan, Coral
- BannerStrip: "SUMMER SALE ☀️ Up to 50% OFF"
- Copy tone: Fun, Energetic, Vacation-inspired
- Keywords: "Summer", "Hot Deal", "Sizzling", "Beach", "Adventure"
`,
};

/**
 * DESIGN LAYOUT RULES (Structure)
 */
const DESIGN_LAYOUT_RULES: Record<string, string> = {
  minimalist: `
LAYOUT: MINIMALIST
- Use plenty of whitespace (paddingY='xl'). 
- Single column layout for maximum focus.
- Avoid clutter; use fewer elements with more impact.
- Hero: Clean, centered text, subtle background.
`,
  grid: `
LAYOUT: GRID-BASED
- Use Grid components extensively (cols=3 or cols=4).
- High information density.
- Compact padding (paddingY='md').
- Structured, orderly presentation of products/features.
`,
  magazine: `
LAYOUT: MAGAZINE / EDITORIAL
- Asymmetrical layouts (FlexStack direction='row' with different widths).
- Varied typography sizes (huge headings vs small captions).
- Mix text and images side-by-side in interesting ways.
- Narrative flow with visual interruptions.
`,
  immersive: `
LAYOUT: IMMERSIVE / FULL-SCREEN
- Use full-screen sections (Hero height='90vh').
- Large background images (ImageBlock width='100%').
- Minimal text overlaying impressive visuals.
- Cinematic feel.
`,
  split: `
LAYOUT: SPLIT-SCREEN
- Use alternating split layouts (Text Left/Image Right -> Image Left/Text Right).
- Clean 50/50 division using FlexStack/Grid.
- Clear distinction between content and visuals.
`,
};

/**
 * DESIGN PALETTE RULES (Color Usage)
 */
const DESIGN_PALETTE_RULES: Record<string, string> = {
  monochromatic: `
PALETTE: MONOCHROMATIC
- Use shades of slate, gray, black, and white ONLY.
- Brand color used VERY sparingly for key actions only.
- Clean, sophisticated, high-end look.
`,
  morandi: `
PALETTE: MORANDI (LOW SATURATION)
- Use muted, dusty colors: stone-100, stone-200, zinc-100.
- Soft contrast; avoid pure black or pure white.
- Elegant, calming, timeless.
`,
  contrast: `
PALETTE: HIGH CONTRAST
- Stark difference between background and text.
- Black background with bright accents, or White with bold Black.
- Sharp edges, no gradients, high visibility.
`,
  earthy: `
PALETTE: EARTHY / NATURAL
- Use organic colors: amber, stone, emerald, neutral.
- Warm gray backgrounds.
- Grounded, authentic feel.
`,
  pastel: `
PALETTE: PASTEL / SOFT
- Use light, airy colors: rose-50, blue-50, purple-50.
- Gentle approach, friendly and welcoming.
- Soft UI elements (rounded corners).
`,
};

/**
 * DESIGN TONE RULES (Visual Atmosphere)
 */
const DESIGN_TONE_RULES: Record<string, string> = {
  'high-key': 'bright lighting, high exposure, light shadows, airy, white background',
  'low-key': 'dim lighting, dramatic deep shadows, moody, black background, mystery',
  'warm': 'golden hour lighting, warm color temperature, orange/yellow glow, cozy',
  'cool': 'blue hour lighting, cold color temperature, clinical or futuristic, cyan/blue',
  'neutral': 'balanced studio lighting, natural daylight, true-to-life colors, clean',
};

/**
 * DESIGN ART RULES (Aesthetic Style)
 */
const DESIGN_ART_RULES: Record<string, string> = {
  minimalist: 'minimalist composition, clean lines, negative space, reductionist',
  classic: 'classic art style, timeless, renaissance composition, rich textures',
  abstract: 'abstract forms, geometric shapes, avant-garde, interpretive',
  pop: 'pop art style, bold outlines, vibrant colors, comic aesthetic, dots',
  organic: 'natural textures, biomimetic shapes, flowing lines, soft edges, botanical',
  cyberpunk: 'cyberpunk aesthetic, neon lights, glitch effects, high-tech, futuristic',
};

/**
 * TONE RULES (Industry-based)
 */
const TONE_RULES: Record<string, string> = {
  saas: 'Professional yet approachable. Focus on productivity, ROI, time-savings.',
  fashion: 'Trendy, aspirational. Focus on style, confidence, self-expression.',
  food: 'Warm, sensory. Focus on taste, freshness, craftsmanship.',
  beauty: 'Empowering, self-care. Focus on glow, radiance, self-love.',
  home: 'Cozy, inspiring. Focus on comfort, design, transformation.',
  services:
    'Trust-building, expert. Focus on experience, reliability, results.',
};

/**
 * PAGE TYPE RULES
 */
const PAGE_TYPE_RULES: Record<string, string> = {
  landing: `
PAGE TYPE: HOMEPAGE (Landing Page)
- Balanced mix of content: Hero -> Features -> Products -> Testimonials -> FAQ.
- Goal: Conversion and Brand Introduction.
- Narrative: "Here is who we are, what we sell, and why you should trust us."
`,
  product: `
PAGE TYPE: PRODUCT SHOWCASE
- Focus HEAVILY on the product grid and details.
- Hero should feature the main product clearly.
- Use "Add to Cart" or "Buy Now" CTAs frequently.
- Include detailed specs, pricing, and product-focused imagery.
- Layout: Hero -> Product Grid (Large) -> Features (Specs) -> Reviews.
`,
  story: `
PAGE TYPE: BRAND STORY
- Focus on narrative, history, and values.
- Use large, emotional imagery (less product-focused, more lifestyle/mood).
- Text-heavy sections with "Our Mission", "Our Journey", "The Founders".
- Layout: Hero (Atmospheric) -> Text Block -> Image Split -> Team/Values -> Footer.
- Tone: Inspiring, personal, authentic.
`,
  contact: `
PAGE TYPE: CONTACT US
- Focus on accessibility and clear communication channels.
- Layout: Simple Hero -> Contact Grid (Email, Phone, Address cards) -> Map Placeholder -> FAQ -> Footer.
- Tone: Professional, welcoming, helpful.
- Visuals: Minimalist, use icons for contact methods, map-style imagery.
`,
  blog: `
PAGE TYPE: BLOG / NEWS
- Focus on content discovery and readability.
- Layout: Featured Article Hero -> Grid of Recent Articles -> Newsletter Signup -> Footer.
- Content: Generate realistic article titles and short excerpts.
- Visuals: Editorial style, diverse imagery for different articles.
`,
};

/**
 * STRATEGY COPY RULES
 */
const STRATEGY_COPY_RULES: Record<string, string> = {
  cost: 'Use: "Sale", "Deal", "% OFF". Show strikethrough prices. Add urgency.',
  premium:
    'Use: "Exclusive", "Crafted", "Artisan". NO sale words. Minimal price display.',
  innovation:
    'Use: "Smart", "AI-Powered", "Revolutionary". Show specs and metrics.',
  trust: 'Use: "Guaranteed", "Expert", "Certified". Show social proof early.',
  efficiency: 'Use: "Instant", "Fast", "Easy". Time-focused metrics.',
};

/**
 * VOICE TONE RULES
 */
const VOICE_TONE_RULES: Record<string, string> = {
  professional: 'Tone: Authoritative, reliable, expert. Avoid slang.',
  friendly: 'Tone: Warm, welcoming, helpful. Use "we" and "you".',
  humorous: 'Tone: Witty, playful, fun. Make the user smile.',
  luxury: 'Tone: Sophisticated, exclusive, refined. Use elegant vocabulary.',
  confident: 'Tone: Bold, assertive, powerful. Inspire action.',
};

/**
 * TEXT LENGTH RULES
 */
const TEXT_LENGTH_RULES: Record<string, string> = {
  short: 'Length: STRICTLY CONCISE. Use bullet points and very short sentences. Headlines < 5 words. Body < 20 words.',
  medium: 'Length: BALANCED. Standard paragraphs (2-3 sentences).',
  long: 'Length: DETAILED. Use descriptive paragraphs. Storytelling approach. Rich adjectives.',
};



@Injectable()
export class AiService {
  async generateSite(
    prompt: string,
    style: string = 'minimal',
    sections: string[] = ['hero', 'features', 'footer'],
    ctx: BusinessContext = {},
  ) {
    const {
      industry = 'saas',
      productName = 'Premium Product',
      productDescription = 'Excellence in every detail',
      targetAudience = 'professionals',
      competitiveStrategy = 'innovation',
      shopName = 'My Store',
      language = 'en',
      currency = 'USD',
      campaignMode = 'standard',
      pageType = 'landing',
      primaryColor = '#3B82F6',
      // New Dimensions
      designLayout = 'minimalist',
      designPalette = 'monochromatic',
      designTone = 'neutral',
      designArt = 'minimalist',
      voiceTone = 'professional',
      textLength = 'medium',
    } = ctx;

    const currencySymbol = CURRENCY_SYMBOLS[currency] || '$';
    const languageName = LANGUAGE_NAMES[language] || 'English';

    // Build all rules
    const toneRule = TONE_RULES[industry] || TONE_RULES['saas'];
    const strategyRule =
      STRATEGY_COPY_RULES[competitiveStrategy] ||
      STRATEGY_COPY_RULES['innovation'];
    const campaignRule =
      CAMPAIGN_RULES[campaignMode] || CAMPAIGN_RULES['standard'];
    const pageTypeRule =
      PAGE_TYPE_RULES[pageType] || PAGE_TYPE_RULES['landing'];
    
    // New Design Rules
    const layoutRule = DESIGN_LAYOUT_RULES[designLayout] || DESIGN_LAYOUT_RULES['minimalist'];
    const paletteRule = DESIGN_PALETTE_RULES[designPalette] || DESIGN_PALETTE_RULES['monochromatic'];
    const voiceRule = VOICE_TONE_RULES[voiceTone] || VOICE_TONE_RULES['professional'];
    const lengthRule = TEXT_LENGTH_RULES[textLength] || TEXT_LENGTH_RULES['medium'];
    // Note: Tone & Art rules are used in processImages, not here in System Prompt usually, 
    // BUT we should give the LLM a hint about the overall vibe.
    const aestheticsSummary = `Visual Style: ${designArt} art style with ${designTone} lighting.`;


    const systemPrompt = `
You are an expert marketing strategist and web designer.
Create a landing page that PERFECTLY aligns with ALL the rules below.

=== BRAND IDENTITY ===
Shop Name: ${shopName}
Product: ${productName}
Description: ${productDescription}
Industry: ${industry}
Target: ${targetAudience}

=== LOCALIZATION (CRITICAL) ===
LANGUAGE: Generate ALL text content in ${languageName}. 
- Headline, body, buttons, everything in ${languageName}.
- If ${languageName} is not English, do NOT use English anywhere.
CURRENCY: Use "${currencySymbol}" for all prices.
- Example: ${currencySymbol}99, ${currencySymbol}199, ${currencySymbol}1,299

=== COMPETITIVE STRATEGY: ${competitiveStrategy.toUpperCase()} ===
${strategyRule}

=== TONE & VOICE ===
${toneRule}
${voiceRule}
${lengthRule}

=== CAMPAIGN MODE ===

=== CAMPAIGN MODE ===
${campaignRule}

=== LAYOUT STRUCTURE: ${designLayout.toUpperCase()} ===
${layoutRule}

=== COLOR PALETTE: ${designPalette.toUpperCase()} ===
${paletteRule}

=== AESTHETIC DIRECTION ===
${aestheticsSummary}

=== PAGE TYPE: ${pageType.toUpperCase()} ===
${pageTypeRule}

=== BRAND COLOR ===
Primary Color: ${primaryColor}
Use this color for CTAs, accents, and key highlights.

=== AVAILABLE COMPONENTS & API (Strict Props) ===

1. Section
   - props: { 
       bgColor: string (hex), 
       paddingY: 'none'|'sm'|'md'|'lg'|'xl', 
       fullWidth: boolean,
       backgroundPattern: 'none'|'dots'|'grid'|'noise'|'mesh'
     }
   - children: atomic components (Grid, FlexStack, etc.)

2. Grid
   - props: { 
       columns: number (1, 2, 3, 4, 6, 12), 
       gap: 'none'|'sm'|'md'|'lg',
       mobileCollapse: boolean (default true)
     }

3. FlexStack
   - props: { 
       direction: 'row'|'col', 
       gap: 'none'|'sm'|'md'|'lg', 
       align: 'start'|'center'|'end'|'stretch',
       justify: 'start'|'center'|'end'|'between',
       padding: 'none'|'sm'|'md'|'lg',
       radius: 'none'|'sm'|'md'|'lg'|'full',
       shadow: 'none'|'sm'|'md'|'lg',
       bgColor: string (hex or 'transparent')
     }

4. Typography
   - props: { 
       as: 'h1'|'h2'|'h3'|'p'|'span',
       variant: 'h1'|'h2'|'h3'|'body'|'caption',
       size: 'xs'|'sm'|'base'|'lg'|'xl'|'2xl'|'3xl'|'4xl'|'5xl',
       weight: 'normal'|'medium'|'semibold'|'bold',
       align: 'left'|'center'|'right',
       color: string (hex),
       text: string (The actual content)
     }

5. Button
   - props: { text: string, color: 'blue'|'green'|'red'|'purple'|'black'|'white' }

6. ImageBlock
   - props: { 
       src: string (Must start with "IMAGE_PROMPT: "), 
       alt: string, 
       width: string (e.g., "100%", "300px"), 
       height: string (e.g., "auto", "400px"), 
       radius: 'none'|'sm'|'md'|'lg'|'full'
     }

7. CtaButton
   - props: { 
       text: string, 
       variant: 'primary'|'secondary'|'outline'|'ghost', 
       size: 'sm'|'md'|'lg', 
       fullWidth: boolean 
     }

8. NavBar (MANDATORY at top)
    - props: {
        brandName: string,
        links: string[] (e.g. ['Home', 'Shop', 'About']),
        transparent: boolean,
        darkMode: boolean
      }

9. CraftCard
   - props: { padding: 'sm'|'md'|'lg' }
   - description: A simple container with shadow and bg, good for features/testimonials.

10. Footer
    - props: {
        companyName: string,
        description: string,
        links: { title: string, items: string[] }[],
        showNewsletter: boolean,
        darkMode: boolean
      }

11. Feature
    - props: { icon: string (Lucide icon name), title: string, description: string }
    - description: Small block with icon, good for Grid.

12. Testimonial
    - props: { content: string, author: string, role: string, avatar: string, rating: number }
    - note: avatar should be "IMAGE_PROMPT: portrait of..."

13. Pricing
    - props: { 
        plans: { name: string, price: string, features: string[], isPopular: boolean, cta: string }[],
        currency: string
      }

14. Stats
    - props: { items: { label: string, value: string }[] }
    - description: Large numbers for social proof.

15. HeroCarousel
    - props: { slides: { image: string, title: string, subtitle: string, ctaText: string }[] }

16. Accordion
    - props: { items: { question: string, answer: string }[] }
    - description: FAQ section.

=== VISUAL POLISH RULES (MANDATORY) ===
1. NAVIGATION & LAYOUT (CRITICAL):
   - ORDER IS STRICT: [BannerStrip (Optional)] -> [NavBar] -> [HERO] -> [Content...] -> [Footer].
   - If you use 'BannerStrip', it MUST be the very first component.
   - If 'BannerStrip' is present, 'NavBar' props MUST have "transparent: false" to avoid overlapping.
   - Every page MUST end with a 'Footer' component.

2. IMAGERY & LAYOUT (CRITICAL):
   - DO NOT make every image full-width.
   - HERO SECTION: Use a full-width ImageBlock (width="100%", height="600px" or "auto").
   - PRODUCT/FEATURE SECTIONS:
     - Use 'Grid' with 2, 3, or 4 columns.
     - Inside Grid, use ImageBlock with width="100%" (relative to column).
     - Use aspectRatio="square" or "portrait" for uniform product cards.
     - NEVER stack huge full-width images vertically for products; it looks like a blog, not a shop.

3. TYPOGRAPHY:
   - For 'luxury': Serif headings (font-serif), Sans body.
   - For 'tech': Mono headings (font-mono), Sans body.
   - For 'street': Display headings (uppercase, tracking-tight).

4. RESPONSIVE DESIGN (AUTOMATED):
   - The 'Grid' component handles responsive layouts automatically (Phone: 1 col, Tablet: 2 cols, Desktop: N cols).
   - The 'Typography' component scales font sizes automatically for smaller screens.
   - DO NOT try to manually create separate mobile layouts. Just use standard components and they will adapt.
   - ALWAYS use 'Grid' for multi-column content.

4. COMPONENT HIERARCHY:
   - Banner -> NavBar -> Hero Section -> Features Grid -> Product Showcase (Grid) -> Footer.

5. LAYOUT:
   - Use 'Section' for every distinct block.
   - Use 'Grid' for structured content (features, products).
   - Use 'FlexStack' for vertical/horizontal alignment.
   - Use 'HeroCarousel' for the top section if the site needs to showcase multiple luxury images or promotions.
   - Use 'Typography' for ALL text.
   
7. SPACING (CRITICAL):
   - When using the Standard Layout, there is a distinct NavBar.
   - Therefore, the FIRST section (HERO) must NOT have explicit top padding that creates a huge gap.
   - HERO spacing: Use paddingY="none" or "sm" if it's the first section under the NavBar.
   - General spacing: Use paddingY="xl" for standard sections to maintain breathability.

8. IMAGERY (MANDATORY):
   - You MUST include at least 3 'ImageBlock' components in the page.
   - The Hero Section (first section) MUST contain a high-quality ImageBlock or background image.
   - IMPORTANT: ALL image 'src' props MUST start with "IMAGE_PROMPT: " followed by a descriptive prompt. Do NOT use fake URLs.
   - Use images to break up text and add visual interest.

=== OUTPUT FORMAT (JSON Tree) ===
Return a JSON object with a "components" array. 
Each component is: { "type": "ComponentName", "props": { ... }, "children": [ ... ] }

Example:
{
  "components": [
    {
      "type": "Section",
      "props": { "paddingY": "xl", "bgColor": "#ffffff" },
      "children": [
        {
          "type": "FlexStack",
          "props": { "direction": "col", "gap": "lg", "align": "center" },
          "children": [
            { "type": "Typography", "props": { "variant": "h1", "text": "Welcome" } },
            { "type": "Button", "props": { "text": "Get Started", "color": "blue" } }
          ]
        }
      ]
    }
  ]
}

=== CRITICAL RULES ===
1. Return ONLY valid JSON.
2. NO Markdown formatting needed in response (just raw JSON).
3. IMAGES:
   - For every 'ImageBlock' src prop, you MUST use the format: "IMAGE_PROMPT: <detailed visual description>".
   - Example: "IMAGE_PROMPT: A cinematic shot of a modern coffee machine, moody lighting, 4k"
   - DO NOT provide a URL. DO NOT leave empty.
   - This applies to 'bgImage' props on Sections as well if you use them.
4. Product name is "${productName}".
`;

    const userPrompt = `
${prompt}
Generate a ${campaignMode !== 'standard' ? campaignMode.toUpperCase() + ' campaign ' : ''}${designLayout} page for "${productName}".
All content in ${languageName}. Prices in ${currencySymbol}.
OUTPUT ONLY RAW JSON. NO MARKDOWN. NO EXPLANATIONS.
`;

    try {
      console.log(
        `[AI] Strategy: ${competitiveStrategy} | Campaign: ${campaignMode} | Language: ${language} | Layout: ${designLayout} | Type: ${pageType}`,
      );
      console.log(`[AI] Sections: ${sections.join(', ')}`);
      console.log('[AI] System Prompt:', systemPrompt);
      console.log('[AI] User Prompt:', userPrompt);

      const { text } = await generateText({
        model: vertex('gemini-2.5-flash'),
        system: systemPrompt,
        prompt: userPrompt,
        maxTokens: 8192, // Force high token limit
        temperature: 0.7,
      } as any);

      let cleanText = text.trim();
      // Remove markdown code blocks if present
      cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();

      console.log(
        '[AI] Response (first 500 chars):',
        cleanText.substring(0, 500),
      );

      try {
        const result = JSON.parse(cleanText) as { components: any[] };
        
        // --- Image Generation Logic ---
        if (result.components && Array.isArray(result.components)) {
             console.log(`[AI] Parsing ${result.components.length} components for images...`);
             await this.processImages(result.components, designTone, designArt, campaignMode);
        }
        // ------------------------------

        if (result.components && Array.isArray(result.components)) {
          console.log(
            `[AI] Generated ${result.components.length} components successfully`,
          );
        }
        return result;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        return {
          error: true,
          message: `JSON Parse Error: ${cleanText.substring(0, 200)}`,
        };
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('AI Generation Failed:', error);
      return { error: true, message: `AI Generation Failed: ${errorMessage}` };
    }
  }

  /**
   * Recursively finds IMAGE_PROMPT values and replaces them with generated images
   */
  private async processImages(
    components: any[], 
    designTone: string = 'neutral', 
    designArt: string = 'minimalist', 
    campaignMode: string = 'standard'
  ) {
      const tasks: Promise<void>[] = [];
      
      const tonePrompt = DESIGN_TONE_RULES[designTone] || DESIGN_TONE_RULES['neutral'];
      const artPrompt = DESIGN_ART_RULES[designArt] || DESIGN_ART_RULES['minimalist'];
      const combinedStylePrompt = `${artPrompt}, ${tonePrompt}`;

      const traverse = (node: any) => {
          if (!node || typeof node !== 'object') return;
          
          // Determine Component Context for Aspect Ratio
          let context = 'aspect ratio 4:3'; // Default
          
          if (node.type === 'Section' || node.type === 'HERO' || node.type === 'HeroCarousel') {
            context = 'wide angle, panoramic, 16:9 aspect ratio, background texture';
        } else if (node.type === 'ProductCard' || node.type === 'Grid') {
            context = 'product photography, isolated subject, 1:1 square aspect ratio, centered';
          } else if (node.type === 'ImageBlock') {
             // Try to infer from props if possible, otherwise default
             if (node.props?.width === '100%' && (!node.props?.height || node.props?.height === 'auto')) {
                  context = 'wide shot, 16:9 aspect ratio';
             } else {
                  context = 'standard photography, 4:3 aspect ratio';
             }
          }

          // Check props for image prompts (including nested arrays like slides)
        const checkAndReplace = (obj: any, key: string | number) => {
            const val = obj[key];
            if (typeof val === 'string' && val.startsWith('IMAGE_PROMPT:')) {
                const basePrompt = val.replace('IMAGE_PROMPT:', '').trim();
                
                let campaignContext = '';
                if (campaignMode === 'christmas') campaignContext = ', christmas theme, festive, holiday decoration, snow';
                else if (campaignMode === 'blackfriday') campaignContext = ', black friday sales, bold red and black';
                else if (campaignMode === 'summer') campaignContext = ', summer vibes, bright sunlight, beach atmosphere';
                else if (campaignMode === 'newyear') campaignContext = ', new year celebration, fireworks, gold and silver';

                const fullPrompt = `${basePrompt}, ${combinedStylePrompt}${campaignContext}, ${context}`;
                
                // Push a task to generate and replace
                tasks.push(
                    this.generateImage(fullPrompt).then((imageUrl) => {
                         console.log(`[AI-Image] Generated for: "${basePrompt.substring(0, 30)}..."`);
                         obj[key] = imageUrl;
                    }).catch((err) => {
                        console.error(`[AI-Image] Failed for: "${basePrompt.substring(0, 30)}..."`, err);
                        obj[key] = `https://placehold.co/800x600?text=${encodeURIComponent(basePrompt.split(' ').slice(0,3).join('+'))}`;
                    })
                );
            } else if (typeof val === 'object' && val !== null) {
                // Recursively search in nested objects/arrays
                Object.keys(val).forEach(k => checkAndReplace(val, k));
            }
        };

        if (node.props) {
            Object.keys(node.props).forEach(key => checkAndReplace(node.props, key));
        }
  

          // Recurse
          if (node.children && Array.isArray(node.children)) {
              node.children.forEach(traverse);
          }
      };

      components.forEach(traverse);

      if (tasks.length > 0) {
          console.log(`[AI-Image] Generating ${tasks.length} images (Art: ${designArt}, Tone: ${designTone})...`);
          await Promise.all(tasks);
          console.log(`[AI-Image] All images generated.`);
      }
  }

  private async generateImage(prompt: string): Promise<string> {
    try {
      console.log(`[AiService] generateImage (Vertex SDK) calling: "${prompt.substring(0, 50)}..."`);

      // Dynamic import to avoid build issues
      const { VertexAI } = await import('@google-cloud/vertexai');

      // Initialize Vertex AI
      const project = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || process.env.GOOGLE_VERTEX_PROJECT;
      const location = process.env.GOOGLE_CLOUD_LOCATION || process.env.GOOGLE_VERTEX_LOCATION || 'us-central1';

      const vertex_ai = new VertexAI({ project: project, location: location });

      // Instantiate the model
      const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: 'gemini-2.5-flash-image',
        generationConfig: {
          responseModalities: ['IMAGE'],
        } as any, 
      });

      const req = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      };

      // Use generateContent (non-streaming) for images
      const resp = await generativeModel.generateContent(req);
      
      if (!resp.response.candidates || resp.response.candidates.length === 0) {
           throw new Error('No candidates in response');
      }
      
      const candidate = resp.response.candidates[0];
      if (!candidate.content || !candidate.content.parts) {
          throw new Error('No content parts in candidate');
      }

      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.data) {
          console.log('[AiService] Image received from gemini-2.5-flash-image');
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }

      throw new Error('No image inlineData found in response parts');
    } catch (e: any) {
      console.error('[AiService] Vertex SDK generation failed details:', {
          message: e.message,
          stack: e.stack,
          response: e.response ? JSON.stringify(e.response) : 'undefined'
      });
      // Rely on processImages fallback logic by throwing
      throw e;
    }
  }
}
