import React, { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { FiSearch, FiX, FiTag, FiFolder, FiGrid, FiList, FiFilter, FiChevronDown, FiArrowRight } from "react-icons/fi";
import BlogCard from "./BlogCard";

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
  createdAt: string;
  updatedAt: string;
}

interface BlogListProps {
  blogs: BlogPost[];
}

const BlogList: React.FC<BlogListProps> = ({ blogs }) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const allCategories = useMemo(() => {
    const categories = new Set(blogs.map((blog) => blog.category).filter(Boolean));
    return Array.from(categories);
  }, [blogs]);

  const allTags = useMemo(() => {
    const tags = new Set(blogs.flatMap((blog) => blog.tags).filter(Boolean));
    return Array.from(tags);
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch = searchTerm
        ? blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.author.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesCategory = selectedCategory
        ? blog.category === selectedCategory
        : true;

      const matchesTag = selectedTag ? blog.tags.includes(selectedTag) : true;

      // Only admins can see draft blogs
      const matchesStatus = isAdmin ? true : blog.status === "published";

      return matchesSearch && matchesCategory && matchesTag && matchesStatus;
    });
  }, [blogs, searchTerm, selectedCategory, selectedTag, isAdmin]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedTag(null);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setSelectedCategory(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedTag(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header and Filters */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top Row: Title, Search, View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Our Blog</h1>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-12 pr-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-red-500">
                    <FiX />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-accent text-white' : 'text-gray-600 dark:text-gray-300'}`}><FiGrid /></button>
                <button onClick={() => setViewMode("list")} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-accent text-white' : 'text-gray-600 dark:text-gray-300'}`}><FiList /></button>
              </div>
            </div>
          </div>

          {/* Filters and Active State */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiFilter className="text-gray-600 dark:text-gray-400" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
                <select onChange={(e) => handleCategoryClick(e.target.value)} value={selectedCategory || ''} className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">All Categories</option>
                  {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select onChange={(e) => handleTagClick(e.target.value)} value={selectedTag || ''} className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">All Tags</option>
                  {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                </select>
              </div>
            </div>
            
            {(selectedCategory || selectedTag) && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Active Filter:</span>
                <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded-full text-sm font-medium">
                  {selectedCategory && <FiFolder className="w-3 h-3" />}
                  {selectedTag && <FiTag className="w-3 h-3" />}
                  {selectedCategory || selectedTag}
                  <button onClick={clearFilters} className="ml-1 hover:text-red-500">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Blog Grid / List */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {filteredBlogs.length > 0 ? (
          <div
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "flex flex-col gap-8"
            }
          >
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onCategoryClick={handleCategoryClick}
                onTagClick={handleTagClick}
                showStatus={isAdmin}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FiSearch className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">No Articles Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't find any articles matching your filters. Try clearing them to see all posts.
            </p>
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 mx-auto bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Clear Filters and Show All
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogList;
