import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, ExternalLink, MapPin, Building, Calendar, Clock } from 'lucide-react';

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock internships data (would come from Firestore)
  const mockInternships = [
    {
      id: 1,
      title: "Software Engineering Intern",
      organization: "Google",
      location: "Mountain View, CA",
      duration: "3 months",
      stipend: "$8,000/month",
      apply_link: "https://example.com/intern1",
      posted_date: new Date('2025-01-15'),
      description: "Work on real projects with Google's engineering teams and gain hands-on experience in software development.",
      skills: ["Python", "Java", "Data Structures", "Algorithms"],
      type: "Summer 2025",
      remote: false
    },
    {
      id: 2,
      title: "UX Design Intern",
      organization: "Meta",
      location: "Menlo Park, CA",
      duration: "4 months",
      stipend: "$7,500/month",
      apply_link: "https://example.com/intern2",
      posted_date: new Date('2025-01-14'),
      description: "Design user experiences for billions of users across Meta's family of apps.",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      type: "Summer 2025",
      remote: true
    },
    {
      id: 3,
      title: "Data Science Intern",
      organization: "Netflix",
      location: "Los Gatos, CA",
      duration: "3 months",
      stipend: "$6,800/month",
      apply_link: "https://example.com/intern3",
      posted_date: new Date('2025-01-13'),
      description: "Analyze user data to improve content recommendations and viewing experiences.",
      skills: ["Python", "SQL", "Machine Learning", "Statistics"],
      type: "Summer 2025",
      remote: false
    },
    {
      id: 4,
      title: "Marketing Intern",
      organization: "Spotify",
      location: "New York, NY",
      duration: "6 months",
      stipend: "$4,500/month",
      apply_link: "https://example.com/intern4",
      posted_date: new Date('2025-01-12'),
      description: "Support marketing campaigns and analyze user engagement across global markets.",
      skills: ["Social Media", "Analytics", "Content Creation", "Market Research"],
      type: "Spring 2025",
      remote: true
    },
    {
      id: 5,
      title: "Product Management Intern",
      organization: "Amazon",
      location: "Seattle, WA",
      duration: "4 months",
      stipend: "$7,200/month",
      apply_link: "https://example.com/intern5",
      posted_date: new Date('2025-01-11'),
      description: "Drive product initiatives and work with cross-functional teams to deliver customer-focused solutions.",
      skills: ["Product Strategy", "Data Analysis", "Customer Research", "Agile"],
      type: "Summer 2025",
      remote: false
    }
  ];

  useEffect(() => {
    // Simulate data loading (would use Firestore here)
    setTimeout(() => {
      setInternships(mockInternships);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API refresh (would refetch from Firestore)
    setTimeout(() => {
      setInternships([...mockInternships].sort(() => Math.random() - 0.5));
      setIsRefreshing(false);
    }, 1500);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just posted';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getTypeColor = (type) => {
    const colors = {
      'Summer 2025': 'bg-orange-100 text-orange-700',
      'Spring 2025': 'bg-green-100 text-green-700',
      'Fall 2025': 'bg-red-100 text-red-700',
      'Winter 2025': 'bg-blue-100 text-blue-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with refresh */}
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Internships</h2>
          <p className="text-sm text-gray-500">{internships.length} opportunities available</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Internships list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {internships.map((internship, index) => (
          <motion.div
            key={internship.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {internship.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(internship.type)}`}>
                      {internship.type}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Building className="w-4 h-4 mr-2" />
                    <span className="font-medium">{internship.organization}</span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{internship.location}</span>
                    {internship.remote && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Remote Available
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-purple-600 font-semibold mb-1">
                    {internship.stipend}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {internship.duration}
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatTimeAgo(internship.posted_date)}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {internship.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {internship.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Duration:</span> {internship.duration}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(internship.apply_link, '_blank')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  <span className="text-sm font-medium">Apply Now</span>
                  <ExternalLink className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InternshipsPage;