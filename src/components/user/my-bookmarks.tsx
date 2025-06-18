import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function MyBookmarks() {
  const { data: session } = useSession();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/bookmarks/list")
        .then((res) => res.json())
        .then((data) => setBookmarks(data))
        .catch((err) => console.error("Error loading bookmarks:", err));
    }
  }, [session]);

  if (!session) {
    return (
      <div className="p-8 text-center">
        Please log in to see your bookmarks.
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
              <Link
                href={`/books/${bookmark.Name}/${bookmark.bookId}`}
                className="inline-block mt-2 text-blue-600 hover:underline"
              >
                ➡️ Continue Reading
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
