const socketIo = require('socket.io');
const redis = require('socket.io-redis');
const JWT = require('jsonwebtoken');
const User = require('../db/models/User');

let io = null;

const authMiddleware = () => async (socket, next) => {
  let token = socket.handshake.query.token;
  console.log('token', token);
  if (!token) {
    next();
  } else {
    let decoded = null;
    try {
      decoded = JWT.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id);
      console.log('user._id', socket.user._id);
      next();
    } catch (err) {
      next(err);
    }
  }
};

module.exports = (server) => {
  if (io === null) {
    io = socketIo(server);
  }

  io.adapter(redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  }));

  io.on('connection', function socketConnection(socket) {
    console.log('a user connected', socket.id);
    socket.on('disconnect', function() {
      console.log('user disconnected');
    });
  });

  io.use(authMiddleware());

  return (req, res, next) => {
    req.io = io;
    req.socketUsers = id => Object.values(io.sockets.sockets)
      .filter(socket => String(socket.user._id) === String(id));
    next();
  };
};
