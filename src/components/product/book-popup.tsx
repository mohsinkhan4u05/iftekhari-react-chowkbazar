import React, { useState } from "react";
import { useRouter } from "next/router";
import { useUI } from "@contexts/ui.context";
import { useTranslation } from "next-i18next";
import { motion, AnimatePresence } from "framer-motion";
import BookmarkButton from "@components/ui/bookmark-button";
import { formatBookTitle } from "@utils/text-formatting";

export default function BookPopup() {
  const { t } = useTranslation("common");
  const {
    modalData: { data },
    closeModal,
  } = useUI();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { Name, ImagePath, Author, Translator, Views, TotalPages, CategoryName, Language, Rating } = data;
  const placeholderImage = `https://admin.silsilaeiftekhari.in/${ImagePath}`;

  async function navigateToBookPage() {
    try {
      // Trigger view count increment
      await fetch("/api/books/increment-views", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: data?.ID }),
      });
    } catch (error) {
      console.error("Failed to increment views:", error);
    }

    setIsLoading(true);
    
    // Shorter delay for better UX
    setTimeout(() => {
      closeModal();
      router.push(
        `/books/${Name.toLowerCase().replace(/\\s+/g, "-")}/${data?.ID}`
      );
    }, 800);
  }

  return (
    <div className="bg-white rounded-2xl w-full max-w-2xl mx-auto overflow-hidden shadow-2xl relative">

        <div className="flex flex-col md:flex-row">
          {/* Book Cover */}
          <div className="md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
            <div className="relative">
              <img
                src={placeholderImage ?? "/assets/placeholder/products/product-thumbnail.svg"}
                alt={Name}
                className="max-h-80 w-auto object-contain rounded-lg shadow-lg"
              />
              {/* Bookmark overlay */}
              <div className="absolute -top-2 -right-2">
                <BookmarkButton bookId={data?.ID} />
              </div>
            </div>
          </div>

          {/* Book Information */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
              {formatBookTitle(Name)}
            </h2>

            {/* Author */}
            {Author && (
              <div className="flex items-center text-gray-600 mb-4 text-lg">
                <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-500">by</span> <span className="font-medium ml-1">{Author}</span>
              </div>
            )}

            {/* Key Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {Language && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Language</span>
                    <span className="text-sm font-medium text-gray-900">{Language}</span>
                  </div>
                </div>
              )}
              
              {CategoryName && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Category</span>
                    <span className="text-sm font-medium text-gray-900">{CategoryName}</span>
                  </div>
                </div>
              )}
              
              {TotalPages && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Pages</span>
                    <span className="text-sm font-medium text-gray-900">{TotalPages}</span>
                  </div>
                </div>
              )}
              
              {Views && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Views</span>
                    <span className="text-sm font-medium text-gray-900">{Views.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Translator */}
            {Translator && (
              <div className="mb-6">
                <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Translator</span>
                <span className="text-sm font-medium text-gray-900">{Translator}</span>
              </div>
            )}

            {/* Rating */}
            {Rating && (
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(Rating) ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{Rating}/5</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-auto space-y-3">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-12 flex items-center justify-center bg-gray-100 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                      <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-75"></div>
                      <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={navigateToBookPage}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {t("text-read-book") || "Read Book"}
                  </motion.button>
                )}
              </AnimatePresence>
              
              <button
                onClick={closeModal}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}
