import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiCalendar,
  FiUser,
  FiTag,
  FiClock,
  FiArrowLeft,
  FiFolder,
  FiShare2,
  FiEdit,
  FiEye,
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import ShareModal from "./ShareModal";
import { makeContentResponsive } from "../../utils/makeVideosResponsive";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  authorEmail: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

interface BlogDetailProps {
  blog: BlogPost;
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
  onBack?: () => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({
  blog,
  onCategoryClick,
  onTagClick,
  onBack,
}) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [showShareModal, setShowShareModal] = React.useState(false);
  
  const readingTime = Math.ceil(
    (blog.content?.replace(/<[^>]*>/g, "").split(" ").length || 0) / 200
  );
  
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleShare = () => {
    setShowShareModal(true);
  };

  return (
    <article className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <button
            onClick={onBack || (() => window.history.back())}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Blogs
          </button>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {blog.status === "draft" && (
              <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
                <FiEye className="w-3 h-3 inline mr-1" />
                Draft
              </span>
            )}
            
            {isAdmin && (
              <Link
                href={`/admin/blogs/edit/${blog.slug}`}
                className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
              >
                <FiEdit className="w-4 h-4" />
                Edit
              </Link>
            )}
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
            >
              <FiShare2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="relative h-48 sm:h-64 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              unoptimized
            />
            {/* Category Badge on Image */}
            {blog.category && (
              <div className="absolute top-4 left-4">
                <button
                  onClick={() => onCategoryClick?.(blog.category)}
                  className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-accent/90 transition-colors backdrop-blur-sm"
                >
                  <FiFolder className="w-4 h-4 inline mr-2" />
                  {blog.category}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          {/* Category (if no cover image) */}
          {blog.category && !blog.coverImage && (
            <button
              onClick={() => onCategoryClick?.(blog.category)}
              className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-accent/90 transition-colors mb-4"
            >
              <FiFolder className="w-4 h-4" />
              {blog.category}
            </button>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {blog.title}
          </h1>

          {/* Summary */}
          {blog.summary && (
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {blog.summary}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <FiUser className="w-5 h-5" />
              <span className="font-medium">{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="w-5 h-5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="w-5 h-5" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => onTagClick?.(tag)}
                  className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent hover:text-white transition-colors"
                >
                  <FiTag className="w-4 h-4" />
                  {tag}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <div
            className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-accent hover:prose-a:text-accent/80 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-accent prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-700 prose-img:rounded-lg prose-video:rounded-lg"
            dangerouslySetInnerHTML={{ __html: makeContentResponsive(blog.content) }}
          />
        </div>

        {/* Article Footer */}
        <footer className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Filed under:
              </span>
              {blog.category && (
                <button
                  onClick={() => onCategoryClick?.(blog.category)}
                  className="text-accent hover:text-accent/80 text-sm font-medium transition-colors"
                >
                  {blog.category}
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
              >
                <FiShare2 className="w-4 h-4" />
                Share Article
              </button>
            </div>
          </div>

          {/* Related Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Related Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => onTagClick?.(tag)}
                    className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-accent hover:text-white transition-colors"
                  >
                    <FiTag className="w-3 h-3" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </footer>
      </div>
      
      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={blog.title}
        summary={blog.summary}
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
    </article>
  );
};

export default BlogDetail;
