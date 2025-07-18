const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const allowedOrigins = [
    'https://trolley-five.vercel.app',
    'http://localhost:5173' 
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions));

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const addressRoutes = require('./src/routes/addressRoutes');
const cardRoutes = require('./src/routes/cardRoutes'); 
const storeRoutes = require('./src/routes/storeRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const messageModel = require('./src/models/messageModel');

app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);

app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('API E-commerce Trolley Siap Digunakan!');
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log(`Pengguna Terhubung: ${socket.id}`);
    socket.on('add_user', (userId) => {
        onlineUsers.set(userId.toString(), socket.id);
        console.log(`User ${userId} online dengan socket ID ${socket.id}`);
    });
    socket.on('join_room', (conversationId) => {
        socket.join(conversationId);
        console.log(`Pengguna ${socket.id} bergabung ke room: ${conversationId}`);
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

server.listen(PORT, () => {
  console.log(`Server dan Socket.IO berjalan di http://localhost:${PORT}`);
});
