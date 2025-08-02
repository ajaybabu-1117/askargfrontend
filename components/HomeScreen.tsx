import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Newspaper, 
  Briefcase, 
  GraduationCap, 
  Bell, 
  MessageCircle,
  User,
  LogOut,
  Settings
} from 'lucide-react';
import NewsPage from './NewsPage';
import JobsPage from './JobsPage';
import InternshipsPage from './InternshipsPage';
import NotificationsPage from './NotificationsPage';
import ChatPage from './ChatPage';
import ProfilePage from './ProfilePage';

const HomeScreen = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('news');
  const [showProfile, setShowProfile] = useState(false);

  const tabs = [
    { id: 'news', icon: Newspaper, label: 'News', color: 'blue' },
    { id: 'jobs', icon: Briefcase, label: 'Jobs', color: 'green' },
    { id: 'internships', icon: GraduationCap, label: 'Internships', color: 'purple' },
    { id: 'notifications', icon: Bell, label: 'Notifications', color: 'orange' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', color: 'pink' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'news':
        return <NewsPage />;
      case 'jobs':
        return <JobsPage />;
      case 'internships':
        return <InternshipsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'chat':
        return <ChatPage user={user} />;
      default:
        return <NewsPage />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-white">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Askarg</h1>
              <p className="text-sm text-gray-500 capitalize">{tabs.find(tab => tab.id === activeTab)?.label}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="relative"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 px-1 w-48 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setShowProfile(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Settings</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setShowProfile(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'profile' ? (
              <ProfilePage user={user} onLogout={onLogout} />
            ) : (
              renderContent()
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-100 px-2 py-2">
        <div className="flex items-center justify-between">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-3 px-2 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? `bg-${tab.color}-50 text-${tab.color}-600` 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className={`relative ${isActive ? 'transform scale-110' : ''}`}>
                  <Icon className="w-6 h-6" />
                  {tab.id === 'notifications' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">3</span>
                    </div>
                  )}
                  {tab.id === 'chat' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
                <span className={`text-xs mt-1 transition-all duration-200 ${
                  isActive ? 'font-semibold' : 'font-medium'
                }`}>
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;