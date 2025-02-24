require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://192.168.1.174:3000',
    process.env.CLIENT_URL
  ].filter(Boolean), 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('P2P Chat API Running');
});

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://192.168.1.174:3000',
      process.env.CLIENT_URL
    ].filter(Boolean),
    methods: ["GET", "POST"],
    credentials: true
  }
});

require('./socket')(io);

const PORT = process.env.PORT || 5003; 
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});