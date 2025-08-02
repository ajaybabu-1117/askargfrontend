import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  BellRing, 
  Trash2, 
  CheckCheck, 
  Briefcase, 
  Newspaper, 
  GraduationCap,
  MessageCircle
} from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock notifications data (would come from Firestore)
  const mockNotifications = [
    {
      id: 1,
      title: "New Job Alert",
      body: "5 new software engineering jobs match your profile",
      timestamp: new Date('2025-02-01T10:30:00'),
      type: "job",
      read: false,
      actionUrl: "/jobs"
    },
    {
      id: 2,
      title: "Application Update",
      body: "Your application for Product Manager at TechCorp has been viewed",
      timestamp: new Date('2025-02-01T09:15:00'),
      type: "application",
      read: false,
      actionUrl: "/applications"
    },
    {
      id: 3,
      title: "New Message",
      body: "You have a new message in the General chat room",
      timestamp: new Date('2025-02-01T08:45:00'),
      type: "chat",
      read: true,
      actionUrl: "/chat"
    },
    {
      id: 4,
      title: "Trending News",
      body: "Tech Industry Growth Hits Record High - Don't miss out!",
      timestamp: new Date('2025-01-31T16:20:00'),
      type: "news",
      read: true,
      actionUrl: "/news"
    },
    {
      id: 5,
      title: "Internship Deadline",
      body: "Google Summer Internship application deadline is in 3 days",
      timestamp: new Date('2025-01-31T14:00:00'),
      type: "internship",
      read: false,
      actionUrl: "/internships"
    },
    {
      id: 6,
      title: "Weekly Summary",
      body: "You read 12 articles and applied to 3 jobs this week",
      timestamp: new Date('2025-01-30T09:00:00'),
      type: "summary",
      read: true,
      actionUrl: "/analytics"
    }
  ];

  useEffect(() => {
    // Simulate data loading (would use Firestore here)
    setTimeout(() => {
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 800);
  }, []);

  const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'job':
        return <Briefcase className={iconClass} />;
      case 'internship':
        return <GraduationCap className={iconClass} />;
      case 'news':
        return <Newspaper className={iconClass} />;
      case 'chat':
        return <MessageCircle className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getNotificationColor = (type) => {
    const colors = {
      job: 'bg-green-100 text-green-600',
      internship: 'bg-purple-100 text-purple-600',
      news: 'bg-blue-100 text-blue-600',
      chat: 'bg-pink-100 text-pink-600',
      application: 'bg-orange-100 text-orange-600',
      summary: 'bg-gray-100 text-gray-600'
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
          {unreadCount > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={markAllAsRead}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all read</span>
            </motion.button>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
        </p>
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Bell className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                  notification.read 
                    ? 'border-gray-100 opacity-75' 
                    : 'border-orange-200 shadow-sm'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-xl ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className={`font-semibold ${
                          notification.read ? 'text-gray-600' : 'text-gray-800'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                      
                      <p className={`text-sm leading-relaxed mb-2 ${
                        notification.read ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {notification.body}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                            >
                              Mark read
                            </motion.button>
                          )}
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;