import { useEffect, useState } from 'react';
import { Editor, Frame } from '@craftjs/core';
import { Container } from '../components/user/Container';
import { Text } from '../components/user/Text';
import { Button } from '../components/user/Button';
import { RawHTML } from '../components/editor/RawHTML';
import { Section } from '../components/craft/Section';
import { Grid } from '../components/craft/Grid';
import { FlexStack } from '../components/craft/FlexStack';
import { Typography } from '../components/craft/Typography';
import { ImageBlock } from '../components/craft/ImageBlock';
import { Icon } from '../components/craft/Icon';
import { CtaButton } from '../components/craft/CtaButton';
import { CraftCard } from '../components/craft/CraftCard';
import { ProductCard } from '../components/craft/ProductCard';
import { ProductDetail } from '../components/craft/ProductDetail';
import { Accordion } from '../components/craft/Accordion';
import { HeroCarousel } from '../components/craft/HeroCarousel';
import { Pricing } from '../components/craft/Pricing';
import { Stats } from '../components/craft/Stats';
import { Feature } from '../components/craft/Feature';
import { Testimonial } from '../components/craft/Testimonial';
import { CountdownTimer } from '../components/craft/CountdownTimer';
import { BannerStrip } from '../components/craft/BannerStrip';
import { NavBar } from '../components/craft/NavBar';
import { Footer } from '../components/craft/Footer';
import { DecorationLayer } from '../components/craft/DecorationLayer';
import { UnknownComponent } from '../components/craft/UnknownComponent';
import { LogoTicker } from '../components/craft/LogoTicker';

const resolver = {
  Container, Text, Button, RawHTML,
  Section, Grid, FlexStack, Typography, ImageBlock, Icon, CtaButton, CraftCard,
  LogoTicker, ProductCard, Accordion, HeroCarousel, Pricing, Stats, Feature, Testimonial, ProductDetail,
  CountdownTimer, BannerStrip, NavBar, Footer, DecorationLayer, UnknownComponent
};

import { API_BASE } from '../config';


interface PublicSiteRendererProps {
    domain: string;
}

export function PublicSiteRenderer({ domain }: PublicSiteRendererProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pageContent, setPageContent] = useState<any>(null);

    useEffect(() => {
        const fetchSiteAndPage = async () => {
             try {
                 setLoading(true);
                 // 1. Find Site by Domain
                 const siteRes = await fetch(`${API_BASE}/sites/by-domain?domain=${domain}`);
                 if (!siteRes.ok) {
                     throw new Error('Site not found');
                 }
                 const site = await siteRes.json();
                 
                 // 2. Find Home Page
                 // For MVP, we assume the first page created or a page with slug 'home' or '/' is home.
                 // Let's list pages and find one.
                 const pagesRes = await fetch(`${API_BASE}/pages?siteId=${site.id}`);
                 const pages = await pagesRes.json();
                 
                 // Strategy: Look for slug 'home', 'index', or take the first one.
                 const homePage = pages.find((p: any) => p.slug === 'home' || p.slug === 'index' || p.slug === '/') || pages[0];
                 
                 if (!homePage) {
                     throw new Error('No published pages found for this site.');
                 }
                 
                 if (!homePage.content || Object.keys(homePage.content).length === 0) {
                      throw new Error('Home page is empty.');
                 }

                 setPageContent(homePage.content);

             } catch(err: any) {
                 console.error('Public Render Error:', err);
                 setError(err.message);
             } finally {
                 setLoading(false);
             }
        };

        if (domain) {
            fetchSiteAndPage();
        }
    }, [domain]);

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-white">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
            </div>
        </div>
    );

    if (error) return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-50">
            <div className="text-center max-w-md p-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Site Not Available</h1>
                <p className="text-slate-500">{error}</p>
                <div className="mt-8 pt-8 border-t border-slate-200">
                    <p className="text-xs text-slate-400">Powered by BuildStore</p>
                </div>
            </div>
        </div>
    );

    return (
         <div className="w-full min-h-screen bg-white">
             {/* Read-Only Craft Editor */}
             <Editor resolver={resolver} enabled={false}>
                 <Frame json={pageContent} />
             </Editor>
         </div>
    );
}
