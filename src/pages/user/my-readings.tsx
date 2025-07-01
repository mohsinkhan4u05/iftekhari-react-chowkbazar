import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Layout from "@components/layout/layout";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Text from "@components/ui/text";
import { toast } from "react-toastify";

export default function MyReadings() {
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

  const handleRemoveBookmark = async (bookId: string) => {
    try {
      const res = await fetch(`/api/bookmarks/${bookId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBookmarks((prev) => prev.filter((b) => b.bookId !== bookId));
        toast.success("Bookmark removed successfully ✅");
      } else {
        toast.error("Failed to remove bookmark ❌");
      }
    } catch (error) {
      console.error("Error while removing bookmark:", error);
      toast.error("Something went wrong while deleting ❌");
    }
  };

  if (!session) {
    return (
      <div className="p-8 text-center text-gray-700 dark:text-gray-300">
        Please log in to see your bookmarks.
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="p-8 text-center text-gray-700 dark:text-gray-300">
        No bookmarks found.
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Text
        variant="pageHeading"
        className="pb-6 text-3xl font-bold text-gray-800 dark:text-white"
      >
        My Readings
      </Text>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((bookmark: any) => (
          <div
            key={bookmark.bookId}
            className="flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
          >
            <div className="relative w-full h-52">
              <Image
                src={`https://admin.silsilaeiftekhari.in/${bookmark.Thumbnail}`}
                alt={bookmark.Name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col flex-grow px-4 py-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 truncate">
                {bookmark.Name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">
                Author: {bookmark.Author}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Saved Page:{" "}
                <span className="font-medium">{bookmark.page + 1}</span>
              </p>
              <div className="flex justify-end gap-4 mt-4">
                <Link
                  href={`/books/${bookmark.Name}/${bookmark.bookId}`}
                  className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  title="Continue Reading"
                >
                  📖 Continue
                </Link>
                <button
                  onClick={() => handleRemoveBookmark(bookmark.bookId)}
                  className="text-red-500 hover:underline text-sm flex items-center gap-1"
                  title="Remove Bookmark"
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

MyReadings.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        "common",
        "forms",
        "menu",
        "footer",
      ])),
    },
  };
};
