import { useState } from 'react';
import { API_BASE } from '../config';
import { useEditor } from '@craftjs/core';
import { RawHTML } from './editor/RawHTML';
import { Section } from './craft/Section';
import { Grid } from './craft/Grid';
import { FlexStack } from './craft/FlexStack';
import { Typography } from './craft/Typography';
import { Button } from './user/Button';
import { ImageBlock } from './craft/ImageBlock';
import { CtaButton } from './craft/CtaButton';
import { CraftCard } from './craft/CraftCard';
import { BannerStrip } from './craft/BannerStrip';
import { DecorationLayer } from './craft/DecorationLayer';
import { Accordion } from './craft/Accordion';
import { CountdownTimer } from './craft/CountdownTimer';
import { Icon } from './craft/Icon';
import { LogoTicker } from './craft/LogoTicker';
import { ProductCard } from './craft/ProductCard';
import React from 'react';

// Component Map for AI JSON deserialization
const COMPONENT_MAP: Record<string, React.ElementType> = {
    Section,
    Grid,
    FlexStack,
    Typography,
    Button,
    ImageBlock,
    CtaButton,
    CraftCard,
    BannerStrip,
    DecorationLayer,
    Accordion,
    CountdownTimer,
    Icon,
    LogoTicker,
    ProductCard,
    // Fallback/Utility
    RawHTML
};

export const AiPrompt = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const { actions, query } = useEditor();

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);

        try {


// ... inside component ...
            const response = await fetch(`${API_BASE}/ai/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Note: In a real app, we'd need auth headers here if Supabase Auth is enabled
                    // For now, if you encounter 401, we might need to temporary disable Guard or get a token
                     'Authorization': 'Bearer YOUR_TEST_TOKEN_OR_DISABLE_GUARD_TEMPORARILY' 
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error('AI Generation failed');
            }

            const data = await response.json(); // { components: [...] }
            
            if (data.components && Array.isArray(data.components)) {
                // Recursive function to convert JSON tree to React Elements
                const buildComponentTree = (node: any, index: number): React.ReactNode => {
                    const Component = COMPONENT_MAP[node.type];
                    if (!Component) {
                        console.warn(`Unknown component type: ${node.type}`);
                        return null;
                    }

                    const props = node.props || {};
                    const children = node.children && Array.isArray(node.children)
                        ? node.children.map((child: any, i: number) => buildComponentTree(child, i))
                        : null;

                    // Return as a React Element
                    return React.createElement(Component, { key: index, ...props }, children);
                };

                // Build the tree for each root component
                const rootElements = data.components.map((comp: any, i: number) => buildComponentTree(comp, i));

                // Process each root element into a NodeTree and add to canvas
                // We wrap in a Fragment or simply add sequentially
                
                // Since actions.addNodeTree expects a single tree, we might need to iterate.
                // Or better: Wrap everything in a standard container if multiple roots, 
                // but usually the AI returns Sections. We can add them one by one.
                
                // Note: query.parseReactElement takes a single element. 
                // We can't pass an array. So we iterate.
                rootElements.forEach((element: React.ReactElement) => {
                    if (element) {
                        const nodeTree = query.parseReactElement(element).toNodeTree();
                        actions.addNodeTree(nodeTree, 'ROOT');
                    }
                });

            } else if (data.html) {
                 // Fallback for legacy HTML response
                const rawHtmlNode = <RawHTML html={data.html} />;
                const nodeTree = query.parseReactElement(rawHtmlNode).toNodeTree();
                actions.addNodeTree(nodeTree, 'ROOT');
            } else {
                throw new Error('Invalid AI response format');
            }
            
        } catch (error) {
            console.error(error);
            alert('AI Generation Failed. Check console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2 items-center w-full">
            <input 
                type="text" 
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow hover:border-gray-400"
                placeholder="✨ AI Prompt: 'A pricing section with 3 cards'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button 
                onClick={handleGenerate}
                disabled={loading}
                className={`flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded text-sm font-medium shadow hover:shadow-md transition-all ${loading ? 'opacity-70 cursor-wait' : 'hover:scale-105'}`}
            >
                {loading ? (
                    <>Generating...</> 
                ) : (
                    <>✨ Generate</>
                )}
            </button>
        </div>
    )
}
