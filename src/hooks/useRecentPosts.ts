import { useEffect, useState } from 'react';

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
}

interface UseRecentPostsProps {
  currentPostSlug?: string;
  limit?: number;
  category?: string;
}

interface UseRecentPostsReturn {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useRecentPosts = ({
  currentPostSlug,
  limit = 4,
  category
}: UseRecentPostsProps = {}): UseRecentPostsReturn => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/blogs?status=published');
      
      if (!response.ok) {
        throw new Error('Failed to fetch recent posts');
      }
      
      const allPosts = await response.json();
      
      // Filter posts based on criteria
      let filteredPosts = allPosts.filter((post: BlogPost) => {
        // Exclude current post if specified
        if (currentPostSlug && post.slug === currentPostSlug) {
          return false;
        }
        
        // Filter by category if specified
        if (category && post.category !== category) {
          return false;
        }
        
        return true;
      });
      
      // Limit results
      filteredPosts = filteredPosts.slice(0, limit);
      
      setPosts(filteredPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recent posts');
      console.error('Error fetching recent posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPostSlug, limit, category]);

  const refetch = () => {
    fetchPosts();
  };

  return {
    posts,
    loading,
    error,
    refetch
  };
};

export default useRecentPosts;
