import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useBookmark } from "@/contexts/BookmarkContext";
import { OptimizedBookmarkButton } from "@/components/ui/optimized-bookmark-button";

export default function MyBookmarks() {
  const { data: session } = useSession();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { checkBookmarkStatuses, bookmarkStatuses } = useBookmark();

  useEffect(() => {
    if (session?.user) {
      const loadBookmarks = async () => {
        try {
          setLoading(true);
          const response = await fetch("/api/bookmarks/list");
          const data = await response.json();
          setBookmarks(data);
          
          // Extract book IDs for batch bookmark status checking
          const bookIds = data.map((bookmark: any) => bookmark.bookId);
          if (bookIds.length > 0) {
            await checkBookmarkStatuses(bookIds);
          }
        } catch (err) {
          console.error("Error loading bookmarks:", err);
        } finally {
          setLoading(false);
        }
      };
      
      loadBookmarks();
    } else {
      setLoading(false);
    }
  }, [session, checkBookmarkStatuses]);

  if (!session) {
    return (
      <div className="p-8 text-center">
        Please log in to see your bookmarks.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading your bookmarks...</span>
        </div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return <div className="p-8 text-center">No bookmarks found.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📚 My Bookmarked Books</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {bookmarks.map((bookmark: any) => (
          <div
            key={bookmark.bookId}
            className="border rounded-lg p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition"
          >
            <Image
              src={`https://admin.silsilaeiftekhari.in/${bookmark.Thumbnail}`}
              alt={bookmark.Name}
              width={80}
              height={100}
              className="object-cover rounded"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{bookmark.Name}</h2>
              <p className="text-sm text-gray-600">Author: {bookmark.Author}</p>
              <p className="text-sm text-gray-600">
                Saved Page: {bookmark.page + 1}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Link
                  href={`/books/${bookmark.Name}/${bookmark.bookId}`}
                  className="inline-block text-blue-600 hover:underline font-medium"
                >
                  ➡️ Continue Reading
                </Link>
                <OptimizedBookmarkButton
                  bookId={bookmark.bookId}
                  size="sm"
                  variant="outline"
                  className="ml-auto"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
