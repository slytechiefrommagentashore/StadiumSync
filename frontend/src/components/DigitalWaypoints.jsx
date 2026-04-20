import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';

export default function DigitalWaypoints({ socket, onLocate }) {
    const [pillarCode, setPillarCode] = useState('');
    const [status, setStatus] = useState('');

    const handleLocate = (e) => {
        e.preventDefault();
        if (!pillarCode.trim()) return;
        
        if (onLocate) onLocate(pillarCode.toUpperCase());
        
        // Mocking a backend update
        setStatus(`Location set to ${pillarCode.toUpperCase()}!`);
        // Maybe emit to socket if we wanted to
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <div className="glass-panel p-6 h-full border border-slate-700 bg-slate-900/50">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                <MapPin className="text-stadium-cyan" aria-hidden="true" />
                <h2 className="text-xl font-bold text-white">Digital Waypoint</h2>
            </div>
            
            <p className="text-slate-400 text-sm mb-4">
                Find the nearest Pillar Code (e.g. <strong className="text-white">P-12</strong>) and enter it to sync your location without GPS.
            </p>

            <form onSubmit={handleLocate} className="flex gap-3">
                <input 
                    type="text" 
                    placeholder="Pillar Code" 
                    className="flex-1 bg-slate-800/80 border border-slate-600 text-white placeholder-slate-500 rounded-lg p-3 uppercase focus:outline-none focus:ring-2 focus:ring-stadium-cyan transition-shadow font-mono text-lg tracking-widest"
                    value={pillarCode}
                    onChange={(e) => setPillarCode(e.target.value)}
                    aria-label="Input Pillar Code"
                    required
                />
                <button 
                    type="submit" 
                    className="bg-stadium-cyan hover:bg-[#00d0dd] text-stadium-dark font-bold px-6 rounded-lg transition-colors shadow-neon-cyan flex items-center justify-center"
                    aria-label="Locate me using pillar code"
                >
                    <Search size={20} aria-hidden="true" />
                    <span className="sr-only">Locate</span>
                </button>
            </form>

            {status && (
                <div role="status" className="mt-4 p-3 bg-green-500/20 border border-green-500 text-green-400 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <MapPin size={16} aria-hidden="true" />
                    {status}
                </div>
            )}
        </div>
    );
}
