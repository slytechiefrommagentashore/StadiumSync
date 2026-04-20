import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const util = (...inputs) => twMerge(clsx(inputs));

export default function AdminCommandCenter({ socket, densityData }) {
    const [pin, setPin] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        if (!socket || !isAuthenticated) return;
        
        const handleNewIncident = (data) => {
            setIncidents(prev => [data, ...prev]);
        };

        socket.on('new_incident_report', handleNewIncident);
        return () => socket.off('new_incident_report', handleNewIncident);
    }, [socket, isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (pin === '1234') {
            setIsAuthenticated(true);
            socket.emit('join_admin_room', '1234');
        } else {
            alert('Invalid Authorization Code');
            setPin('');
        }
    };

    const handleEvacuate = () => {
        if (window.confirm("CRITICAL WARNING: Are you sure you want to trigger a global stadium evacuation?")) {
            socket.emit('admin_evacuate');
        }
    };

    const handleAcknowledge = (id, e) => {
        const tr = e.target.closest('tr');
        if (tr) tr.style.opacity = '0.5';
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 p-4 flex items-center justify-center font-mono">
                <form onSubmit={handleLogin} className="bg-slate-900 border border-stadium-red p-8 rounded-xl max-w-sm w-full text-center shadow-[0_0_30px_rgba(255,0,60,0.2)]">
                    <ShieldAlert className="text-stadium-red w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest">Admin Control</h2>
                    <input 
                        type="password" 
                        placeholder="ENTER PIN" 
                        className="w-full bg-slate-950 border border-slate-700 text-stadium-cyan p-3 rounded-lg text-center tracking-[0.5em] text-xl mb-6 focus:outline-none focus:border-stadium-red shadow-inner"
                        value={pin}
                        onChange={e => setPin(e.target.value)}
                        aria-label="Admin PIN Input"
                    />
                    <button type="submit" className="w-full bg-stadium-red hover:bg-red-700 text-white font-bold py-3 rounded uppercase tracking-wider transition-colors shadow-lg">
                        Authenticate
                    </button>
                    <p className="mt-4 text-xs text-slate-500 tracking-widest uppercase">Use PIN: 1234 for MVP Demonstration</p>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 p-4 md:p-8 font-mono overflow-y-auto">
            <header className="flex justify-between items-center border-b border-slate-800 pb-6 mb-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <Shield className="text-stadium-red w-8 h-8" aria-hidden="true" />
                    <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Command Center</h1>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-green-500 text-sm tracking-widest uppercase hidden sm:block">Secure Uplink Active</span>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Left/Middle Column: Incident Feed */}
                <section className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-white mb-4 uppercase flex items-center gap-2">
                        <AlertTriangle size={20} className="text-stadium-orange" aria-hidden="true" /> Live Incident Feed
                    </h2>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg min-h-[400px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-950 border-b border-slate-800 text-xs uppercase tracking-widest text-slate-500">
                                    <th className="p-4">Time</th>
                                    <th className="p-4">Location Context</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incidents.map((inc, i) => (
                                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800 transition-colors">
                                        <td className="p-4 text-xs whitespace-nowrap">{new Date(inc.timestamp).toLocaleTimeString()}</td>
                                        <td className="p-4 text-xs whitespace-nowrap text-stadium-cyan font-bold leading-relaxed">
                                            {inc.ticketData.stand} • {inc.ticketData.assigned_gate} <br/>
                                            <span className="text-slate-400 font-normal">Waypoint: {inc.waypoint || 'Not Synced'}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={util("px-2 py-1 text-xs rounded uppercase font-bold text-center inline-block min-w-[80px]", 
                                                inc.category === 'Medical' && 'bg-blue-500/20 text-blue-400',
                                                inc.category === 'Security' && 'bg-stadium-red/20 text-stadium-red',
                                                inc.category === 'Maintenance' && 'bg-yellow-500/20 text-yellow-500'
                                            )}>
                                                {inc.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm max-w-xs">{inc.description}</td>
                                        <td className="p-4">
                                            <button 
                                                onClick={(e) => handleAcknowledge(i, e)}
                                                className="bg-slate-700 hover:bg-green-600 focus:bg-green-600 text-white px-3 py-1 rounded text-xs uppercase transition-colors flex flex-shrink-0 items-center justify-center font-bold"
                                                aria-label="Acknowledge Report"
                                            >
                                                ACK
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {incidents.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-500 italic">No incoming reports. Perimeter secure.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Right Column: Controls */}
                <section className="flex flex-col gap-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Master Override</h2>
                        <button 
                            onClick={handleEvacuate}
                            className="w-full h-32 bg-stadium-red hover:bg-[#b30029] text-white border-4 border-[#80001d] rounded-xl font-bold text-xl uppercase tracking-widest transition-transform active:scale-95 shadow-[0_0_50px_rgba(255,0,60,0.4)] flex flex-col items-center justify-center gap-2 group"
                            aria-label="Trigger Global Stadium Evacuation"
                        >
                            <AlertTriangle size={32} className="group-hover:animate-ping" aria-hidden="true" />
                            Trigger Evacuation
                        </button>
                        <p className="text-red-400/50 uppercase text-xs text-center mt-3 tracking-wider">Requires Confirmation Dialog</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex-1">
                         <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Live Density Nodes</h2>
                         <div className="flex flex-col gap-3">
                             {(densityData?.gates || []).map((g, i) => (
                                 <div key={i} className="flex justify-between items-center text-sm border-b border-slate-800/30 pb-2">
                                    <span className="text-slate-400 font-bold">{g.id}</span>
                                    <span className={util("font-bold px-2 py-0.5 rounded", g.density > 80 ? "bg-stadium-red/20 text-stadium-red" : g.density > 50 ? "bg-yellow-500/20 text-yellow-500" : "bg-green-500/20 text-green-500")}>{g.density}%</span>
                                 </div>
                             ))}
                         </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
