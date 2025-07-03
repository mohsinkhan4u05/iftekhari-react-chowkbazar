import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import {
  FiMessageCircle,
  FiUser,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import Comment from "./Comment";
import UserAvatar from "../ui/UserAvatar";

interface CommentData {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
  level: number;
  parentCommentId?: number;
}

interface CommentsSectionProps {
  blogSlug: string;
  commentCount: number;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  blogSlug,
  commentCount,
}) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load comments
  useEffect(() => {
    const loadComments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/blogs/${blogSlug}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          throw new Error("Failed to load comments");
        }
      } catch (error) {
        console.error("Error loading comments:", error);
        setError("Failed to load comments");
      } finally {
        setIsLoading(false);
      }
    };

    if (blogSlug) {
      loadComments();
    }
  }, [blogSlug]);

  // Submit new comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/blogs/${blogSlug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        setNewComment("");
        // Reload comments to show the new one
        const commentsResponse = await fetch(`/api/blogs/${blogSlug}/comments`);
        if (commentsResponse.ok) {
          const data = await commentsResponse.json();
          setComments(data);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post comment");
      }
    } catch (error: any) {
      console.error("Error posting comment:", error);
      setError(error.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle replies
  const handleReply = async (parentId: number, content: string) => {
    if (!content.trim()) return;

    try {
      const response = await fetch(`/api/blogs/${blogSlug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, parentCommentId: parentId }),
      });

      if (response.ok) {
        // Reload comments to show the new reply
        const commentsResponse = await fetch(`/api/blogs/${blogSlug}/comments`);
        if (commentsResponse.ok) {
          const data = await commentsResponse.json();
          setComments(data);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post reply");
      }
    } catch (error: any) {
      console.error("Error posting reply:", error);
      setError(error.message || "Failed to post reply");
    }
  };

  // Build comment tree
  const buildCommentTree = (comments: CommentData[]) => {
    const commentMap = new Map<
      number,
      CommentData & { children: CommentData[] }
    >();
    const rootComments: (CommentData & { children: CommentData[] })[] = [];

    // First pass: create map of all comments
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, children: [] });
    });

    // Second pass: build tree structure
    comments.forEach((comment) => {
      const commentWithChildren = commentMap.get(comment.id)!;
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          parent.children.push(commentWithChildren);
        }
      } else {
        rootComments.push(commentWithChildren);
      }
    });

    return rootComments;
  };

  const renderComment = (
    comment: CommentData & { children: CommentData[] }
  ) => (
    <Comment key={comment.id} comment={comment} onReply={handleReply}>
      {comment.children.map((child) => renderComment(child))}
    </Comment>
  );

  const commentTree = buildCommentTree(comments);

  return (
    <section className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3">
          <FiMessageCircle className="w-6 h-6 text-accent" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Comments ({commentCount})
          </h3>
        </div>
      </div>

      <div className="p-6">
        {/* Comment Form */}
        {session?.user ? (
          <div className="mb-8">
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div className="flex items-start gap-3">
                <UserAvatar 
                  name={session.user?.name || session.user?.email || "User"}
                  image={session.user?.image}
                  size="lg"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                    rows={4}
                    maxLength={1000}
                    required
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {newComment.length}/1000 characters
                    </span>
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isSubmitting}
                      className="px-6 py-2 bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting && (
                        <FiLoader className="w-4 h-4 animate-spin" />
                      )}
                      {isSubmitting ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                <FiAlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="w-8 h-8 text-accent" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Join the conversation
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sign in to share your thoughts and engage with other readers.
            </p>
            <button
              onClick={() => signIn()}
              className="bg-accent text-black px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Sign In to Comment
            </button>
          </div>
        )}

        {/* Comments List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="w-8 h-8 animate-spin text-accent" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Loading comments...
            </span>
          </div>
        ) : commentTree.length > 0 ? (
          <div className="space-y-6">
            {commentTree.map((comment) => renderComment(comment))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiMessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No comments yet
            </h4>
            <p className="text-gray-500 dark:text-gray-500">
              Be the first to share your thoughts on this article.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentsSection;
