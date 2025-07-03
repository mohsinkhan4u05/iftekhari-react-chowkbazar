import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiClock, FiEye, FiArrowRight } from 'react-icons/fi';
import { useRecentPosts } from '../../hooks/useRecentPosts';

interface RecentPostsProps {
  currentPostSlug: string;
  limit?: number;
}

const RecentPosts: React.FC<RecentPostsProps> = ({ currentPostSlug, limit = 4 }) => {
  const { posts: recentPosts, loading, error } = useRecentPosts({
    currentPostSlug,
    limit
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content?.replace(/<[^>]*>/g, '').split(' ').length || 0;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Recent Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400 text-center">
          {error}
        </p>
      </div>
    );
  }

  if (recentPosts.length === 0) {
    return (
      <div className="mt-12 p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No recent posts available.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Recent Posts
        </h2>
        <Link 
          href="/blogs" 
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium"
        >
          View All
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recentPosts.map((post) => (
          <article 
            key={post.id} 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
          >
            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {/* Category Badge */}
                {post.category && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  <span>{calculateReadingTime(post.summary)} min read</span>
                </div>
                {post.viewCount > 0 && (
                  <div className="flex items-center gap-1">
                    <FiEye className="w-4 h-4" />
                    <span>{post.viewCount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                <Link href={`/blogs/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>

              {/* Summary */}
              {post.summary && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {post.summary}
                </p>
              )}

              {/* Author & Read More */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  By {post.author}
                </span>
                <Link 
                  href={`/blogs/${post.slug}`}
                  className="text-accent hover:text-accent/80 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  Read More
                  <FiArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* View All Button (Mobile) */}
      <div className="mt-8 text-center md:hidden">
        <Link 
          href="/blogs"
          className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors font-medium"
        >
          View All Posts
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default RecentPosts;
