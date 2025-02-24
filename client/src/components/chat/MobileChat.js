import React, { useState, useEffect } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { useChat } from '@/context/ChatContext';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import Button from '@/components/ui/Button';

const MobileChat = () => {
  const { activeConversation } = useChat();
  const [showSidebar, setShowSidebar] = useState(true);
  
  // Toggle between sidebar and chat area based on active conversation
  useEffect(() => {
    if (activeConversation) {
      setShowSidebar(false);
    }
  }, [activeConversation]);
  
  return (
    <div className="h-screen flex flex-col md:hidden">
      {showSidebar ? (
        <Sidebar />
      ) : (
        <div className="h-full flex flex-col">
          <div className="p-2 flex items-center border-b border-secondary-200">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<FiChevronLeft className="h-5 w-5" />}
              onClick={() => setShowSidebar(true)}
              className="text-secondary-700"
            >
              Back
            </Button>
          </div>
          <div className="flex-1">
            <ChatArea />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileChat;