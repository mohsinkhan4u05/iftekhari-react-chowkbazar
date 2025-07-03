import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  FiUser,
  FiMessageCircle,
  FiClock,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import UserAvatar from "../ui/UserAvatar";

interface CommentData {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
  level: number;
  parentCommentId?: number;
}

interface CommentProps {
  comment: CommentData;
  onReply: (parentId: number, content: string) => void;
  children?: React.ReactNode;
}

const Comment: React.FC<CommentProps> = ({ comment, onReply, children }) => {
  const { data: session } = useSession();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(comment.id, replyContent);
      setReplyContent("");
      setShowReplyForm(false);
    } catch (error) {
      console.error("Failed to submit reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const isReply = comment.level > 0;
  const hasChildren = React.Children.count(children) > 0;


  return (
    <div
      className={`${
        isReply
          ? "ml-8 border-l-2 border-gray-200 dark:border-gray-700 pl-4"
          : ""
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Comment Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <UserAvatar 
              name={comment.authorName} 
              size="md" 
            />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {comment.authorName}
              </h4>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <FiClock className="w-3 h-3" />
                <span>{formatDate(comment.createdAt)}</span>
              </div>
            </div>
          </div>

          {hasChildren && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-accent transition-colors"
            >
              {showReplies ? (
                <FiChevronUp className="w-4 h-4" />
              ) : (
                <FiChevronDown className="w-4 h-4" />
              )}
              {showReplies ? "Hide" : "Show"} replies
            </button>
          )}
        </div>

        {/* Comment Content */}
        <div className="mb-3">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>

        {/* Comment Actions */}
        <div className="flex items-center gap-4">
          {session?.user && !showReplyForm && (
            <button
              onClick={() => setShowReplyForm(true)}
              className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-accent transition-colors"
            >
              <FiMessageCircle className="w-4 h-4" />
              Reply
            </button>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <form onSubmit={handleReplySubmit} className="space-y-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${comment.authorName}...`}
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                rows={3}
                maxLength={500}
                required
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {replyContent.length}/500 characters
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyContent("");
                    }}
                    className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!replyContent.trim() || isSubmitting}
                    className="px-4 py-1 text-sm bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Posting..." : "Post Reply"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {hasChildren && showReplies && (
        <div className="mt-4 space-y-4">{children}</div>
      )}
    </div>
  );
};

export default Comment;
