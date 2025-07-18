const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const messageModel = require('./src/models/messageModel');

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "https://trolley-five.vercel.app",
        methods: ["GET", "POST"]
    }
});

// Middleware lain
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// --- Rute API ---
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const addressRoutes = require('./src/routes/addressRoutes');
const cardRoutes = require('./src/routes/cardRoutes'); 
const storeRoutes = require('./src/routes/storeRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const chatRoutes = require('./src/routes/chatRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/chat', chatRoutes);

// Rute dasar
app.get('/', (req, res) => {
  res.send('API E-commerce Trolley Siap Digunakan!');
});

// --- Logika Socket.IO ---
const onlineUsers = new Map();
io.on("connection", (socket) => {
    console.log(`Pengguna Terhubung: ${socket.id}`);

    socket.on('add_user', (userId) => {
        onlineUsers.set(userId.toString(), socket.id);
    });

    socket.on('join_room', (conversationId) => {
        socket.join(conversationId);
    });

    socket.on('send_message', async (data) => {
        try {
            const newMessage = await messageModel.create(data);
            io.to(data.conversation_id).emit('receive_message', newMessage);
            const receiverSocketId = onlineUsers.get(data.receiver_id.toString());
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('new_message_notification');
            }
        } catch (error) {
            console.error("Gagal menyimpan atau mengirim pesan:", error);
        }
    });

    socket.on("disconnect", () => {
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        console.log(`Pengguna Terputus: ${socket.id}`);
    });
});

// Jalankan Server
server.listen(PORT, () => {
  console.log(`Server dan Socket.IO berjalan di http://localhost:${PORT}`);
});
