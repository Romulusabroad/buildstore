/**
 * Style Transformer
 * 
 * Applies style-specific Tailwind classes to AI-generated component structures.
 * AI generates the skeleton (layout, structure), frontend applies the visual style.
 */

import { styles, type StyleName, type StyleConfig } from './style-dictionary';

interface AIComponent {
  type: string;
  props?: Record<string, unknown>;
  children?: AIComponent[];
}

interface StyledComponent {
  type: string;
  props: Record<string, unknown>;
  children?: StyledComponent[];
}

/**
 * Transforms AI-generated components by injecting style-specific classes
 */
export function applyStyleToComponents(
  components: AIComponent[],
  styleName: StyleName
): StyledComponent[] {
  const styleConfig = styles[styleName];
  return components.map(component => transformComponent(component, styleConfig));
}

/**
 * Transform a single component and its children recursively
 */
function transformComponent(
  component: AIComponent,
  styleConfig: StyleConfig
): StyledComponent {
  const { type, props = {}, children } = component;
  
  // Apply style-specific transformations based on component type
  const styledProps = applyComponentStyle(type, props, styleConfig);
  
  // Recursively transform children
  const styledChildren = children?.map(child => transformComponent(child, styleConfig));
  
  return {
    type,
    props: styledProps,
    children: styledChildren,
  };
}

/**
 * Apply style-specific props to a component based on its type
 */
function applyComponentStyle(
  type: string,
  props: Record<string, unknown>,
  styleConfig: StyleConfig
): Record<string, unknown> {
  const newProps = { ...props };
  
  switch (type) {
    case 'Section': {
      // Apply section background color from style
      newProps.bgColor = styleConfig.colors.background;
      newProps.className = styleConfig.section;
      break;
    }
      
    case 'CraftCard':
    case 'Card': {
      // Apply card styling
      newProps.className = styleConfig.card;
      newProps.bgColor = styleConfig.colors.background;
      break;
    }
      
    case 'CtaButton': {
      // Apply button styling based on variant
      const variant = props.variant as string || 'default';
      if (variant === 'default' || variant === 'primary') {
        newProps.className = styleConfig.button;
        newProps.bgColor = styleConfig.colors.primary;
      } else if (variant === 'outline' || variant === 'secondary') {
        newProps.className = styleConfig.buttonOutline;
      }
      break;
    }
      
    case 'Typography': {
      // Apply typography styling based on 'as' prop
      const as = props.as as string || 'p';
      const typographyClass = styleConfig.typography[as as keyof typeof styleConfig.typography];
      if (typographyClass) {
        newProps.className = typographyClass;
      }
      // Apply text color
      if (as === 'h1' || as === 'h2' || as === 'h3') {
        newProps.color = styleConfig.colors.text;
      } else {
        newProps.color = styleConfig.colors.secondary;
      }
      break;
    }
      
    case 'ImageBlock': {
      // Apply image styling
      newProps.className = styleConfig.image;
      break;
    }
      
    case 'Icon': {
      // Apply icon color from style
      newProps.className = styleConfig.icon;
      newProps.color = styleConfig.colors.accent;
      break;
    }
      
    case 'Grid': {
      // Apply grid gap styling
      newProps.className = styleConfig.grid;
      break;
    }
      
    case 'FlexStack': {
      // Apply flex styling
      newProps.className = styleConfig.flexStack;
      break;
    }
      
    case 'ProductCard': {
      // Apply product card styling
      newProps.className = styleConfig.productCard;
      break;
    }
      
    case 'LogoTicker': {
      // Apply logo ticker styling
      newProps.className = styleConfig.logoTicker;
      break;
    }
      
    case 'Accordion': {
      // Apply accordion styling
      newProps.className = styleConfig.accordion;
      break;
    }
  }
  
  return newProps;
}

/**
 * Get style colors for use in components
 */
export function getStyleColors(styleName: StyleName) {
  return styles[styleName].colors;
}

/**
 * Process entire AI response and apply styles
 */
export function processAIResponse(
  response: { sections?: AIComponent[] },
  styleName: StyleName
): { sections: StyledComponent[] } {
  if (!response.sections || !Array.isArray(response.sections)) {
    throw new Error('Invalid AI response: missing sections array');
  }
  
  return {
    sections: applyStyleToComponents(response.sections, styleName),
  };
}
