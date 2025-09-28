import { User, Message, Chat } from '../types/chat';

export const currentUser: User = {
  id: 'current-user',
  name: 'You',
  avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  isOnline: true,
};

export const users: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Alex Rodriguez',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isOnline: false,
    lastSeen: '2 hours ago',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isOnline: true,
  },
  {
    id: '4',
    name: 'Michael Kim',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isOnline: false,
    lastSeen: '1 day ago',
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isOnline: true,
  },
];

export const mockMessages: { [chatId: string]: Message[] } = {
  '1': [
    {
      id: '1',
      text: 'Hey! How are you doing?',
      senderId: '1',
      recipientId: 'current-user',
      timestamp: new Date(Date.now() - 3600000),
      isRead: true,
    },
    {
      id: '2',
      text: 'I\'m doing great! Just finished the new project mockups.',
      senderId: 'current-user',
      recipientId: '1',
      timestamp: new Date(Date.now() - 3500000),
      isRead: true,
    },
    {
      id: '3',
      text: 'That sounds awesome! Can\'t wait to see them.',
      senderId: '1',
      recipientId: 'current-user',
      timestamp: new Date(Date.now() - 3000000),
      isRead: true,
    },
    {
      id: '4',
      text: 'I\'ll share them with you tomorrow morning. The client is going to love the new design direction we\'re taking.',
      senderId: 'current-user',
      recipientId: '1',
      timestamp: new Date(Date.now() - 2800000),
      isRead: true,
    },
  ],
  '2': [
    {
      id: '5',
      text: 'Are we still on for the meeting tomorrow?',
      senderId: '2',
      recipientId: 'current-user',
      timestamp: new Date(Date.now() - 7200000),
      isRead: true,
    },
    {
      id: '6',
      text: 'Yes, absolutely! 2 PM still works for me.',
      senderId: 'current-user',
      recipientId: '2',
      timestamp: new Date(Date.now() - 7100000),
      isRead: true,
    },
  ],
  '3': [
    {
      id: '7',
      text: 'The presentation went really well! Thanks for your help.',
      senderId: '3',
      recipientId: 'current-user',
      timestamp: new Date(Date.now() - 1800000),
      isRead: true,
    },
  ],
  '4': [
    {
      id: '8',
      text: 'Good morning! Hope you have a great day ahead.',
      senderId: '4',
      recipientId: 'current-user',
      timestamp: new Date(Date.now() - 86400000),
      isRead: true,
    },
  ],
  '5': [
    {
      id: '9',
      text: 'Just saw your latest work on Instagram. Incredible stuff!',
      senderId: '5',
      recipientId: 'current-user',
      timestamp: new Date(Date.now() - 900000),
      isRead: true,
    },
    {
      id: '10',
      text: 'Thank you so much! That means a lot coming from you.',
      senderId: 'current-user',
      recipientId: '5',
      timestamp: new Date(Date.now() - 800000),
      isRead: true,
    },
  ],
};

export const mockChats: Chat[] = users.map(user => {
  const userMessages = mockMessages[user.id] || [];
  const lastMessage = userMessages[userMessages.length - 1];
  
  return {
    id: user.id,
    user,
    lastMessage: lastMessage || {
      id: 'default',
      text: 'Start a conversation...',
      senderId: user.id,
      recipientId: 'current-user',
      timestamp: new Date(),
      isRead: true,
    },
    unreadCount: Math.floor(Math.random() * 3),
  };
});