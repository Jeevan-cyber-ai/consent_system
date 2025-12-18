const jwt = require('jsonwebtoken');

let io;

const initSocket = (server) => {
    const { Server } = require('socket.io');
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    // Authenticate sockets using token supplied in handshake auth
    io.use((socket, next) => {
        const token = socket.handshake.auth && socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // { id, role }
            // join a room for this user so server can emit to that room
            socket.join(String(decoded.id));
            return next();
        } catch (err) {
            return next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log('New authenticated client connected:', socket.id, 'user:', socket.user && socket.user.id);

        socket.on('leave', (userId) => {
            try {
                socket.leave(userId);
            } catch (e) {}
        });

        socket.on('disconnect', () => {
            // socket.io handles room cleanup automatically
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

module.exports = { initSocket, getIO };