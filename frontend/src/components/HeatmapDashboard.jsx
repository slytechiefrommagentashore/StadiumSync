import React from 'react';
import { Activity } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper to merge Tailwind classes safely
const util = (...inputs) => twMerge(clsx(inputs));

export default function HeatmapDashboard({ densityData, ticketData }) {
    const { gates = [], concessions = [] } = densityData || {};
    const assignedGateway = ticketData ? ticketData.assigned_gate : null;

    const getDensityColor = (density, isGrayedOut = false) => {
        if (isGrayedOut) return 'bg-slate-800/30 border-slate-800 text-slate-600 opacity-50 grayscale pointer-events-none shadow-none';
        
        if (typeof density !== 'number') return 'bg-slate-700 shadow-none border-slate-600 text-slate-300';
        if (density > 80) return 'bg-stadium-red/20 shadow-[0_0_10px_#FF003C] border-stadium-red text-stadium-red';
        if (density >= 50) return 'bg-yellow-500/20 shadow-[0_0_10px_#EAB308] border-yellow-500 text-yellow-500';
        return 'bg-green-500/20 shadow-[0_0_10px_#22C55E] border-green-500 text-green-400';
    };

    const AreaBox = ({ item, isGate }) => {
        const isGrayedOut = isGate && assignedGateway && assignedGateway !== item.id;
        
        return (
             <div 
                className={util(
                    'p-4 rounded-lg flex flex-col justify-between items-center transition-all duration-500 border-2',
                    getDensityColor(item.density, isGrayedOut)
                )}
                role="status"
                aria-label={`${item.id} is at ${item.density || 0} percent capacity`}
            >
                <span className="font-semibold text-sm tracking-wide text-white">{item.id}</span>
                <span className="text-2xl font-bold mt-2">{item.density ?? '--'}%</span>
                {isGrayedOut && <span className="text-[10px] uppercase font-bold tracking-widest mt-1 text-slate-500">Restricted</span>}
            </div>
        );
    };


    return (
        <div className="glass-panel p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Activity className="text-stadium-cyan" aria-hidden="true" /> 
                    Live Heatmap
                </h2>
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Live Data
                </span>
            </div>

            <div className="flex-1 flex flex-col gap-6">
                <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-widest">Entry Gates</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {gates.map((g, i) => <AreaBox key={`gate-${i}`} item={g} isGate={true} />)}
                        {gates.length === 0 && <p className="text-slate-500 text-sm">Waiting for data...</p>}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-widest">Concessions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {concessions.map((c, i) => <AreaBox key={`concessions-${i}`} item={c} isGate={false} />)}
                        {concessions.length === 0 && <p className="text-slate-500 text-sm">Waiting for data...</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
