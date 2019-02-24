const express = require('express');
const authorizeMiddleware = require('../../middleware/authorize');

const testRouter = express.Router();

testRouter.use(authorizeMiddleware());

testRouter.get('/', (req, res, next) => {
  const users = req.socketUsers(req.user._id);
  users.forEach((socket) => {
    socket.emit('openModal', {
      title: 'Testing Sockets Today!',
      content: 'This is a socket test, please check it out!',
      actions: [ { label: 'Ok' } ],
    });
  });
  return res.json({
    socket: 'sent',
  });
});

module.exports = testRouter;
