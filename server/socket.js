const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');

module.exports = (io) => {
  const onlineUsers = new Map();

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
      
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      socket.user = user;
      socket.userId = user._id.toString();
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    await User.findByIdAndUpdate(socket.userId, { 
      isOnline: true,
      lastSeen: new Date()
    });
    
    onlineUsers.set(socket.userId, socket.id);
    
    io.emit('user_status', {
      userId: socket.userId,
      isOnline: true
    });
    
    const pendingMessages = await Message.find({
      recipient: socket.userId,
      delivered: false
    });
    
    if (pendingMessages.length > 0) {
      await Message.updateMany(
        { recipient: socket.userId, delivered: false },
        { $set: { delivered: true } }
      );
      
      socket.emit('pending_messages', pendingMessages);
    }

    socket.on('send_message', async (data) => {
      try {
        const { recipientId, content } = data;
        
        const message = new Message({
          sender: socket.userId,
          recipient: recipientId,
          content,
          delivered: onlineUsers.has(recipientId),
          sentAt: new Date()
        });
        
        await message.save();
        
        if (onlineUsers.has(recipientId)) {
          io.to(onlineUsers.get(recipientId)).emit('receive_message', {
            _id: message._id,
            sender: socket.userId,
            content: message.content,
            createdAt: message.createdAt,
            sentAt: message.sentAt
          });
          
          message.delivered = true;
          await message.save();
        }
        
        socket.emit('message_sent', {
          _id: message._id,
          recipient: recipientId,
          content: message.content,
          delivered: message.delivered,
          createdAt: message.createdAt,
          sentAt: message.sentAt
        });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    socket.on('mark_read', async (data) => {
      try {
        const { messageId } = data;
        
        const message = await Message.findByIdAndUpdate(
          messageId, 
          { read: true },
          { new: true }
        );
        
        if (message && onlineUsers.has(message.sender.toString())) {
          io.to(onlineUsers.get(message.sender.toString())).emit('message_read', {
            messageId: message._id
          });
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    socket.on('typing', (data) => {
      const { recipientId } = data;
      
      if (onlineUsers.has(recipientId)) {
        io.to(onlineUsers.get(recipientId)).emit('user_typing', {
          userId: socket.userId
        });
      }
    });

    socket.on('stop_typing', (data) => {
      const { recipientId } = data;
      
      if (onlineUsers.has(recipientId)) {
        io.to(onlineUsers.get(recipientId)).emit('user_stop_typing', {
          userId: socket.userId
        });
      }
    });

    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.userId}`);
      
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date()
      });
      
      onlineUsers.delete(socket.userId);
      
      io.emit('user_status', {
        userId: socket.userId,
        isOnline: false
      });
    });
  });
};