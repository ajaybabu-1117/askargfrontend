import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Smile, 
  Users, 
  Hash,
  MoreVertical,
  Search,
  Phone,
  Video
} from 'lucide-react';
import { FirestoreService } from '../services/firestoreService';

const ChatPage = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeRoom, setActiveRoom] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const unsubscribeRef = useRef(null);

  const chatRooms = [
    { id: 'general', name: 'General', members: 1247, online: 89 },
    { id: 'jobs', name: 'Job Discussions', members: 892, online: 45 },
    { id: 'internships', name: 'Internships', members: 634, online: 23 },
    { id: 'tech', name: 'Tech Talk', members: 1156, online: 67 },
    { id: 'career', name: 'Career Advice', members: 723, online: 34 }
  ];

  // Mock messages as fallback
  const mockMessages = [
    {
      id: 1,
      sender: 'Alex Chen',
      senderId: 'user1',
      message: 'Hey everyone! Just landed a software engineering role at Google! 🎉',
      timestamp: new Date('2025-02-01T10:30:00'),
      isCurrentUser: false
    },
    {
      id: 2,
      sender: 'Sarah Johnson',
      senderId: 'user2',
      message: 'Congratulations Alex! That\'s amazing news! How was the interview process?',
      timestamp: new Date('2025-02-01T10:32:00'),
      isCurrentUser: false
    }
  ];

  useEffect(() => {
    loadMessages();
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [activeRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    setIsLoading(true);
    
    // Cleanup previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    try {
      // Listen to real-time messages from Firebase
      unsubscribeRef.current = FirestoreService.listenToMessages(activeRoom, (firebaseMessages) => {
        if (firebaseMessages.length > 0) {
          const messagesWithUserFlag = firebaseMessages.map(msg => ({
            ...msg,
            isCurrentUser: msg.senderId === user?.id
          }));
          setMessages(messagesWithUserFlag);
        } else {
          // Use mock messages if no Firebase messages
          const mockWithUserFlag = mockMessages.map(msg => ({
            ...msg,
            isCurrentUser: msg.senderId === user?.id
          }));
          setMessages(mockWithUserFlag);
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error loading messages:', error);
      // Fallback to mock messages
      const mockWithUserFlag = mockMessages.map(msg => ({
        ...msg,
        isCurrentUser: msg.senderId === user?.id
      }));
      setMessages(mockWithUserFlag);
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const tempMessage = {
      id: Date.now(),
      sender: user.name,
      senderId: user.id,
      message: newMessage,
      timestamp: new Date(),
      isCurrentUser: true
    };

    // Optimistically add message to UI
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    try {
      // Send message to Firebase
      await FirestoreService.sendMessage(activeRoom, user.id, user.name, newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const currentRoom = chatRooms.find(room => room.id === activeRoom);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Hash className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{currentRoom?.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {currentRoom?.members} members
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                  {currentRoom?.online} online
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Video className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Room Selection */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex space-x-2 overflow-x-auto">
          {chatRooms.map((room) => (
            <motion.button
              key={room.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveRoom(room.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeRoom === room.id
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {room.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${message.isCurrentUser ? 'order-2' : ''}`}>
                {!message.isCurrentUser && (
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {message.sender[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{message.sender}</span>
                    <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                  </div>
                )}
                
                <div className={`px-4 py-3 rounded-2xl ${
                  message.isCurrentUser
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-white border border-gray-100 text-gray-800'
                }`}>
                  <p className="leading-relaxed">{message.message}</p>
                </div>
                
                {message.isCurrentUser && (
                  <div className="text-right mt-1">
                    <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-100 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Smile className="w-5 h-5" />
          </motion.button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${currentRoom?.name}...`}
              className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-200"
            />
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!newMessage.trim()}
            className={`p-3 rounded-2xl transition-all duration-200 ${
              newMessage.trim()
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;