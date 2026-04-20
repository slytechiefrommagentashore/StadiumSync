import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, PhoneCall, X, Send, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const util = (...inputs) => twMerge(clsx(inputs));

export default function EmergencyHub({ socket, ticketData, currentWaypoint }) {
    const [isOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState('Security');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');

    // Quick emergency numbers with dummy targets
    const contacts = [
        { name: "Police", number: "100" },
        { name: "Medical / Ambulance", number: "108" },
        { name: "Stadium Security Staff", number: "555-0199" }
    ];

    const handleSubmitIncident = (e) => {
        e.preventDefault();
        if (!description.trim() || !socket) return;

        socket.emit('incident_report', {
            category,
            description,
            ticketData,
            waypoint: currentWaypoint
        });

        setStatus('Report dispatched securely to Stadium Command.');
        setDescription('');
        
        setTimeout(() => setStatus(''), 4000);
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-stadium-red text-white flex items-center justify-center rounded-full shadow-[0_0_20px_#FF003C] hover:shadow-[0_0_30px_#FF003C] z-50 transition-transform hover:scale-105 active:scale-95 border-2 border-white/20"
                aria-label="Open Emergency SOS Hub"
            >
                <ShieldAlert size={28} aria-hidden="true" />
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-stadium-dark/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div 
                        role="dialog" 
                        aria-modal="true" 
                        aria-labelledby="sos-title"
                        className="bg-slate-900 border border-stadium-red max-w-lg w-full rounded-2xl p-6 relative shadow-[0_0_50px_rgba(255,0,60,0.3)] max-h-[90vh] overflow-y-auto"
                    >
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                            aria-label="Close Emergency Hub"
                        >
                            <X size={24} aria-hidden="true" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-stadium-red/20 flex items-center justify-center text-stadium-red animate-pulse">
                                <AlertCircle size={28} aria-hidden="true" />
                            </div>
                            <h2 id="sos-title" className="text-2xl font-bold text-white uppercase tracking-wider">Emergency SOS</h2>
                        </div>

                        {/* Quick Dial Matrix */}
                        <div className="space-y-3 mb-8">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Quick Dial Matrix</h3>
                            {contacts.map((contact, idx) => (
                                <a 
                                    key={idx}
                                    href={`tel:${contact.number.replace(/\D/g,'')}`}
                                    className="flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-colors group"
                                    aria-label={`Call ${contact.name}`}
                                >
                                    <span className="font-semibold text-white group-hover:text-stadium-cyan transition-colors">{contact.name}</span>
                                    <div className="flex items-center gap-2 text-stadium-cyan">
                                        <span className="font-mono text-sm">{contact.number}</span>
                                        <PhoneCall size={16} aria-hidden="true" />
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Suspicious Activity Form */}
                        <div className="pt-6 border-t border-slate-800">
                             <h3 className="text-xs font-bold text-stadium-cyan uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ShieldAlert size={14} aria-hidden="true" /> Report Suspicious Activity
                             </h3>
                             
                             <form onSubmit={handleSubmitIncident} className="flex flex-col gap-4">
                                 <div>
                                     <label htmlFor="category" className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Classification</label>
                                     <select 
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 text-white rounded p-3 text-sm focus:outline-none focus:border-stadium-cyan transition-colors font-semibold"
                                     >
                                         <option>Security</option>
                                         <option>Medical</option>
                                         <option>Maintenance</option>
                                     </select>
                                 </div>
                                 
                                 <div>
                                     <label htmlFor="description" className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Incident Details</label>
                                     <textarea 
                                        id="description"
                                        placeholder="Describe the situation..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 text-white rounded p-3 text-sm min-h-[100px] resize-none focus:outline-none focus:border-stadium-cyan transition-colors"
                                        required
                                     ></textarea>
                                 </div>

                                 <button 
                                    type="submit"
                                    disabled={!description.trim()}
                                    className="w-full bg-stadium-cyan hover:bg-[#00d0dd] disabled:opacity-50 disabled:hover:bg-stadium-cyan text-stadium-dark font-bold py-3 rounded uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2"
                                 >
                                    <Send size={18} aria-hidden="true" /> Submit Report to Command
                                 </button>
                             </form>

                             {status && (
                                <div role="status" aria-live="polite" className="mt-4 p-3 bg-green-500/10 border border-green-500 text-green-400 rounded-lg text-sm font-semibold flex items-start gap-2">
                                    <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                                    <span>{status}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
