import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, ExternalLink, Clock, Eye } from 'lucide-react';
import { FirestoreService } from '../services/firestoreService';

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data as fallback
  const mockArticles = [
    {
      id: 1,
      title: "Tech Industry Sees Record Growth in 2025",
      summary: "Major technology companies report unprecedented expansion in AI and machine learning sectors, creating thousands of new opportunities.",
      source: "TechNews Daily",
      url: "https://example.com/article1",
      timestamp: new Date('2025-01-15'),
      readCount: 1247,
      category: "Technology"
    },
    {
      id: 2,
      title: "Remote Work Trends Shaping the Future",
      summary: "Companies worldwide are adopting hybrid models, changing how we think about workplace culture and productivity.",
      source: "Business Weekly",
      url: "https://example.com/article2",
      timestamp: new Date('2025-01-14'),
      readCount: 892,
      category: "Business"
    },
    {
      id: 3,
      title: "Climate Tech Startups Receive Massive Funding",
      summary: "Green technology initiatives attract billions in investment as companies race to meet sustainability goals.",
      source: "Green Innovation",
      url: "https://example.com/article3",
      timestamp: new Date('2025-01-13'),
      readCount: 634,
      category: "Environment"
    }
  ];

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const firebaseArticles = await FirestoreService.getNewsArticles();
      
      if (firebaseArticles.length > 0) {
        // Add mock properties for Firebase articles
        const articlesWithMockData = firebaseArticles.map((article, index) => ({
          ...article,
          readCount: Math.floor(Math.random() * 2000) + 100,
          category: article.category || ['Technology', 'Business', 'Environment', 'Education', 'Healthcare'][index % 5]
        }));
        setArticles(articlesWithMockData);
      } else {
        // Use mock data if no Firebase articles
        setArticles(mockArticles);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      // Fallback to mock data
      setArticles(mockArticles);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadArticles();
    setIsRefreshing(false);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technology: 'bg-blue-100 text-blue-700',
      Business: 'bg-green-100 text-green-700',
      Environment: 'bg-emerald-100 text-emerald-700',
      Education: 'bg-purple-100 text-purple-700',
      Healthcare: 'bg-red-100 text-red-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with refresh */}
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Latest News</h2>
          <p className="text-sm text-gray-500">{articles.length} articles available</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* News list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
                <div className="flex items-center text-gray-400 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTimeAgo(article.timestamp)}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">
                {article.title}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {article.summary}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="font-medium">{article.source}</span>
                  {article.readCount && (
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {article.readCount.toLocaleString()}
                    </div>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(article.url, '_blank')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  <span className="text-sm font-medium">Read More</span>
                  <ExternalLink className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}

        {articles.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="text-4xl mb-4">📰</div>
            <p className="text-lg font-medium mb-2">No articles available</p>
            <p className="text-sm text-center">Check back later for the latest news</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;