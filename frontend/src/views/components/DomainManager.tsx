import { useState, useEffect } from 'react';
import { Globe, ExternalLink, AlertCircle, CheckCircle2, Copy, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

import { API_BASE } from '../../config';


interface Site {
    id: string;
    subdomain: string;
    custom_domain?: string;
}

export function DomainManager({ siteId }: { siteId: string }) {
    const [, setSite] = useState<Site | null>(null);
    const [subdomain, setSubdomain] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Wizard State
    const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
    const [customDomainInput, setCustomDomainInput] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        if (!siteId) return;
        fetchSite();
    }, [siteId]);

    const fetchSite = async () => {
        try {
            const res = await fetch(`${API_BASE}/sites/${siteId}`);
            if (res.ok) {
                const data = await res.json();
                setSite(data);
                setSubdomain(data.subdomain);
                if (data.custom_domain) {
                    setCustomDomainInput(data.custom_domain);
                    setWizardStep(3); // Already connected
                }
            }
        } catch (err) {
            console.error('Failed to fetch site:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubdomainSave = async () => {
        setMessage(null);
        try {
            const res = await fetch(`${API_BASE}/sites/${siteId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subdomain })
            });

            if (res.ok) {
                const updated = await res.json();
                setSite(updated);
                setMessage({ type: 'success', text: 'Subdomain updated successfully.' });
            } else {
                throw new Error('Failed to update subdomain');
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    const handleConnectDomain = async () => {
        setIsVerifying(true);
        // Simulate verification delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        try {
             const res = await fetch(`${API_BASE}/sites/${siteId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ custom_domain: customDomainInput })
            });

            if (res.ok) {
                const updated = await res.json();
                setSite(updated);
                setWizardStep(3);
                setMessage({ type: 'success', text: 'Domain connected successfully!' });
            } else {
                 throw new Error('Failed to connect domain');
            }
        } catch(err) {
             setMessage({ type: 'error', text: 'Failed to verify domain configuration. Please check your DNS settings.' });
        } finally {
            setIsVerifying(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could show a toast here
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading domain settings...</div>;

    return (
        <div className="max-w-3xl space-y-8 pb-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Globe size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Domain Settings</h2>
                    <p className="text-slate-500 text-sm">Manage your site's web address and custom domains.</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            {/* Section 1: Buildstore Subdomain */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs">1</span>
                    Buildstore Subdomain
                </h3>
                 <div className="flex gap-2">
                    <div className="flex-1 flex rounded-lg shadow-sm">
                        <input
                            type="text"
                            value={subdomain}
                            onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                            className="flex-1 min-w-0 block w-full px-4 py-2.5 rounded-l-lg border border-slate-300 text-slate-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="your-site-name"
                        />
                        <span className="inline-flex items-center px-4 py-2 rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 text-slate-500 sm:text-sm font-medium">
                            .buildstore.com
                        </span>
                    </div>
                    <button 
                        onClick={handleSubdomainSave}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-black transition-colors"
                    >
                        Update
                    </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                    This is your default free address.
                </p>
            </div>

            {/* Section 2: Custom Domain Wizard */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span>
                        Custom Domain Setup
                        <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded ml-2">Pro</span>
                    </h3>
                </div>
                
                <div className="p-6 bg-slate-50/50">
                    {/* Step 1: Input */}
                    {wizardStep === 1 && (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600">Enter the domain you want to connect (e.g., www.mystore.com).</p>
                            <input
                                type="text"
                                value={customDomainInput}
                                onChange={(e) => setCustomDomainInput(e.target.value)}
                                className="block w-full px-4 py-3 rounded-lg border border-slate-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="www.example.com"
                            />
                            <div className="flex justify-end">
                                <button 
                                    onClick={() => setWizardStep(2)}
                                    disabled={!customDomainInput}
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next: Configure DNS <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: DNS Instructions */}
                    {wizardStep === 2 && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 text-sm mb-1">Action Required</h4>
                                <p className="text-sm text-blue-700">
                                    Log in to your domain provider (GoDaddy, Namecheap, etc.) and add the following record:
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center justify-between group">
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Record Type</span>
                                        <code className="text-lg font-mono font-bold text-slate-900">CNAME</code>
                                    </div>
                                </div>
                                
                                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center justify-between group">
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Name / Host</span>
                                        <code className="text-lg font-mono font-bold text-slate-900">www</code>
                                    </div>
                                    <button onClick={() => copyToClipboard('www')} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Copy">
                                        <Copy size={18} />
                                    </button>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center justify-between group">
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Value / Target (Points to Us)</span>
                                        <code className="text-lg font-mono font-bold text-slate-900">sites.buildstore.com</code>
                                        <p className="text-[10px] text-slate-400 mt-1">This routes traffic to our platform.</p>
                                    </div>
                                    <button onClick={() => copyToClipboard('sites.buildstore.com')} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Copy">
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4">
                                <button onClick={() => setWizardStep(1)} className="text-slate-500 hover:text-slate-700 text-sm font-medium">
                                    Back
                                </button>
                                <button 
                                    onClick={handleConnectDomain}
                                    disabled={isVerifying}
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 font-medium disabled:opacity-80"
                                >
                                    {isVerifying ? <Loader2 size={18} className="animate-spin"/> : <RefreshCw size={18} />}
                                    {isVerifying ? 'Verifying...' : 'Verify Connection'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Success State */}
                    {wizardStep === 3 && (
                        <div className="text-center py-8">
                             <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={32} />
                             </div>
                             <h4 className="text-xl font-bold text-slate-900 mb-2">Domain Connected!</h4>
                             <p className="text-slate-600 max-w-md mx-auto mb-6">
                                <strong>{customDomainInput}</strong> has been saved. 
                                <br />Please allow up to 48 hours for DNS propagation worldwide.
                             </p>
                             <div className="flex justify-center gap-4">
                                <button onClick={() => setWizardStep(1)} className="text-blue-600 font-medium hover:underline text-sm">
                                    Connect another domain
                                </button>
                             </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex justify-between text-xs text-slate-400 px-2">
                <span>Domain settings may take a few minutes to propagate.</span>
                <a href="#" className="flex items-center gap-1 hover:text-blue-600">Documentation <ExternalLink size={10} /></a>
            </div>
        </div>
    );
}
