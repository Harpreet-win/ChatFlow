import React, { useState, useRef, useEffect } from 'react';
import { Phone, Video, MoreHorizontal, Send, Paperclip, Smile, ArrowLeft } from 'lucide-react';
import { Chat, Message } from '../types/chat';
import { currentUser } from '../data/mockData';
import MessageBubble from './MessageBubble';

interface ChatAreaProps {
  chat: Chat | null;
  messages: Message[];
  onSendMessage: (text: string, chatId: string) => void;
  isDarkMode: boolean;
  onBackToSidebar?: () => void;
}

export default function ChatArea({ chat, messages, onSendMessage, isDarkMode, onBackToSidebar }: ChatAreaProps) {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageText]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && chat) {
      onSendMessage(messageText, chat.id);
      setMessageText('');
    }
  };

  if (!chat) {
    return (
      <div className={`flex-1 flex items-center justify-center ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <Send className={`w-12 h-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome to ChatFlow
          </h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col h-screen ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Chat Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
      } shadow-sm flex-shrink-0`}>
        <div className="flex items-center space-x-3">
          {/* Mobile back button */}
          <button
            onClick={onBackToSidebar}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <img
              src={chat.user.avatar}
              alt={chat.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
              isDarkMode ? 'border-gray-900' : 'border-white'
            } ${chat.user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
          </div>
          <div>
            <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {chat.user.name}
            </h2>
            <p className={`text-sm ${
              chat.user.isOnline 
                ? 'text-green-500' 
                : isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {chat.user.isOnline ? 'Online' : chat.user.lastSeen ? `Last seen ${chat.user.lastSeen}` : 'Offline'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className={`p-2 rounded-lg transition-colors duration-200 ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}>
            <Phone className="w-5 h-5" />
          </button>
          <button className={`p-2 rounded-lg transition-colors duration-200 ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}>
            <Video className="w-5 h-5" />
          </button>
          <button className={`p-2 rounded-lg transition-colors duration-200 ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}>
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUser.id}
            isDarkMode={isDarkMode}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className={`p-4 border-t flex-shrink-0 ${
        isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
      }`}>
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2 sm:space-x-3">
          <div className="flex space-x-2">
            <button
              type="button"
              className={`p-2 rounded-lg transition-colors duration-200 hidden sm:block ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
              }`}
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Type a message..."
              className={`w-full px-4 py-3 pr-12 rounded-xl border resize-none transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px', overflow: 'hidden' }}
            />
            <button
              type="button"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200 hidden sm:block ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!messageText.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}