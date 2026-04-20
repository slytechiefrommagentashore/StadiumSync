import React, { useState, useEffect } from 'react';
import { Users, LogOut, Radio, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const util = (...inputs) => twMerge(clsx(inputs));

export default function SquadSync({ socket }) {
    const [squadCode, setSquadCode] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [inSquad, setInSquad] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!socket) return;

        const onSquadNotification = (data) => {
            setMessages(prev => [...prev, { id: Date.now(), type: 'info', text: data.message, time: new Date().toLocaleTimeString() }]);
        };

        const onJoinedSquadSuccess = (data) => {
            setSquadCode(data.squadCode);
            setInSquad(true);
            setMessages(prev => [...prev, { id: Date.now(), type: 'success', text: `Successfully joined Squad ${data.squadCode}!`, time: new Date().toLocaleTimeString() }]);
        };

        const onSquadError = (data) => {
            setMessages(prev => [...prev, { id: Date.now(), type: 'error', text: data.message, time: new Date().toLocaleTimeString() }]);
        };

        const onRallyPingReceived = (data) => {
            setMessages(prev => [...prev, { id: Date.now(), type: 'ping', text: `🚨 RALLY PING at Waypoint ${data.waypoint} from user ${data.sender.substring(0,4)}!`, time: new Date(data.timestamp).toLocaleTimeString() }]);
        };

        socket.on('squad_notification', onSquadNotification);
        socket.on('joined_squad_success', onJoinedSquadSuccess);
        socket.on('squad_error', onSquadError);
        socket.on('rally_ping_received', onRallyPingReceived);

        return () => {
            socket.off('squad_notification', onSquadNotification);
            socket.off('joined_squad_success', onJoinedSquadSuccess);
            socket.off('squad_error', onSquadError);
            socket.off('rally_ping_received', onRallyPingReceived);
        };
    }, [socket]);

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleCreate = () => {
        const code = generateCode();
        socket.emit('join_squad', code);
    };

    const handleJoin = (e) => {
        e.preventDefault();
        const clean = inputCode.trim().toUpperCase();
        if (clean.length === 6) {
            socket.emit('join_squad', clean);
        } else {
            setMessages(prev => [...prev, { id: Date.now(), type: 'error', text: 'Squad code must be 6 characters.', time: new Date().toLocaleTimeString() }]);
        }
    };

    const handleLeave = () => {
        socket.emit('leave_squad', squadCode);
        setInSquad(false);
        setSquadCode('');
        setMessages([]);
    };

    const handleRallyPing = () => {
        // Hardcoded waypoint for MVP, normally this would come from a global state
        socket.emit('rally_ping', { squadCode, waypoint: 'P-12' });
        setMessages(prev => [...prev, { id: Date.now(), type: 'self-ping', text: `Broadcasted Rally Ping at P-12`, time: new Date().toLocaleTimeString() }]);
    };

    return (
        <div className="glass-panel p-6 border border-slate-700 relative overflow-hidden">
            {/* Ambient Background Glow for Squad panel */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-stadium-orange opacity-5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <Users className="text-stadium-orange" aria-hidden="true" />
                    <h2 className="text-xl font-bold text-white">Squad Sync</h2>
                </div>
                {inSquad && (
                    <div className="flex items-center gap-3">
                        <span className="font-mono bg-slate-800 text-stadium-cyan px-3 py-1 rounded text-sm tracking-widest border border-slate-600">
                            {squadCode}
                        </span>
                        <button 
                            onClick={handleLeave}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                            aria-label="Leave Squad"
                            title="Leave Squad"
                        >
                            <LogOut size={16} aria-hidden="true" />
                        </button>
                    </div>
                )}
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8">
                {!inSquad ? (
                    <div className="w-full flex flex-col md:flex-row gap-6">
                        <div className="flex-1 bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 flex flex-col justify-center items-center text-center">
                            <h3 className="text-lg font-semibold text-white mb-2">Create a Squad</h3>
                            <p className="text-slate-400 text-sm mb-6">Start a new lobby and share the 6-digit code with your friends.</p>
                            <button 
                                onClick={handleCreate}
                                className="w-full max-w-xs bg-stadium-cyan text-stadium-dark font-bold py-3 rounded-lg hover:bg-[#00d0dd] transition-colors shadow-neon-cyan"
                                aria-label="Create new squad"
                            >
                                Generate Code
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-center">
                            <span className="text-slate-500 font-bold uppercase text-sm">OR</span>
                        </div>

                        <div className="flex-1 bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 flex flex-col justify-center items-center text-center">
                            <h3 className="text-lg font-semibold text-white mb-2">Join a Squad</h3>
                            <p className="text-slate-400 text-sm mb-6">Enter a 6-digit alphanumeric code from a friend.</p>
                            <form onSubmit={handleJoin} className="w-full max-w-xs flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="XXXXXX" 
                                    className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg p-3 text-center uppercase tracking-[0.2em] font-mono focus:outline-none focus:ring-2 focus:ring-stadium-cyan"
                                    value={inputCode}
                                    onChange={(e) => setInputCode(e.target.value)}
                                    maxLength={6}
                                    aria-label="Squad Code Input"
                                />
                                <button 
                                    type="submit" 
                                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-4 rounded-lg transition-colors border border-slate-500"
                                    aria-label="Join squad"
                                >
                                    Join
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex justify-between gap-8 h-64">
                         {/* Massive Rally Ping Button */}
                         <div className="w-1/3 flex items-center justify-center border-r border-slate-700 pr-8">
                            <button 
                                onClick={handleRallyPing}
                                className="w-40 h-40 rounded-full bg-stadium-red border-4 border-stadium-red text-white flex flex-col items-center justify-center shadow-[0_0_30px_#FF003C] hover:shadow-[0_0_50px_#FF003C] transition-shadow relative group active:scale-95"
                                aria-label="Send Rally Ping"
                            >
                                <div className="absolute inset-0 rounded-full bg-stadium-red animate-ping opacity-20"></div>
                                <Radio size={40} className="mb-2" aria-hidden="true" />
                                <span className="font-bold text-lg tracking-wider uppercase">Rally Ping</span>
                            </button>
                        </div>

                        {/* Activity Log */}
                        <div className="w-2/3 flex flex-col">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Live Activity</h3>
                            <div className="flex-1 bg-slate-900/80 rounded-lg border border-slate-700 p-4 overflow-y-auto font-mono text-sm space-y-3 flex flex-col-reverse" aria-live="polite">
                                {messages.slice().reverse().map((msg) => (
                                    <div key={msg.id} className={util(
                                        'px-3 py-2 rounded flex items-start gap-2',
                                        msg.type === 'info' && 'text-slate-300',
                                        msg.type === 'success' && 'text-green-400 bg-green-500/10',
                                        msg.type === 'error' && 'text-red-400 bg-red-500/10',
                                        msg.type === 'ping' && 'text-stadium-red bg-stadium-red/20 border border-stadium-red/50 font-bold',
                                        msg.type === 'self-ping' && 'text-stadium-orange bg-stadium-orange/10'
                                    )}>
                                        <span className="text-slate-500 whitespace-nowrap">[{msg.time}]</span>
                                        {msg.type === 'ping' && <AlertCircle size={16} className="mt-0.5" aria-hidden="true" />}
                                        <span>{msg.text}</span>
                                    </div>
                                ))}
                                {messages.length === 0 && (
                                    <p className="text-slate-500 italic text-center my-auto">No recent activity.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
