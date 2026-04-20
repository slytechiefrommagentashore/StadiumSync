import React from 'react';
import { Route, Clock, Zap, Map as MapIcon, AlertTriangle } from 'lucide-react';

export default function SmartRouting({ ticketData, evacuationMode }) {
    const assignedGateway = ticketData ? ticketData.assigned_gate : 'Gate 3';

    if (evacuationMode) {
        return (
            <div className="glass-panel p-6 border-stadium-red bg-red-900/20 shadow-[0_0_30px_rgba(255,0,60,0.2)]" aria-live="assertive">
                <div className="flex items-center gap-2 mb-4 border-b border-stadium-red/50 pb-4">
                    <AlertTriangle className="text-stadium-red animate-pulse" size={28} aria-hidden="true" />
                    <h2 className="text-2xl font-bold text-stadium-red uppercase tracking-widest">Evacuation Mode</h2>
                </div>
                
                <p className="text-white font-medium mb-6">
                    OVERRIDE ACTIVE. Standard routing to <span className="line-through text-slate-400">{assignedGateway}</span> is suspended.
                </p>

                <div className="bg-stadium-red/10 border-2 border-stadium-red rounded-lg p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-stadium-red opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className="font-bold text-xl text-white flex items-center gap-2">
                            <Route className="text-white" size={24} aria-hidden="true" />
                            NEAREST EMERGENCY EXIT
                        </span>
                        <span className="flex items-center text-white font-bold gap-1 bg-stadium-red px-3 py-1 rounded-full text-sm">
                            <Clock size={16} aria-hidden="true" /> 2 min sprint
                        </span>
                    </div>
                    <p className="text-red-200 mt-2 relative z-10 font-semibold tracking-wide">
                        Follow the pulsing red floor lights immediately. Do not wait for others.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                <div className="flex items-center gap-2">
                    <Route className="text-stadium-cyan" aria-hidden="true" />
                    <h2 className="text-xl font-bold text-white">Restricted Routing</h2>
                </div>
            </div>
            
            <div className="mb-6 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                <span className="block text-xs font-bold text-stadium-cyan uppercase tracking-widest mb-1">
                    Valid Ticket Restriction
                </span>
                <p className="text-white font-medium flex items-center gap-2">
                    Routing strictly locked to: <span className="text-xl font-bold text-stadium-cyan tracking-wider">{assignedGateway}</span>
                </p>
            </div>

            <div className="space-y-4">
                {/* Option A: Shortest Route */}
                <button 
                    className="w-full text-left bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg p-4 transition-colors group relative overflow-hidden"
                    aria-label="Select Main Concourse Route, High Crowd, 15 minute wait"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-500"></div>
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-lg text-white">Main Concourse Route</span>
                        <span className="flex items-center text-slate-400 text-sm gap-1 group-hover:text-white transition-colors">
                            <Clock size={16} aria-hidden="true" /> 15 min wait
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-stadium-red text-sm font-medium mb-1">
                        <ActivityIcon size={14}/> High Crowd Congestion
                    </div>
                    <p className="text-slate-400 text-sm">Follow standard signage for {assignedGateway}.</p>
                </button>

                {/* Option B: Smart Bypass Route */}
                <button 
                    className="w-full text-left bg-stadium-cyan/10 hover:bg-stadium-cyan/20 border border-stadium-cyan/50 hover:border-stadium-cyan rounded-lg p-4 relative overflow-hidden transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] group"
                    aria-label="Select Smart Bypass Route, 5 minute walk, 2 minute wait, Earn 10% Discount Code"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-stadium-cyan shadow-[0_0_10px_#00F0FF]"></div>
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-lg text-white flex items-center gap-2">
                            <Zap className="text-stadium-cyan" size={18} fill="currentColor" aria-hidden="true" />
                            Smart Bypass Route
                        </span>
                        <span className="flex items-center text-stadium-cyan text-sm gap-1 font-bold">
                            <Clock size={16} aria-hidden="true" /> 5 min walk &bull; 2 min wait
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-2">
                        <MapIcon size={14}/> Low Crowd (Via Upper Deck)
                    </div>
                    <div className="inline-block bg-stadium-cyan/20 text-stadium-cyan text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-stadium-cyan/30 mt-1">
                        + Earn 10% Discount Code
                    </div>
                </button>
            </div>
        </div>
    );
}

function ActivityIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} aria-hidden="true">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
