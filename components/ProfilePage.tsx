import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  TrendingUp, 
  Bookmark, 
  Settings,
  LogOut,
  Bell,
  Shield,
  Palette,
  Globe,
  Download
} from 'lucide-react';

const ProfilePage = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('profile');

  // Mock analytics data (would come from Firestore)
  const analyticsData = {
    loginStreak: 15,
    articlesRead: 47,
    jobsApplied: 8,
    internshipsViewed: 23,
    chatMessages: 156,
    timeSpent: '4h 32m',
    joinDate: new Date('2024-12-15')
  };

  const achievements = [
    { id: 1, title: 'News Reader', description: 'Read 50+ articles', icon: '📰', unlocked: true },
    { id: 2, title: 'Job Hunter', description: 'Applied to 10+ jobs', icon: '💼', unlocked: false },
    { id: 3, title: 'Chat Active', description: 'Send 100+ messages', icon: '💬', unlocked: true },
    { id: 4, title: 'Streak Master', description: '30-day login streak', icon: '🔥', unlocked: false }
  ];

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{user?.name}</h3>
        <p className="text-gray-600 mb-4">{user?.email}</p>
        <div className="flex items-center justify-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          Joined {formatDate(analyticsData.joinDate)}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h4 className="font-semibold text-gray-800 mb-4">Quick Stats</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{analyticsData.loginStreak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{analyticsData.articlesRead}</div>
            <div className="text-sm text-gray-600">Articles Read</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">{analyticsData.jobsApplied}</div>
            <div className="text-sm text-gray-600">Jobs Applied</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <div className="text-2xl font-bold text-orange-600">{analyticsData.chatMessages}</div>
            <div className="text-sm text-gray-600">Messages Sent</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h4 className="font-semibold text-gray-800 mb-4">Activity Overview</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Login Streak</p>
                <p className="text-sm text-gray-600">Consecutive days active</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600">{analyticsData.loginStreak}</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Time Spent</p>
                <p className="text-sm text-gray-600">This week</p>
              </div>
            </div>
            <div className="text-xl font-bold text-green-600">{analyticsData.timeSpent}</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Internships Viewed</p>
                <p className="text-sm text-gray-600">This month</p>
              </div>
            </div>
            <div className="text-xl font-bold text-purple-600">{analyticsData.internshipsViewed}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h4 className="font-semibold text-gray-800 mb-4">Weekly Progress</h4>
        <div className="space-y-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="flex items-center space-x-3">
              <span className="w-8 text-sm text-gray-600">{day}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.random() * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAchievementsSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h4 className="font-semibold text-gray-800 mb-4">Your Achievements</h4>
        <div className="grid gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={achievement.unlocked ? { scale: 1.02 } : {}}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                achievement.unlocked
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h5 className={`font-semibold ${
                    achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h5>
                  <p className={`text-sm ${
                    achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettingsSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h4 className="font-semibold text-gray-800 mb-4">Preferences</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">Notifications</p>
                <p className="text-sm text-gray-600">Manage notification preferences</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-blue-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-all duration-200" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">Privacy</p>
                <p className="text-sm text-gray-600">Control your privacy settings</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-gray-300 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-all duration-200" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center space-x-3">
              <Palette className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">Theme</p>
                <p className="text-sm text-gray-600">Light mode</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">Language</p>
                <p className="text-sm text-gray-600">English (US)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h4 className="font-semibold text-gray-800 mb-4">Account</h4>
        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
          >
            <Download className="w-5 h-5 text-gray-600" />
            <span className="text-gray-800">Export Data</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="w-full flex items-center space-x-3 p-4 hover:bg-red-50 rounded-xl transition-colors text-left text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'analytics':
        return renderAnalyticsSection();
      case 'achievements':
        return renderAchievementsSection();
      case 'settings':
        return renderSettingsSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Profile</h2>
        <p className="text-sm text-gray-500">Manage your account and preferences</p>
      </div>

      {/* Menu */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex space-x-2 overflow-x-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(item.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;