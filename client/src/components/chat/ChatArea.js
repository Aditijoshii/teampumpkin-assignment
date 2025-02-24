import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiMoreVertical, FiInfo } from 'react-icons/fi';
import { useChat } from '@/context/ChatContext';
import MessageList from './MessageList';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import moment from 'moment';

const ChatArea = () => {
  const {
    activeConversation,
    conversations,
    messages,
    sendMessage,
    loadingMessages,
    typingUsers,
    handleTyping,
  } = useChat();
  
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  
  // Get active conversation user
  const activeUser = conversations.find(
    conv => conv.user._id === activeConversation
  )?.user;
  
  // Check if the other user is typing
  const otherUserIsTyping = typingUsers[activeConversation];
  
  // Handle input change
  const handleInputChange = (e) => {
    setMessageText(e.target.value);
    
    // Handle typing indicator
    if (activeConversation && !isTyping) {
      setIsTyping(true);
      handleTyping(activeConversation, true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        handleTyping(activeConversation, false);
      }
    }, 2000);
  };
  
  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!messageText.trim() || !activeConversation) return;
    
    // Send message
    sendMessage(activeConversation, messageText.trim());
    setMessageText('');
    
    // Focus input again
    inputRef.current?.focus();
    
    // Stop typing indicator
    setIsTyping(false);
    handleTyping(activeConversation, false);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };
  
  // Focus input when active conversation changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeConversation]);
  
  // Format last seen
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Never online';
    
    return `Last seen ${moment(timestamp).fromNow()}`;
  };
  
  // If no active conversation
  if (!activeConversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">
          Welcome to P2P Chat
        </h2>
        <p className="text-secondary-600 max-w-md">
          Select a conversation from the sidebar or search for users to start chatting.
        </p>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Chat header */}
      <div className="p-4 border-b border-secondary-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar
            src={activeUser?.avatar}
            alt={activeUser?.name}
            online={activeUser?.isOnline}
            size="md"
          />
          <div>
            <h2 className="font-medium text-secondary-900">{activeUser?.name}</h2>
            <p className="text-xs text-secondary-500">
              {activeUser?.isOnline 
                ? 'Online' 
                : formatLastSeen(activeUser?.lastSeen)}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<FiInfo className="h-5 w-5" />}
          className="text-secondary-500"
        >
          Info
        </Button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-secondary-50">
        <MessageList
          messages={messages}
          isLoading={loadingMessages}
          activeUser={activeUser}
        />
        
        {/* Typing indicator */}
        {otherUserIsTyping && (
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center">
              <span className="text-xs text-secondary-600">{activeUser?.name?.charAt(0)}</span>
            </div>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-secondary-200 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={messageText}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!messageText.trim()}
            leftIcon={<FiSend className="h-5 w-5" />}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;