import React, { useState } from 'react';
import { Search, Moon, Sun, MessageSquare } from 'lucide-react';
import { Chat } from '../types/chat';

interface SidebarProps {
  chats: Chat[];
  currentChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  isVisible?: boolean;
}

export default function Sidebar({ chats, currentChat, onChatSelect, isDarkMode, onThemeToggle, isVisible = true }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className={`w-full lg:w-80 h-screen border-r transition-all duration-200 flex flex-col ${
      isDarkMode 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    } ${isVisible ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      {/* Header */}
      <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ChatFlow
            </h1>
          </div>
          <button
            onClick={onThemeToggle}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
        </div>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat)}
            className={`p-3 sm:p-4 cursor-pointer transition-all duration-200 border-l-4 ${
              currentChat?.id === chat.id
                ? isDarkMode
                  ? 'bg-gray-800 border-blue-500'
                  : 'bg-blue-50 border-blue-500'
                : isDarkMode
                  ? 'border-transparent hover:bg-gray-800'
                  : 'border-transparent hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <img
                  src={chat.user.avatar}
                  alt={chat.user.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 ${
                  isDarkMode ? 'border-gray-900' : 'border-white'
                } ${chat.user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold truncate text-sm sm:text-base ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {chat.user.name}
                  </h3>
                  <span className={`text-xs hidden sm:inline ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {formatTime(chat.lastMessage.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className={`text-xs sm:text-sm truncate ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {chat.lastMessage.text}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[18px] text-center flex-shrink-0 ml-2">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}