import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import moment from 'moment';
import Avatar from '@/components/ui/Avatar';

const MessageList = ({ messages, isLoading, activeUser }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return moment(timestamp).format('h:mm A');
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = moment(message.createdAt).format('YYYY-MM-DD');
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(message);
    return groups;
  }, {});

  // Format date header
  const formatDateHeader = (dateStr) => {
    const date = moment(dateStr, 'YYYY-MM-DD');
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'days').startOf('day');
    
    if (date.isSame(today, 'd')) {
      return 'Today';
    } else if (date.isSame(yesterday, 'd')) {
      return 'Yesterday';
    } else {
      return date.format('MMMM D, YYYY');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
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
        <h3 className="text-lg font-medium text-secondary-900">No messages yet</h3>
        <p className="text-secondary-500 mt-1">
          Start the conversation by sending a message below.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          {/* Date header */}
          <div className="flex justify-center my-4">
            <span className="px-4 py-1 bg-secondary-200 rounded-full text-xs text-secondary-600 font-medium">
              {formatDateHeader(date)}
            </span>
          </div>

          {/* Messages for this date */}
          <div className="space-y-4">
            {dateMessages.map((message, i) => {
              const isSent = message.sender === user._id;
              const showAvatar = !isSent && (
                i === 0 || 
                dateMessages[i - 1]?.sender !== message.sender
              );
              
              return (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex ${isSent ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 ${isSent ? 'space-x-reverse' : ''} max-w-[75%]`}>
                    {/* Avatar for received messages */}
                    {showAvatar ? (
                      <Avatar
                        src={activeUser?.avatar}
                        alt={activeUser?.name}
                        size="sm"
                        className="mb-1"
                      />
                    ) : (
                      <div className="w-8 invisible"></div>
                    )}
                    
                    {/* Message bubble */}
                    <div className={isSent ? 'message-bubble-sent' : 'message-bubble-received'}>
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      <div className={`text-xs mt-1 ${isSent ? 'text-primary-100' : 'text-secondary-400'} flex items-center space-x-1`}>
                        <span>{formatTime(message.createdAt)}</span>
                        
                        {/* Read indicator for sent messages */}
                        {isSent && (
                          <span>
                            {message.read ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : message.delivered ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Scroll reference */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;