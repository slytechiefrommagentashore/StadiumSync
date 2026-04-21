const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss');
const multer = require('multer');
const path = require('path');

// Configure Multer for zero-retention in-memory buffering
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(helmet());
app.use(cors());
app.use(express.json());

// Default route for health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Ticket Parsing Onboarding (Zero-Retention)
app.post('/api/scan-ticket', upload.single('ticketImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded.' });
    }
    
    console.log(`[Zero-Retention] Processed ticket image buffer of size: ${req.file.size} bytes`);
    
    // Placeholder for Google Gemini Vision API
    // Ensure image buffer is allowed to be garbage collected natively by V8
    
    setTimeout(() => {
        res.json({
            stadium: "Wankhede, India",
            assigned_gate: "Gate 4",
            stand: "North Pavilion"
        });
    }, 1500); // simulate API verification delay
});

// Mock Data Generator for Heatmap Dashboard
const generateDensityData = () => {
    return {
        gates: [
            { id: 'Gate 1', density: Math.floor(Math.random() * 100) },
            { id: 'Gate 2', density: Math.floor(Math.random() * 100) },
            { id: 'Gate 3', density: Math.floor(Math.random() * 100) },
            { id: 'Gate 4', density: Math.floor(Math.random() * 100) }
        ],
        concessions: [
            { id: 'Food Court A', density: Math.floor(Math.random() * 100) },
            { id: 'Drinks B', density: Math.floor(Math.random() * 100) },
            { id: 'Merch C', density: Math.floor(Math.random() * 100) },
            { id: 'Snacks D', density: Math.floor(Math.random() * 100) }
        ],
        timestamp: new Date().toISOString()
    };
};

// Start broadcasting when a client connects, or maybe just broadcast universally.
setInterval(() => {
    io.emit('density_update', generateDensityData());
}, 5000);

// Socket.io connection logic for Squad Sync
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // Immediate data sent on first connection
    socket.emit('density_update', generateDensityData());

    socket.on('join_squad', (squadCode) => {
        const cleanCode = xss(typeof squadCode === 'string' ? squadCode : '');
        if (cleanCode && cleanCode.length === 6) {
            socket.join(cleanCode);
            console.log(`Socket ${socket.id} joined squad ${cleanCode}`);
            // Emit confirmation specifically to the joining socket so UI can update
            socket.emit('joined_squad_success', { squadCode: cleanCode });
            
            // Broadcast specifically to other members in the room 
            socket.to(cleanCode).emit('squad_notification', { message: 'A new user joined the squad!', id: socket.id });
        } else {
            socket.emit('squad_error', { message: 'Invalid squad code format' });
        }
    });

    socket.on('rally_ping', (data) => {
        // payload should contain { squadCode: '1A2B3C', waypoint: 'P-12' }
        if (data && data.squadCode && data.waypoint) {
            const cleanSquadCode = xss(data.squadCode);
            const cleanWaypoint = xss(data.waypoint);
            
            console.log(`Rally Ping from ${socket.id} in squad ${cleanSquadCode} at ${cleanWaypoint}`);
            
            // Broadcast strictly to others in the same room
            socket.to(cleanSquadCode).emit('rally_ping_received', {
                sender: socket.id,
                waypoint: cleanWaypoint,
                timestamp: new Date().toISOString()
            });
        }
    });

    socket.on('leave_squad', (squadCode) => {
        const cleanCode = xss(squadCode);
        socket.leave(cleanCode);
        console.log(`Socket ${socket.id} left squad ${cleanCode}`);
        socket.to(cleanCode).emit('squad_notification', { message: 'A user left the squad.', id: socket.id });
    });

    // ADMIN & FAN INCIDENT FLOW
    socket.on('join_admin_room', (adminPin) => {
        // Mock authorization: PIN is 1234
        if (adminPin === "1234") {
            socket.join('admin_room');
            console.log(`Socket ${socket.id} securely joined admin_room`);
        }
    });

    socket.on('incident_report', (payload) => {
        // Payload from fan containing category, description, ticketData, waypoint
        console.log(`Incident reported: ${payload.category} at ${payload.waypoint || 'Unknown Waypoint'}`);
        // Relay strictly to admins
        io.to('admin_room').emit('new_incident_report', {
            ...payload,
            timestamp: new Date().toISOString(),
            reporterId: socket.id
        });
    });

    socket.on('admin_evacuate', () => {
        console.log(`ADMINISTRATIVE EVACUATION TRIGGERED BY ${socket.id}!`);
        // Broadcast to universally ALL connected clients
        io.emit('EVACUATION_SIGNAL', { critical: true });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Serve frontend static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to serve React Router history paths
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`StadiumSync Backend Server running on port ${PORT}`);
});
