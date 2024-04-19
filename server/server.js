const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Server } = require('ws'); // Import WebSocket Server from 'ws'
const authenticateToken = require('./authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (assuming you have already configured this part)
mongoose.connect('mongodb://localhost:27017/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a WebSocket server
const wss = new Server({ noServer: true });

// WebSocket server event handlers
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    // Handle signaling messages received from clients
    // You need to implement this part to handle signaling logic
    console.log('Received message:', message);

    // Broadcast the message to all connected clients (excluding the sender)
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Attach WebSocket server to the Express.js server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Upgrade HTTP server to support WebSocket
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Define your routes and other middleware here
app.get('/test', authenticateToken, (req, res) => {
  res.send('This is a protected test endpoint!');
});

// Handle other routes and middleware as needed
