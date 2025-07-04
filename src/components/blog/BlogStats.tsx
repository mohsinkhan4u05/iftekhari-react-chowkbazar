import React, { useEffect, useState } from 'react';
import { FiBook, FiEye, FiMessageCircle, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface BlogStatsData {
  totalArticles: number;
  totalViews: number;
  totalComments: number;
  totalAuthors: number;
}

interface BlogStatsProps {
  className?: string;
}

const BlogStats: React.FC<BlogStatsProps> = ({ className = '' }) => {
  const [stats, setStats] = useState<BlogStatsData>({
    totalArticles: 0,
    totalViews: 0,
    totalComments: 0,
    totalAuthors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/blogs/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching blog stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const statsItems = [
    {
      icon: FiBook,
      label: 'Articles',
      value: stats.totalArticles,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: FiEye,
      label: 'Total Views',
      value: stats.totalViews,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: FiMessageCircle,
      label: 'Comments',
      value: stats.totalComments,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: FiUsers,
      label: 'Authors',
      value: stats.totalAuthors,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  if (loading) {
    return (
      <div className={`blog-stats ${className}`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`blog-stats ${className}`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${item.bgColor}`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {item.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(item.value)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlogStats;
