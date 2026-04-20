import React, { useState } from 'react';
import { Coffee, Pizza, Navigation, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const util = (...inputs) => twMerge(clsx(inputs));

export default function Concessions({ currentWaypoint }) {
    const [searchMode, setSearchMode] = useState('brand'); // 'brand' or 'item'
    const [status, setStatus] = useState('');

    const concessionsList = {
        brand: [
            { name: "Domino's Pizza", location: "Concourse A", tag: "Pizza" },
            { name: "KFC Stadium Express", location: "Concourse B", tag: "Chicken" },
            { name: "Local Brews & Taps", location: "Upper Deck", tag: "Drinks" }
        ],
        item: [
            { name: "Bottled Water ($3)", location: "All Kiosks", tag: "Beverage" },
            { name: "Pepperoni Slice ($6)", location: "Concourse A", tag: "Food" },
            { name: "Team Jersey ($80)", location: "Merch C", tag: "Apparel" }
        ]
    };

    const handleRoute = (stallName) => {
        const origin = currentWaypoint || 'Seat';
        setStatus(`Routing generated from ${origin} to ${stallName}`);
        setTimeout(() => setStatus(''), 4000);
    };

    return (
        <div className="glass-panel p-6 border-slate-700 bg-slate-900/50">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                <Coffee className="text-stadium-orange" aria-hidden="true" />
                <h2 className="text-xl font-bold text-white">Food Finder</h2>
            </div>
            
            <div className="flex bg-slate-800 rounded-lg p-1 mb-6 relative z-10 w-full overflow-hidden">
                <button 
                    onClick={() => setSearchMode('brand')}
                    className={util("flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded transition-colors relative z-10", searchMode === 'brand' ? 'text-stadium-dark shadow-md' : 'text-slate-400 hover:text-white')}
                    aria-label="Search by brand name"
                >
                    {searchMode === 'brand' && <div className="absolute inset-0 bg-stadium-orange rounded -z-10"></div>}
                    Search by Brand
                </button>
                <button 
                    onClick={() => setSearchMode('item')}
                    className={util("flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded transition-colors relative z-10", searchMode === 'item' ? 'text-stadium-dark shadow-md' : 'text-slate-400 hover:text-white')}
                    aria-label="Search by food item"
                >
                     {searchMode === 'item' && <div className="absolute inset-0 bg-stadium-orange rounded -z-10"></div>}
                    Search by Item
                </button>
            </div>

            <div className="space-y-4">
                {concessionsList[searchMode].map((stall, index) => (
                    <div key={index} className="bg-slate-800/60 hover:bg-slate-800 rounded-xl p-4 border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
                        <div>
                            <h3 className="font-bold text-white text-lg">{stall.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded font-medium">{stall.tag}</span>
                                <span className="text-slate-400 text-sm">| {stall.location}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleRoute(stall.name)}
                            className="bg-slate-700 hover:bg-stadium-orange hover:text-stadium-dark text-white rounded-lg p-2 transition-all shadow hover:shadow-[0_0_15px_#FF5C00] flex items-center justify-center shrink-0 w-full sm:w-auto"
                            aria-label={`Route to ${stall.name}`}
                        >
                            <Navigation size={20} className="sm:mr-0 shrink-0" aria-hidden="true" />
                            <span className="ml-2 font-bold uppercase tracking-wider text-sm sm:hidden">Route</span>
                        </button>
                    </div>
                ))}
            </div>

            {status && (
                <div role="status" aria-live="polite" className="mt-6 p-3 bg-green-500/10 border border-green-500 text-green-400 rounded-lg text-sm font-semibold flex items-start gap-2">
                    <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{status}</span>
                </div>
            )}
        </div>
    );
}
