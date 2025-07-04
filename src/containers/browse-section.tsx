import { useState } from "react";
import SectionHeader from "@components/common/section-header";
import { useCategoriesBookQuery } from "@framework/category/get-all-categories-books";
import { useLanguagesBookQuery } from "@framework/language/get-all-languages-books";
import { ROUTES } from "@utils/routes";
import Link from "next/link";
import { motion } from "framer-motion";

interface BrowseSectionProps {
  className?: string;
  sectionHeading?: string;
}

const BrowseSection: React.FC<BrowseSectionProps> = ({
  className = "mb-7 md:mb-10 lg:mb-12 xl:mb-14 2xl:mb-[75px]",
  sectionHeading = "Browse Books",
}) => {
  const [activeTab, setActiveTab] = useState<"categories" | "languages">("categories");

  const { data: categoriesData, isLoading: categoriesLoading } = useCategoriesBookQuery({
    limit: 10,
  });

  const { data: languagesData, isLoading: languagesLoading } = useLanguagesBookQuery({
    limit: 10,
  });

  const categories = categoriesData?.categories?.data || [];
  const languages = languagesData?.languages?.data || [];

  // Category image mapping
  const getCategoryImage = (categoryName: string) => {
    const imageMap: { [key: string]: string } = {
      "Hadees": "/assets/images/category/books/Hadees.png",
      "Poetry": "/assets/images/category/books/Poetry-Kalaam.png", 
      "Tasawwuf": "/assets/images/category/books/Tasawwuf.png",
      "Biography": "/assets/images/category/books/Swan-e-Hayaat-Biography.png",
      "Wahdat": "/assets/images/category/books/Wahdat-Ul-Wajood.png",
      "Seerat": "/assets/images/category/Seerat.png",
      "Quran": "/assets/images/category/Quran.png",
      "Fiqh": "/assets/images/category/Fiqh.png",
    };
    
    return imageMap[categoryName] || "/assets/images/category/icons/quran.png";
  };

  // Language image mapping
  const getLanguageImage = (languageName: string) => {
    const langLower = languageName.toLowerCase();
    if (langLower.includes('english')) {
      return "/assets/images/category/icons/quran.png";
    } else if (langLower.includes('اردو') || langLower.includes('urdu')) {
      return "/assets/images/category/icons/quran1.png";
    } else if (langLower.includes('arabic') || langLower.includes('عربی')) {
      return "/assets/images/category/icons/quran.png";
    } else if (langLower.includes('persian') || langLower.includes('فارسی')) {
      return "/assets/images/category/icons/tasawwuf.png";
    }
    return "/assets/images/category/icons/quran.png";
  };

  return (
    <div className={className}>
      {/* CSS for hiding scrollbars */}
      <style jsx>{`
        .scroll-container::-webkit-scrollbar {
          display: none;
        }
        .scroll-container {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
      {/* Tab Pills on Left */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "categories"
                ? "bg-white text-heading shadow-sm"
                : "text-gray-600 hover:text-heading"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("languages")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "languages"
                ? "bg-white text-heading shadow-sm"
                : "text-gray-600 hover:text-heading"
            }`}
          >
            Languages
          </button>
        </div>
        
        {/* View All Link moved to header */}
        <Link
          href={ROUTES.BOOK}
          className="inline-flex items-center text-sm text-gray-600 hover:text-heading transition-colors duration-200"
        >
          View All
          <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Compact Content */}
      <div className="relative">
        {/* Categories Tab */}
        {activeTab === "categories" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="scroll-container flex gap-4 overflow-x-auto pb-4"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {categoriesLoading ? (
              // Compact Loading skeleton
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="flex-shrink-0 w-24 animate-pulse">
                  <div className="bg-gray-200 rounded-lg w-20 h-20 mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded mb-1"></div>
                  <div className="bg-gray-200 h-2 rounded w-12"></div>
                </div>
              ))
            ) : (
              categories.map((category) => (
                <Link
                  key={category.ID}
                  href={`${ROUTES.BOOK}?category=${category.Name}`}
                  className="flex-shrink-0 group text-center w-24 hover:scale-105 transition-transform duration-200"
                >
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 w-20 h-20 mb-2 mx-auto group-hover:shadow-md transition-shadow duration-200">
                    <img
                      src={getCategoryImage(category.Name)}
                      alt={category.Name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/assets/images/category/icons/quran.png";
                      }}
                    />
                  </div>
                  <h3 className="font-medium text-xs text-heading mb-1 truncate group-hover:text-accent transition-colors">
                    {category.Name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {category.productCount}
                  </p>
                </Link>
              ))
            )}
          </motion.div>
        )}

        {/* Languages Tab */}
        {activeTab === "languages" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="scroll-container flex gap-4 overflow-x-auto pb-4"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {languagesLoading ? (
              // Compact Loading skeleton
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="flex-shrink-0 w-24 animate-pulse">
                  <div className="bg-gray-200 rounded-lg w-20 h-20 mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded mb-1"></div>
                  <div className="bg-gray-200 h-2 rounded w-12"></div>
                </div>
              ))
            ) : (
              languages.map((language) => (
                <Link
                  key={language.ID}
                  href={`${ROUTES.BOOK}?language=${language.Name}`}
                  className="flex-shrink-0 group text-center w-24 hover:scale-105 transition-transform duration-200"
                >
                  <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 w-20 h-20 mb-2 mx-auto group-hover:shadow-md transition-shadow duration-200 flex items-center justify-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {language.Name === 'English' ? 'EN' : 
                       language.Name.includes('اردو') ? 'اردو' :
                       language.Name.includes('عربی') ? 'عربی' :
                       language.Name.includes('فارسی') ? 'فارسی' :
                       language.Name.charAt(0)}
                    </div>
                  </div>
                  <h3 className="font-medium text-xs text-heading mb-1 truncate group-hover:text-accent transition-colors">
                    {language.Name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {language.productCount}
                  </p>
                </Link>
              ))
            )}
          </motion.div>
        )}
      </div>

    </div>
  );
};

export default BrowseSection;
