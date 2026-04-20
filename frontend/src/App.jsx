import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HeatmapDashboard from './components/HeatmapDashboard';
import SmartRouting from './components/SmartRouting';
import DigitalWaypoints from './components/DigitalWaypoints';
import SquadSync from './components/SquadSync';
import TicketOnboarding from './components/TicketOnboarding';
import EmergencyHub from './components/EmergencyHub';
import AdminCommandCenter from './components/AdminCommandCenter';
import Concessions from './components/Concessions';
import { useSocket } from './hooks/useSocket';
import { MapPin, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const util = (...inputs) => twMerge(clsx(inputs));

function App() {
  const { socket, densityData } = useSocket();
  const [ticketData, setTicketData] = useState(null);
  const [evacuationMode, setEvacuationMode] = useState(false);
  const [currentWaypoint, setCurrentWaypoint] = useState(null);

  // Global socket listener for Admin Evacuation signals
  useEffect(() => {
    if (!socket) return;
    
    const handleEvacuate = (data) => {
      if (data.critical) setEvacuationMode(true);
    };

    socket.on('EVACUATION_SIGNAL', handleEvacuate);
    return () => socket.off('EVACUATION_SIGNAL', handleEvacuate);
  }, [socket]);

  return (
    <Routes>
       <Route path="/admin" element={<AdminCommandCenter socket={socket} densityData={densityData} />} />
       <Route path="*" element={
          <FanExperience 
             socket={socket} 
             densityData={densityData} 
             ticketData={ticketData} 
             setTicketData={setTicketData}
             evacuationMode={evacuationMode}
             currentWaypoint={currentWaypoint}
             setCurrentWaypoint={setCurrentWaypoint}
          />
       } />
    </Routes>
  );
}

function FanExperience({ socket, densityData, ticketData, setTicketData, evacuationMode, currentWaypoint, setCurrentWaypoint }) {
  if (!ticketData) {
      return <TicketOnboarding onTicketParsed={(data) => setTicketData(data)} />;
  }

  return (
    <div className={util(
        "min-h-screen p-4 md:p-8 flex flex-col items-center transition-colors duration-500",
        evacuationMode ? "bg-red-950/40" : ""
    )}>
      <header className="w-full max-w-5xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className={util("w-8 h-8", evacuationMode ? "text-stadium-red drop-shadow-[0_0_10px_#FF003C]" : "text-stadium-cyan drop-shadow-[0_0_10px_#00F0FF]")} aria-hidden="true" />
          <h1 className={util("text-3xl font-bold tracking-tight text-white", evacuationMode ? "drop-shadow-[0_0_10px_#FF003C]" : "drop-shadow-[0_0_10px_#00F0FF]")}>
              StadiumSync
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium uppercase tracking-widest">
            {evacuationMode ? (
                <span className="text-stadium-red animate-pulse flex items-center gap-2 font-bold">
                    <AlertTriangle size={18} aria-hidden="true" /> EVACUATION ACTIVE
                </span>
            ) : (
                <span className="text-stadium-cyan hidden sm:block">Logistics Engine Active</span>
            )}
            <span className="bg-slate-800 text-slate-300 px-4 py-1.5 rounded-full border border-slate-700 shadow-inner">
                {ticketData.stand} &bull; <strong className="text-white">{ticketData.assigned_gate}</strong>
            </span>
        </div>
      </header>
      
      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 relative z-10">
        <section aria-label="Live Density Heatmap">
          <HeatmapDashboard densityData={densityData} ticketData={ticketData} />
        </section>
        
        <div className="flex flex-col gap-6 md:gap-8">
          <section aria-label="Smart Routing">
            <SmartRouting ticketData={ticketData} evacuationMode={evacuationMode} />
          </section>
          
          <section aria-label="Digital Waypoints">
            <DigitalWaypoints socket={socket} onLocate={setCurrentWaypoint} />
          </section>
        </div>
        
        <section aria-label="Food Finder" className="lg:col-span-1">
          <Concessions currentWaypoint={currentWaypoint} />
        </section>

        <section aria-label="Squad Sync" className="lg:col-span-1">
          {/* Passed currentWaypoint down so it can be used for rally pings in the future */}
          <SquadSync socket={socket} />
        </section>
      </main>

      {/* SOS HUB modified to handle ticketData and Waypoints */}
      <EmergencyHub 
          socket={socket}
          ticketData={ticketData}
          currentWaypoint={currentWaypoint} 
      />
    </div>
  );
}

export default App;
