const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { Server } = require('socket.io');
const http = require('http');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins with their ID
  socket.on('user_connected', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('user_status', { userId, status: 'online' });
    console.log(`User ${userId} is online`);
  });

  // Send message
  socket.on('send_message', async (data) => {
    const { receiverId, message } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', message);
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { receiverId, isTyping, senderName } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', { isTyping, senderName });
    }
  });

  // Mark message as read
  socket.on('message_read', (data) => {
    const { senderId, messageId } = data;
    const senderSocketId = onlineUsers.get(senderId);
    
    if (senderSocketId) {
      io.to(senderSocketId).emit('message_read_receipt', { messageId });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    let disconnectedUserId = null;
    
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
        break;
      }
    }
    
    if (disconnectedUserId) {
      io.emit('user_status', { userId: disconnectedUserId, status: 'offline' });
      console.log(`User ${disconnectedUserId} disconnected`);
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});