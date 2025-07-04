import { useState } from "react";
import MyWishlist from "./user/my-wishlist";
import MyReadings from "./user/my-readings";
import Layout from "@components/layout/layout";
import { signIn, useSession } from "next-auth/react";
import { ImGoogle2 } from "react-icons/im";
import Button from "@components/ui/button";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { BookmarkProvider } from "@contexts/bookmark/bookmark.context";

export default function MyLibraryPage() {
  const [activeTab, setActiveTab] = useState<"wishlist" | "bookmarks">(
    "wishlist"
  );

  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                My Library
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Access your wishlist and reading progress
              </p>
            </div>

            <Button
              className="h-12 w-full bg-google hover:bg-googleHover text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-3"
              onClick={() => signIn("google")}
            >
              <ImGoogle2 className="text-lg" />
              Continue with Google
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BookmarkProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-16">
              {/* Tab Navigation */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
                    activeTab === "wishlist"
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Wishlist
                </button>
                <button
                  onClick={() => setActiveTab("bookmarks")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
                    activeTab === "bookmarks"
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  My Readings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "wishlist" ? <MyWishlist /> : <MyReadings />}
        </div>
      </div>
    </BookmarkProvider>
  );
}

MyLibraryPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
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
