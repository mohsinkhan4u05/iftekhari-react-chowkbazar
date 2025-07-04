import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiUser, FiClock, FiArrowRight, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  status: 'published' | 'draft';
  viewCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface FeaturedBlogProps {
  className?: string;
  sectionHeading?: string;
  blogSlug?: string; // If specified, fetch this specific blog
}

const FeaturedBlog: React.FC<FeaturedBlogProps> = ({
  className = '',
  sectionHeading = 'Featured Article',
  blogSlug,
}) => {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        let url = '/api/blogs?status=published';
        if (blogSlug) {
          url = `/api/blogs/${blogSlug}`;
        }
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (blogSlug) {
            // Single blog endpoint returns the blog directly
            setBlog(data);
          } else {
            // List endpoint returns array, get first one
            const blogsArray = Array.isArray(data) ? data : [];
            setBlog(blogsArray[0] || null);
          }
        }
      } catch (error) {
        console.error('Error fetching featured blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogSlug]);

  const calculateReadingTime = (content: string): number => {
    const wordCount = content.replace(/<[^>]*>/g, '').split(' ').length;
    return Math.ceil(wordCount / 200);
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
      <div className={`featured-blog ${className}`}>
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {sectionHeading}
          </h2>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="w-full h-64 lg:h-96 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="p-8">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={`featured-blog ${className}`}>
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {sectionHeading}
          </h2>
        </div>
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No featured article available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`featured-blog ${className}`}>
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {sectionHeading}
        </h2>
      </div>

      {/* Featured Article */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="group"
      >
        <article className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Featured Image */}
            <div className="relative h-64 lg:h-96 overflow-hidden">
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
                <div className="absolute top-6 left-6">
                  <span className="inline-block bg-accent text-white px-4 py-2 rounded-full text-sm font-medium">
                    {blog.category}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              {/* Meta Information */}
              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <FiUser className="w-4 h-4" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="w-4 h-4" />
                  <span>{calculateReadingTime(blog.content)} min read</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-accent transition-colors">
                <Link href={`/blogs/${blog.slug}`}>
                  {blog.title}
                </Link>
              </h3>

              {/* Summary */}
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                {truncateText(blog.summary || '', 200)}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  {blog.viewCount > 0 && (
                    <div className="flex items-center gap-2">
                      <FiEye className="w-4 h-4" />
                      <span>{blog.viewCount.toLocaleString()} views</span>
                    </div>
                  )}
                  {blog.commentCount > 0 && (
                    <div className="flex items-center gap-2">
                      <span>{blog.commentCount} comments</span>
                    </div>
                  )}
                </div>
                
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors font-medium group"
                >
                  Read Article
                  <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </motion.div>
    </div>
  );
};

export default FeaturedBlog;
