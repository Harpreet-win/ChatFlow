import React from 'react';
import { Message } from '../types/chat';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  isDarkMode: boolean;
}

export default function MessageBubble({ message, isOwn, isDarkMode }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group animate-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
        isOwn 
          ? 'bg-blue-500 text-white rounded-br-md' 
          : isDarkMode
            ? 'bg-gray-700 text-white rounded-bl-md'
            : 'bg-gray-200 text-gray-900 rounded-bl-md'
      } transition-all duration-200 hover:shadow-md`}>
        <p className="text-sm leading-relaxed">{message.text}</p>
        <p className={`text-xs mt-1 ${
          isOwn 
            ? 'text-blue-100' 
            : isDarkMode 
              ? 'text-gray-400' 
              : 'text-gray-500'
        } opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}