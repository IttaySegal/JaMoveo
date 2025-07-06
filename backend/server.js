const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Store current song state
let currentSong = null;

// Track connected clients
const connectedClients = new Map();

io.on('connection', (socket) => {
  try {
    console.log('Client connected:', socket.id);

    // Store client info
    connectedClients.set(socket.id, {
      id: socket.id,
      role: null,
      lastActivity: Date.now()
    });

    // Send current song if exists
    socket.on('getCurrentSong', () => {
      try {
        if (currentSong) {
          socket.emit('newSongSelected', currentSong);
        }
      } catch (error) {
        console.error('Error sending current song:', error);
        socket.emit('error', { message: 'Failed to get current song' });
      }
    });

    // Handle song selection
    socket.on('selectSong', (song) => {
      try {
        console.log('Song selected:', song.name);
        currentSong = song;
        io.emit('newSongSelected', song);
      } catch (error) {
        console.error('Error selecting song:', error);
        socket.emit('error', { message: 'Failed to select song' });
      }
    });

    // Handle session quit
    socket.on('quitSession', () => {
      try {
        console.log('Session ended by admin');
        currentSong = null;
        io.emit('quitSession');
      } catch (error) {
        console.error('Error quitting session:', error);
        socket.emit('error', { message: 'Failed to quit session' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      try {
        console.log('Client disconnected:', socket.id);
        connectedClients.delete(socket.id);
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });

  } catch (error) {
    console.error('Error in socket connection:', error);
    socket.emit('error', { message: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    connections: connectedClients.size,
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
