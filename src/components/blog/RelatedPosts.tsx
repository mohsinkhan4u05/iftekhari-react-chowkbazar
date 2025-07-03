import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiClock, FiEye, FiArrowRight, FiFolder } from 'react-icons/fi';
import { useRecentPosts } from '../../hooks/useRecentPosts';

interface RelatedPostsProps {
  currentPostSlug: string;
  category: string;
  limit?: number;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPostSlug, category, limit = 3 }) => {
  const { posts: relatedPosts, loading, error } = useRecentPosts({
    currentPostSlug,
    category,
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
          <FiFolder className="w-6 h-6 text-accent" />
          Related Posts in {category}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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

  if (relatedPosts.length === 0) {
    return null; // Don't show anything if no related posts
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiFolder className="w-6 h-6 text-accent" />
          Related Posts in {category}
        </h2>
        <Link 
          href={`/blogs?category=${encodeURIComponent(category)}`}
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium"
        >
          View All
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
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
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                <Link href={`/blogs/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>

              {/* Summary */}
              {post.summary && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">
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
                  Read
                  <FiArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
