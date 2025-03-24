const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const noteRoutes = require("./routes/noteRoutes");

// Load environment variables
dotenv.config();


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/notes", noteRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Socket.io connection handling
const activeRooms = {};

io.on("connection", (socket) => {
    console.log("New client connected");

    // Handle joining a room
    socket.on("join-room", ({ roomId, username }) => {
        socket.join(roomId);

        // Initialize room if it doesn't exist
        if (!activeRooms[roomId]) {
            activeRooms[roomId] = { users: [] };
        }

        // Add user to room
        activeRooms[roomId].users.push({ id: socket.id, username });

        // Notify room about new user
        io.to(roomId).emit("user-joined", {
            message: `${username} joined the room`,
            users: activeRooms[roomId].users,
        });

        console.log(`${username} joined room ${roomId}`);
    });

    // Handle note changes
    socket.on("note-change", ({ roomId, content }) => {
        // Broadcast changes to all clients in the room except sender
        socket.to(roomId).emit("note-updated", { content });
    });

    // Handle cursor position updates
    socket.on("cursor-position", ({ roomId, username, position }) => {
        socket.to(roomId).emit("cursor-moved", { username, position });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("Client disconnected");

        // Remove user from all rooms they were in
        for (const roomId in activeRooms) {
            const room = activeRooms[roomId];
            const userIndex = room.users.findIndex(
                (user) => user.id === socket.id
            );

            if (userIndex !== -1) {
                const username = room.users[userIndex].username;
                room.users.splice(userIndex, 1);

                // Notify room about user leaving
                io.to(roomId).emit("user-left", {
                    message: `${username} left the room`,
                    users: room.users,
                });

                // Clean up empty rooms
                if (room.users.length === 0) {
                    delete activeRooms[roomId];
                }
            }
        }
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
