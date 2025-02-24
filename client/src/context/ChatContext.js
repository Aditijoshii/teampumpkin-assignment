import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  getConversations, 
  getMessages, 
  searchUsers 
} from '@/services/api';
import {
  getSocket,
  sendMessage as socketSendMessage,
  markRead as socketMarkRead,
  typing as socketTyping,
  stopTyping as socketStopTyping,
  onReceiveMessage,
  onMessageSent,
  onMessageRead,
  onUserStatus,
  onUserTyping,
  onUserStopTyping,
  onPendingMessages
} from '@/services/socket';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [error, setError] = useState(null);

  const loadConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const { data } = await getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    }
  }, [isAuthenticated]);

  const loadMessages = useCallback(async (userId) => {
    if (!isAuthenticated || !userId) return;
    
    try {
      setLoadingMessages(true);
      const { data } = await getMessages(userId);
      setMessages(data);
      
      data.forEach(message => {
        if (message.sender === userId && !message.read) {
          socketMarkRead(message._id);
        }
      });
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  }, [isAuthenticated]);

  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    try {
      setIsSearching(true);
      const { data } = await searchUsers(query);
      setSearchResults(data);
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  }, []);

  const sendMessage = useCallback((recipientId, content) => {
    if (!content.trim()) return;
    
    try {
      socketSendMessage(recipientId, content);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  }, []);

  const setActiveChat = useCallback(async (userId) => {
    setActiveConversation(userId);
    await loadMessages(userId);
  }, [loadMessages]);

  const handleTyping = useCallback((recipientId, isTyping) => {
    if (isTyping) {
      socketTyping(recipientId);
    } else {
      socketStopTyping(recipientId);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const socket = getSocket();
    
    const removeReceiveMessage = onReceiveMessage((message) => {
      if (activeConversation === message.sender) {
        setMessages(prev => [...prev, message]);
        socketMarkRead(message._id);
      }
      
      loadConversations();
    });
    
    const removeMessageSent = onMessageSent((message) => {
      if (activeConversation === message.recipient) {
        setMessages(prev => [...prev, message]);
      }
      
      loadConversations();
    });
    
    const removeMessageRead = onMessageRead(({ messageId }) => {
      setMessages(prev => 
        prev.map(msg => 
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
    });
    
    const removeUserStatus = onUserStatus(({ userId, isOnline }) => {
      setConversations(prev => 
        prev.map(conv => 
          conv.user._id === userId 
            ? { ...conv, user: { ...conv.user, isOnline } } 
            : conv
        )
      );
    });
    
    const removeUserTyping = onUserTyping(({ userId }) => {
      setTypingUsers(prev => ({ ...prev, [userId]: true }));
    });
    
    const removeUserStopTyping = onUserStopTyping(({ userId }) => {
      setTypingUsers(prev => ({ ...prev, [userId]: false }));
    });
    
    const removePendingMessages = onPendingMessages((pendingMessages) => {
      if (pendingMessages.length > 0) {
        if (activeConversation) {
          const relevantMessages = pendingMessages.filter(
            msg => msg.sender === activeConversation
          );
          
          if (relevantMessages.length > 0) {
            setMessages(prev => [...prev, ...relevantMessages]);
            relevantMessages.forEach(msg => socketMarkRead(msg._id));
          }
        }
        
        loadConversations();
      }
    });
    
    loadConversations();
    
    return () => {
      removeReceiveMessage?.();
      removeMessageSent?.();
      removeMessageRead?.();
      removeUserStatus?.();
      removeUserTyping?.();
      removeUserStopTyping?.();
      removePendingMessages?.();
    };
  }, [isAuthenticated, activeConversation, loadConversations, loadMessages]);

  const value = {
    conversations,
    messages,
    activeConversation,
    searchResults,
    searchQuery,
    isSearching,
    loadingMessages,
    typingUsers,
    error,
    setActiveChat,
    sendMessage,
    handleSearch,
    handleTyping,
    loadConversations,
    markRead: socketMarkRead,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;