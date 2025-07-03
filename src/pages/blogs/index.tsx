import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiArrowRight,
  FiSearch,
  FiFilter,
  FiTag,
  FiX,
  FiEye,
  FiMessageCircle,
} from "react-icons/fi";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import Layout from "@components/layout/layout";
import Container from "@components/ui/container";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs?status=published")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setFilteredBlogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter blogs based on search term, category, and tags
  useEffect(() => {
    let filtered = blogs;

    if (searchTerm) {
      filtered = filtered.filter((blog: any) => {
        const searchInTags = blog.tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return (
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          searchInTags
        );
      });
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (blog: any) => blog.category === selectedCategory
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((blog: any) =>
        blog.tags?.includes(selectedTag)
      );
    }

    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, selectedCategory, selectedTag]);

  // Get unique categories for filter
  const categories = [
    "all",
    ...new Set(blogs?.map((blog: any) => blog.category).filter(Boolean)),
  ];
  const featuredBlogs = filteredBlogs.slice(0, 3);
  const regularBlogs = filteredBlogs.slice(3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-accent/10 to-purple-600/10 py-20">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Discover Amazing
              <span className="text-accent block">Sufi Blogs & Articles</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Explore our collection of thoughtfully crafted sufi articles,
              poetries, and everything related to Sufism.
            </p>

            {/* Search and Filter Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search articles, authors, topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-12 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer min-w-[150px]"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all"
                          ? "All Categories"
                          : category.charAt(0).toUpperCase() +
                            category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedTag || selectedCategory !== "all") && (
                <div className="mt-4 flex flex-wrap items-center gap-2 justify-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Active filters:
                  </span>
                  {selectedCategory !== "all" && (
                    <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                      Category: {selectedCategory}
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className="ml-1 hover:text-red-500 transition-colors"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedTag && (
                    <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                      <FiTag className="w-3 h-3" />
                      {selectedTag}
                      <button
                        onClick={() => setSelectedTag("")}
                        className="ml-1 hover:text-red-500 transition-colors"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Results count */}
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                {filteredBlogs.length} article
                {filteredBlogs.length !== 1 ? "s" : ""} found
                {searchTerm && ` for "${searchTerm}"`}
                {selectedTag && ` with tag "${selectedTag}"`}
                {selectedCategory !== "all" && ` in "${selectedCategory}"`}
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-16">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search terms or filters to find what you're
                looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Featured Posts Section */}
              {featuredBlogs.length > 0 &&
                searchTerm === "" &&
                selectedCategory === "all" && (
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-1 h-8 bg-accent rounded-full"></div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Featured Articles
                      </h2>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                      {featuredBlogs.map((blog: any, index) => (
                        <Link key={blog.id} href={`/blogs/${blog.slug}`}>
                          <article
                            className={`group cursor-pointer h-full ${
                              index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                            }`}
                          >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                              <div
                                className={`relative w-full ${
                                  index === 0 ? "h-64 lg:h-80" : "h-48"
                                }`}
                              >
                                <Image
                                  src={blog.coverImage}
                                  alt={blog.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  sizes={
                                    index === 0
                                      ? "(max-width: 1024px) 100vw, 66vw"
                                      : "(max-width: 768px) 100vw, 33vw"
                                  }
                                  unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-colors" />
                                {blog.category && (
                                  <div className="absolute top-4 left-4">
                                    <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                                      {blog.category}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="p-6 flex-1 flex flex-col">
                                <h3
                                  className={`font-bold text-gray-900 dark:text-white mb-3 group-hover:text-accent transition-colors ${
                                    index === 0
                                      ? "text-2xl lg:text-3xl"
                                      : "text-xl"
                                  }`}
                                >
                                  {blog.title}
                                </h3>

                                {blog.summary && (
                                  <p
                                    className={`text-gray-600 dark:text-gray-300 mb-4 flex-1 ${
                                      index === 0
                                        ? "text-base line-clamp-4"
                                        : "text-sm line-clamp-3"
                                    }`}
                                  >
                                    {blog.summary}
                                  </p>
                                )}

                                {/* Tags */}
                                {blog.tags && blog.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {blog.tags
                                      .slice(0, 3)
                                      .map((tag: string, tagIndex: number) => (
                                        <button
                                          key={tagIndex}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedTag(tag);
                                          }}
                                          className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg text-xs font-medium hover:bg-accent hover:text-white transition-colors"
                                        >
                                          <FiTag className="w-3 h-3" />
                                          {tag}
                                        </button>
                                      ))}
                                    {blog.tags.length > 3 && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                                        +{blog.tags.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <FiUser className="w-4 h-4" />
                                      <span className="font-medium">
                                        {blog.author}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <FiCalendar className="w-4 h-4" />
                                      <span>
                                        {new Date(
                                          blog.createdAt
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                    {blog.viewCount > 0 && (
                                      <div className="flex items-center gap-2">
                                        <FiEye className="w-4 h-4" />
                                        <span>
                                          {blog.viewCount.toLocaleString()}{" "}
                                          views
                                        </span>
                                      </div>
                                    )}
                                    {blog.commentCount > 0 && (
                                      <div className="flex items-center gap-2">
                                        <FiMessageCircle className="w-4 h-4" />
                                        <span>
                                          {blog.commentCount.toLocaleString()}{" "}
                                          comments
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </article>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              {/* Regular Posts Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-8 bg-accent rounded-full"></div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {featuredBlogs.length > 0 &&
                    searchTerm === "" &&
                    selectedCategory === "all"
                      ? "More Articles"
                      : "All Articles"}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(featuredBlogs.length > 0 &&
                  searchTerm === "" &&
                  selectedCategory === "all"
                    ? regularBlogs
                    : filteredBlogs
                  ).map((blog: any) => (
                    <Link key={blog.id} href={`/blogs/${blog.slug}`}>
                      <article className="group cursor-pointer h-full">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <div className="relative h-48 w-full">
                            <Image
                              src={blog.coverImage}
                              alt={blog.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, 33vw"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:from-black/20 transition-colors" />
                            {blog.category && (
                              <div className="absolute top-3 left-3">
                                <span className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
                                  {blog.category}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-accent transition-colors line-clamp-2">
                              {blog.title}
                            </h3>

                            {blog.summary && (
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1 line-clamp-3">
                                {blog.summary}
                              </p>
                            )}

                            {/* Tags */}
                            {blog.tags && blog.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {blog.tags
                                  .slice(0, 2)
                                  .map((tag: string, tagIndex: number) => (
                                    <button
                                      key={tagIndex}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedTag(tag);
                                      }}
                                      className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg text-xs font-medium hover:bg-accent hover:text-white transition-colors"
                                    >
                                      <FiTag className="w-3 h-3" />
                                      {tag}
                                    </button>
                                  ))}
                                {blog.tags.length > 2 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                                    +{blog.tags.length - 2} more
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <FiUser className="w-4 h-4" />
                                  <span className="font-medium">
                                    {blog.author}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FiCalendar className="w-4 h-4" />
                                  <span>
                                    {new Date(
                                      blog.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                {blog.viewCount > 0 && (
                                  <div className="flex items-center gap-2">
                                    <FiEye className="w-4 h-4" />
                                    <span>
                                      {blog.viewCount.toLocaleString()} views
                                    </span>
                                  </div>
                                )}
                                {blog.commentCount > 0 && (
                                  <div className="flex items-center gap-2">
                                    <FiMessageCircle className="w-4 h-4" />
                                    <span>
                                      {blog.commentCount.toLocaleString()}{" "}
                                      comments
                                    </span>
                                  </div>
                                )}
                              </div>
                              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

BlogList.Layout = Layout;

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
