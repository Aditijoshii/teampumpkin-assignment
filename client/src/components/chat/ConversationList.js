import React from 'react';
import { motion } from 'framer-motion';
import { useChat } from '@/context/ChatContext';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import moment from 'moment';

const ConversationList = ({ conversations }) => {
  const { activeConversation, setActiveChat } = useChat();

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return moment(date).format('h:mm A');
    }
    
    // If this week, show day name
    if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return moment(date).format('ddd');
    }
    
    // Otherwise show date
    return moment(date).format('MM/DD/YY');
  };

  const truncateMessage = (message, maxLength = 40) => {
    if (!message) return '';
    if (message.length <= maxLength) return message;
    return `${message.substring(0, maxLength)}...`;
  };

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-secondary-500"
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
        <h3 className="text-lg font-medium text-secondary-900">No conversations yet</h3>
        <p className="text-secondary-500 mt-1">
          Search for users by email or phone to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-secondary-100">
      {conversations.map(({ user, lastMessage, unreadCount }) => (
        <motion.div
          key={user._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`p-4 cursor-pointer hover:bg-secondary-50 ${
            activeConversation === user._id ? 'bg-secondary-50' : ''
          }`}
          onClick={() => setActiveChat(user._id)}
        >
          <div className="flex items-start space-x-3">
            <Avatar
              src={user.avatar}
              alt={user.name}
              online={user.isOnline}
              size="lg"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-secondary-900 truncate">
                  {user.name}
                </h3>
                {lastMessage && (
                  <span className="text-xs text-secondary-500">
                    {formatTime(lastMessage.createdAt)}
                  </span>
                )}
              </div>
              
              <p className="text-xs text-secondary-500 truncate mt-1">
                {user.email}
              </p>
              
              <div className="flex justify-between items-center mt-1">
                <p className={`text-sm truncate ${
                  lastMessage && !lastMessage.read && lastMessage.sender === user._id
                    ? 'font-medium text-secondary-900'
                    : 'text-secondary-500'
                }`}>
                  {lastMessage 
                    ? truncateMessage(lastMessage.content) 
                    : 'No messages yet'}
                </p>
                
                {unreadCount > 0 && (
                  <Badge variant="primary" size="sm">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ConversationList;