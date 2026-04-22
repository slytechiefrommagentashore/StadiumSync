import React, { useState, useRef } from 'react';
import { Upload, Camera, Loader2, CheckCircle2 } from 'lucide-react';

export default function TicketOnboarding({ onTicketParsed }) {
    const [file, setFile] = useState(null);
    const [isParsing, setIsParsing] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleScan = async () => {
        if (!file) return;
        setIsParsing(true);
        
        try {
            const formData = new FormData();
            formData.append('ticketImage', file);

            const response = await fetch('/api/scan-ticket', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to parse ticket');

            const data = await response.json();
            if (preview) URL.revokeObjectURL(preview); // Free memory
            
            onTicketParsed(data);
        } catch (error) {
            console.error(error);
            setIsParsing(false);
            alert("Error scanning ticket. Please make sure the backend server is running.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-panel p-8 max-w-md w-full flex flex-col items-center border border-stadium-cyan text-center relative overflow-hidden bg-slate-900 shadow-neon-cyan">
                <div className="absolute top-0 w-full h-1 bg-stadium-cyan shadow-[0_0_15px_#00F0FF]"></div>
                
                <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">StadiumSync</h2>
                <p className="text-slate-400 text-sm mb-8">
                    Scan your event ticket to calibrate your personalized logistics dashboard.
                </p>

                <div 
                    className="w-full h-48 border-2 border-dashed border-slate-600 rounded-xl mb-6 flex flex-col items-center justify-center bg-slate-900/50 hover:bg-slate-800/80 transition-colors cursor-pointer relative"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload ticket image box"
                >
                    {preview ? (
                        <img src={preview} alt="Event Ticket Preview" className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-50" />
                    ) : (
                        <>
                            <Upload className="text-slate-400 mb-3" size={32} aria-hidden="true" />
                            <span className="text-slate-300 font-medium tracking-wide">Capture or Upload Ticket</span>
                        </>
                    )}
                    <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileChange} 
                        aria-label="Hidden file input"
                    />
                </div>

                <div className="w-full bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-left mb-6 flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-slate-400">
                        <strong className="text-slate-200 uppercase tracking-widest block mb-1">Zero-Retention Privacy</strong> 
                        Your image is processed entirely within an ephemeral memory buffer and is immediately discarded instantly.
                    </p>
                </div>

                <button 
                    onClick={handleScan}
                    disabled={!file || isParsing}
                    className="w-full bg-stadium-cyan hover:bg-[#00d0dd] disabled:opacity-50 disabled:hover:bg-stadium-cyan text-stadium-dark font-bold py-3 rounded-lg shadow-neon-cyan transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-widest"
                    aria-label={isParsing ? "Scanning ticket image" : "Analyze Ticket and Sync to Engine"}
                >
                    {isParsing ? (
                        <>
                            <Loader2 className="animate-spin" size={20} aria-hidden="true" />
                            Parsing Ticket...
                        </>
                    ) : (
                        <>
                            <Camera size={20} aria-hidden="true" />
                            Analyze & Sync
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
