import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Layout from "@components/layout/layout";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Text from "@components/ui/text";

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Text variant="pageHeading" className="lg:inline-flex pb-3">
        My Readings
      </Text>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((bookmark: any) => (
          <div
            key={bookmark.bookId}
            className="bg-white dark:bg-gray-800 border rounded-xl p-4 shadow-sm hover:shadow-md transition flex gap-4"
          >
            <div className="w-24 h-32 relative flex-shrink-0">
              <Image
                src={`https://admin.silsilaeiftekhari.in/${bookmark.Thumbnail}`}
                alt={bookmark.Name}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{bookmark.Name}</h2>
              <p className="truncate mb-1 text-sm text-gray-600 dark:text-gray-300">
                Author: {bookmark.Author}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
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
