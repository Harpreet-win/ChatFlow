import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import AuthForm from './components/AuthForm';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { Chat, Message, ChatState } from './types/chat';
import { mockChats, mockMessages, currentUser } from './data/mockData';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [chatState, setChatState] = useState<ChatState>({
    currentChat: null,
    chats: mockChats,
    messages: mockMessages,
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleChatSelect = (chat: Chat) => {
    setChatState(prev => ({
      ...prev,
      currentChat: chat,
    }));
    // Hide sidebar on mobile when chat is selected
    if (window.innerWidth < 1024) {
      setShowSidebar(false);
    }
  };

  const handleSendMessage = (text: string, chatId: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      senderId: currentUser.id,
      recipientId: chatId,
      timestamp: new Date(),
      isRead: false,
    };

    setChatState(prev => {
      const updatedMessages = {
        ...prev.messages,
        [chatId]: [...(prev.messages[chatId] || []), newMessage],
      };

      const updatedChats = prev.chats.map(chat => 
        chat.id === chatId 
          ? { ...chat, lastMessage: newMessage }
          : chat
      );

      return {
        ...prev,
        messages: updatedMessages,
        chats: updatedChats,
      };
    });
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleBackToSidebar = () => {
    setShowSidebar(true);
    setChatState(prev => ({
      ...prev,
      currentChat: null,
    }));
  };

  const handleAuthSuccess = () => {
    // Auth state will be handled by the auth listener
  };

  const currentMessages = chatState.currentChat 
    ? chatState.messages[chatState.currentChat.id] || []
    : [];

  if (loading) {
    return (
      <div className={`h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading ChatFlow...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm isDarkMode={isDarkMode} onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className={`h-screen flex transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Sidebar - Always visible on desktop, toggleable on mobile */}
      <div className={`${showSidebar ? 'block' : 'hidden'} lg:block lg:flex-shrink-0`}>
        <Sidebar
          chats={chatState.chats}
          currentChat={chatState.currentChat}
          onChatSelect={handleChatSelect}
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
          isVisible={showSidebar}
        />
      </div>

      {/* Chat Area - Hidden on mobile when sidebar is visible */}
      <div className={`flex-1 ${showSidebar ? 'hidden lg:flex' : 'flex'} flex-col`}>
        <ChatArea
          chat={chatState.currentChat}
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          isDarkMode={isDarkMode}
          onBackToSidebar={handleBackToSidebar}
        />
      </div>
    </div>
  );
}

export default App;