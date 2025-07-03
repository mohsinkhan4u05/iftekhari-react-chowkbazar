import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiCalendar,
  FiUser,
  FiTag,
  FiClock,
  FiArrowRight,
  FiFolder,
  FiEye,
  FiMessageCircle,
} from "react-icons/fi";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  viewCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogCardProps {
  blog: BlogPost;
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
  showStatus?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  onCategoryClick,
  onTagClick,
  showStatus = false,
}) => {
  const readingTime = Math.ceil((blog.summary?.length || 0) / 200);
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Cover Image */}
      {blog.coverImage && (
        <div className="relative h-48 overflow-hidden">
          <Link href={`/blogs/${blog.slug}`}>
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          </Link>
          
          {/* Status Badge */}
          {showStatus && (
            <div className="absolute top-3 right-3">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  blog.status === "published"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}
              >
                {blog.status}
              </span>
            </div>
          )}
          
          {/* Category Badge */}
          {blog.category && (
            <div className="absolute top-3 left-3">
              <button
                onClick={() => onCategoryClick?.(blog.category)}
                className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                <FiFolder className="w-3 h-3 inline mr-1" />
                {blog.category}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-accent transition-colors">
          <Link href={`/blogs/${blog.slug}`}>
            {blog.title}
          </Link>
        </h3>

        {/* Summary */}
        {blog.summary && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {blog.summary}
          </p>
        )}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <button
                key={index}
                onClick={() => onTagClick?.(tag)}
                className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg text-xs font-medium hover:bg-accent hover:text-white transition-colors"
              >
                <FiTag className="w-3 h-3" />
                {tag}
              </button>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <FiUser className="w-4 h-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <FiClock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
            {blog.viewCount > 0 && (
              <div className="flex items-center gap-1">
                <FiEye className="w-4 h-4" />
                <span>{blog.viewCount.toLocaleString()} views</span>
              </div>
            )}
            {blog.commentCount > 0 && (
              <div className="flex items-center gap-1">
                <FiMessageCircle className="w-4 h-4" />
                <span>{blog.commentCount.toLocaleString()} comments</span>
              </div>
            )}
          </div>
        </div>

        {/* Read More Link */}
        <Link
          href={`/blogs/${blog.slug}`}
          className="inline-flex items-center gap-2 text-accent font-medium hover:text-accent/80 transition-colors group"
        >
          Read More
          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
