import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(process.env.SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // Connection events
  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initSocket first.');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onReceiveMessage = (callback) => {
  if (!socket) return;
  socket.on('receive_message', callback);
  return () => socket.off('receive_message', callback);
};

export const onMessageSent = (callback) => {
  if (!socket) return;
  socket.on('message_sent', callback);
  return () => socket.off('message_sent', callback);
};

export const onMessageRead = (callback) => {
  if (!socket) return;
  socket.on('message_read', callback);
  return () => socket.off('message_read', callback);
};

export const onUserStatus = (callback) => {
  if (!socket) return;
  socket.on('user_status', callback);
  return () => socket.off('user_status', callback);
};

export const onUserTyping = (callback) => {
  if (!socket) return;
  socket.on('user_typing', callback);
  return () => socket.off('user_typing', callback);
};

export const onUserStopTyping = (callback) => {
  if (!socket) return;
  socket.on('user_stop_typing', callback);
  return () => socket.off('user_stop_typing', callback);
};

export const onPendingMessages = (callback) => {
  if (!socket) return;
  socket.on('pending_messages', callback);
  return () => socket.off('pending_messages', callback);
};

// Socket actions
export const sendMessage = (recipientId, content) => {
  if (!socket) return;
  socket.emit('send_message', { recipientId, content });
};

export const markRead = (messageId) => {
  if (!socket) return;
  socket.emit('mark_read', { messageId });
};

export const typing = (recipientId) => {
  if (!socket) return;
  socket.emit('typing', { recipientId });
};

export const stopTyping = (recipientId) => {
  if (!socket) return;
  socket.emit('stop_typing', { recipientId });
};