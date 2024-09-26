const express = require('express'); 
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer'); // Import multer

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Serve static files
app.use(express.static('public')); 

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for incoming messages
  socket.on('send_message', (message) => {
    const timestamp = new Date().toLocaleTimeString(); // Get the current time
    io.emit('receive_message', { message, timestamp }); // Broadcast message and timestamp to all clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Authentication routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
  res.send({ filePath: `uploads/${req.file.filename}` }); // Respond with file path
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

