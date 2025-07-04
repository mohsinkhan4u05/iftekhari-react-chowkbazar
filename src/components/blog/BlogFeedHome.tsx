import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiUser, FiClock, FiArrowRight, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  coverImage: string;
  author: string;
  category?: string;
  status: 'published' | 'draft';
  viewCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogFeedHomeProps {
  limit?: number;
  className?: string;
  sectionHeading?: string;
  showViewAll?: boolean;
}

const BlogFeedHome: React.FC<BlogFeedHomeProps> = ({
  limit = 3,
  className = '',
  sectionHeading = 'Latest Articles',
  showViewAll = true,
}) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`/api/blogs?status=published`);
        if (response.ok) {
          const data = await response.json();
          // The API returns blogs directly as an array
          const blogsArray = Array.isArray(data) ? data : [];
          // Apply limit on frontend since API doesn't support limit parameter
          setBlogs(blogsArray.slice(0, limit));
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [limit]);

  const calculateReadingTime = (content: string): number => {
    const wordCount = content.replace(/<[^>]*>/g, '').split(' ').length;
    return Math.ceil(wordCount / 200); // Assuming 200 words per minute
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <div className={`blog-feed-home ${className}`}>
        {sectionHeading && (
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {sectionHeading}
            </h2>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className={`blog-feed-home ${className}`}>
        {sectionHeading && (
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {sectionHeading}
            </h2>
          </div>
        )}
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No articles available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`blog-feed-home ${className}`}>
      {/* Section Header */}
      {sectionHeading && (
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {sectionHeading}
          </h2>
          {showViewAll && (
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium group"
            >
              View All Articles
              <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      )}
      
      {/* View All Button for when no section heading */}
      {!sectionHeading && showViewAll && (
        <div className="flex justify-end mb-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium group"
          >
            View All Articles
            <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              {/* Featured Image */}
              <div className="relative h-48 overflow-hidden">
                <Link href={`/blogs/${blog.slug}`}>
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                </Link>
                {/* Category Badge */}
                {blog.category && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                      {blog.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Meta Information */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <FiUser className="w-3 h-3" />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-3 h-3" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                  <Link href={`/blogs/${blog.slug}`}>
                    {blog.title}
                  </Link>
                </h3>

                {/* Summary */}
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                  {truncateText(blog.summary || '', 120)}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FiClock className="w-3 h-3" />
                      <span>{calculateReadingTime(blog.content || blog.summary || '')} min read</span>
                    </div>
                    {blog.viewCount > 0 && (
                      <div className="flex items-center gap-1">
                        <FiEye className="w-3 h-3" />
                        <span>{blog.viewCount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="text-accent hover:text-accent/80 transition-colors text-sm font-medium"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </article>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      {showViewAll && blogs.length >= limit && (
        <div className="text-center mt-12">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-xl hover:bg-accent/90 transition-colors font-medium"
          >
            Explore All Articles
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogFeedHome;
