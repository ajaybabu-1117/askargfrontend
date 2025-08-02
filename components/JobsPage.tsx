import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, ExternalLink, MapPin, Building, Calendar, DollarSign } from 'lucide-react';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock jobs data (would come from Firestore)
  const mockJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$120k - $160k",
      type: "Full-time",
      apply_link: "https://example.com/job1",
      posted_date: new Date('2025-01-15'),
      description: "Join our team to build cutting-edge web applications using React, TypeScript, and modern tools.",
      requirements: ["React", "TypeScript", "5+ years experience"],
      remote: true
    },
    {
      id: 2,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "New York, NY",
      salary: "$100k - $140k",
      type: "Full-time",
      apply_link: "https://example.com/job2",
      posted_date: new Date('2025-01-14'),
      description: "Lead product strategy and development for our growing fintech platform.",
      requirements: ["Product Management", "Agile", "3+ years experience"],
      remote: false
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "AI Solutions Ltd",
      location: "Remote",
      salary: "$90k - $130k",
      type: "Full-time",
      apply_link: "https://example.com/job3",
      posted_date: new Date('2025-01-13'),
      description: "Analyze complex datasets and build machine learning models to drive business insights.",
      requirements: ["Python", "ML", "Statistics", "2+ years experience"],
      remote: true
    },
    {
      id: 4,
      title: "UX/UI Designer",
      company: "Creative Agency",
      location: "Los Angeles, CA",
      salary: "$70k - $95k",
      type: "Full-time",
      apply_link: "https://example.com/job4",
      posted_date: new Date('2025-01-12'),
      description: "Create beautiful and intuitive user experiences for web and mobile applications.",
      requirements: ["Figma", "Design Systems", "Portfolio", "2+ years experience"],
      remote: false
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudTech Corp",
      location: "Seattle, WA",
      salary: "$110k - $150k",
      type: "Full-time",
      apply_link: "https://example.com/job5",
      posted_date: new Date('2025-01-11'),
      description: "Build and maintain scalable cloud infrastructure using AWS and Kubernetes.",
      requirements: ["AWS", "Kubernetes", "Docker", "4+ years experience"],
      remote: true
    }
  ];

  useEffect(() => {
    // Simulate data loading (would use Firestore here)
    setTimeout(() => {
      setJobs(mockJobs);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API refresh (would refetch from Firestore)
    setTimeout(() => {
      setJobs([...mockJobs].sort(() => Math.random() - 0.5));
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with refresh */}
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Latest Jobs</h2>
          <p className="text-sm text-gray-500">{jobs.length} opportunities available</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Jobs list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {job.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Building className="w-4 h-4 mr-2" />
                    <span className="font-medium">{job.company}</span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{job.location}</span>
                    {job.remote && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Remote
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 font-semibold mb-1">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {job.salary}
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatTimeAgo(job.posted_date)}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.requirements.map((req, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {req}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  {job.type}
                </span>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(job.apply_link, '_blank')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200"
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

export default JobsPage;