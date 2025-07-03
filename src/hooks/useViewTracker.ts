import { useEffect, useRef } from 'react';

interface UseViewTrackerProps {
  slug: string;
  enabled?: boolean;
  delay?: number; // Delay in milliseconds before tracking the view
}

export const useViewTracker = ({ 
  slug, 
  enabled = true, 
  delay = 2000 // Default 2 seconds
}: UseViewTrackerProps) => {
  const trackedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled || !slug || trackedRef.current) {
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout to track view after delay
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/blogs/${slug}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          trackedRef.current = true;
          const data = await response.json();
          console.log(`View tracked for blog: ${slug}, new count: ${data.viewCount}`);
        }
      } catch (error) {
        console.error('Failed to track view:', error);
      }
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [slug, enabled, delay]);

  // Reset tracking when slug changes
  useEffect(() => {
    trackedRef.current = false;
  }, [slug]);
};

export default useViewTracker;
