import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Initializing the socket connection outside the component
const socket = io();

export const useSocket = () => {
    const [densityData, setDensityData] = useState({ gates: [], concessions: [] });
    // Keep connection robust over component lifecycles

    useEffect(() => {
        socket.on('density_update', (data) => {
            setDensityData(data);
        });

        return () => {
            socket.off('density_update');
        };
    }, []);

    return { socket, densityData };
};
