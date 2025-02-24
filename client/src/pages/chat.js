import React from 'react';
import Head from 'next/head';
import { toast, Toaster } from 'react-hot-toast';
import { ChatProvider } from '@/context/ChatContext';
import AppLayout from '@/components/layout/AppLayout';
import Sidebar from '@/components/chat/Sidebar';
import ChatArea from '@/components/chat/ChatArea';
import MobileChat from '@/components/chat/MobileChat';

const ChatPage = () => {
  return (
    <AppLayout title="Chat | P2P Chat App" requireAuth={true}>
      <Head>
        <title>Chat | P2P Chat App</title>
      </Head>
      
      <ChatProvider>
        {/* Mobile view */}
        <div className="md:hidden h-screen">
          <MobileChat />
        </div>
        
        {/* Desktop view */}
        <div className="hidden md:flex h-screen flex-col">
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-secondary-200">
              <Sidebar />
            </div>
            
            {/* Chat area */}
            <div className="flex-1 flex-col">
              <ChatArea />
            </div>
          </div>
        </div>
        
        {/* Toast notifications */}
        <Toaster position="top-right" />
      </ChatProvider>
    </AppLayout>
  );
};

export default ChatPage;