import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiUser,
  FiFileText,
  FiTrendingUp,
  FiBookOpen,
  FiClock,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import Layout from "@components/layout/layout";
import Container from "@components/ui/container";
import withAdminAuth from "@components/auth/withAdminAuth";

interface Blog {
  id: string;
  title: string;
  slug: string;
  author: string;
  status: "draft" | "published";
  createdAt: string;
  coverImage: string;
  category?: string;
  summary?: string;
}

function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "published"
  >("all");
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  useEffect(() => {
    // Fetch blogs from API
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredBlogs = (blogs || []).filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: (blogs || []).length,
    published: (blogs || []).filter((blog) => blog.status === "published")
      .length,
    drafts: (blogs || []).filter((blog) => blog.status === "draft").length,
    thisMonth: (blogs || []).filter((blog) => {
      const blogDate = new Date(blog.createdAt);
      const now = new Date();
      return (
        blogDate.getMonth() === now.getMonth() &&
        blogDate.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog? This will move it to trash where it can be restored later.")) return;

    try {
      const res = await fetch(`/api/blogs/${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBlogs((blogs || []).filter((blog) => blog.slug !== slug));
        // Remove from selection if it was selected
        setSelectedBlogs((prev) =>
          prev.filter((selectedSlug) => selectedSlug !== slug)
        );
        
        // Show success notification
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2";
        notification.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          Blog moved to trash
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete blog");
      }
    } catch (error) {
      alert("Failed to delete blog");
    }
  };

  const handleStatusChange = async (
    slug: string,
    newStatus: "draft" | "published"
  ) => {
    try {
      const res = await fetch(`/api/blogs/${slug}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setBlogs(
          (blogs || []).map((blog) =>
            blog.slug === slug ? { ...blog, status: newStatus } : blog
          )
        );

        // Show success notification
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2";
        notification.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Blog status updated to ${newStatus}!
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      } else {
        alert("Failed to update blog status");
      }
    } catch (error) {
      alert("Failed to update blog status");
    }
  };

  const handleBulkStatusChange = async (status: "draft" | "published") => {
    if (selectedBlogs.length === 0) {
      alert("Please select blogs to update");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to change status of ${selectedBlogs.length} blog(s) to ${status}?`
      )
    ) {
      return;
    }

    setBulkActionLoading(true);
    try {
      const res = await fetch("/api/blogs/bulk-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: selectedBlogs, status }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state
        setBlogs(
          (blogs || []).map((blog) =>
            selectedBlogs.includes(blog.slug) ? { ...blog, status } : blog
          )
        );
        setSelectedBlogs([]);

        // Show success notification
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2";
        notification.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          ${data.updatedCount} blog(s) status updated to ${status}!
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      } else {
        alert("Failed to update blog status");
      }
    } catch (error) {
      alert("Failed to update blog status");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleSelectBlog = (slug: string, checked: boolean) => {
    if (checked) {
      setSelectedBlogs((prev) => [...prev, slug]);
    } else {
      setSelectedBlogs((prev) => prev.filter((s) => s !== slug));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBlogs(filteredBlogs.map((blog) => blog.slug));
    } else {
      setSelectedBlogs([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Blog Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create, edit, and manage your blog articles
            </p>
          </div>

          <Link
            href="/admin/blogs/create"
            className="inline-flex items-center gap-2 bg-accent text-green px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors font-medium mt-4 md:mt-0"
          >
            <FiPlus className="w-5 h-5" />
            Create New Article
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <FiFileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Articles
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <FiBookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Published
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.published}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                <FiClock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Drafts
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.drafts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <FiTrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  This Month
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.thisMonth}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters, Search and Bulk Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
              />
            </div>

            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "draft" | "published"
                  )
                }
                className="pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer min-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedBlogs.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                {selectedBlogs.length} article
                {selectedBlogs.length !== 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkStatusChange("published")}
                  disabled={bulkActionLoading}
                  className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {bulkActionLoading ? "Updating..." : "Publish All"}
                </button>
                <button
                  onClick={() => handleBulkStatusChange("draft")}
                  disabled={bulkActionLoading}
                  className="px-3 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {bulkActionLoading ? "Updating..." : "Draft All"}
                </button>
                <button
                  onClick={() => setSelectedBlogs([])}
                  className="px-3 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {filteredBlogs.length} article
            {filteredBlogs.length !== 1 ? "s" : ""} found
          </div>
        </div>

        {/* Blog List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {(blogs || []).length === 0
                  ? "Start by creating your first blog article."
                  : "Try adjusting your search or filter criteria."}
              </p>
              {(blogs || []).length === 0 && (
                <Link
                  href="/admin/blogs/create"
                  className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors font-medium"
                >
                  <FiPlus className="w-4 h-4" />
                  Create First Article
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <colgroup>
                  <col className="w-2/5 sm:w-1/2" />
                  <col className="w-1/6 sm:w-1/6" />
                  <col className="w-1/6 sm:w-1/6" />
                  <col className="w-1/6 sm:w-1/6" />
                  <col className="w-1/6 sm:w-1/12" />
                </colgroup>
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            selectedBlogs.length === filteredBlogs.length &&
                            filteredBlogs.length > 0
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <span className="hidden sm:inline">Article</span>
                        <span className="sm:hidden">Post</span>
                      </div>
                    </th>
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-medium text-gray-900 dark:text-white hidden sm:table-cell">
                      Author
                    </th>
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-medium text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-medium text-gray-900 dark:text-white hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-right py-3 px-3 sm:py-4 sm:px-6 font-medium text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredBlogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedBlogs.includes(blog.slug)}
                            onChange={(e) =>
                              handleSelectBlog(blog.slug, e.target.checked)
                            }
                            className="rounded border-gray-300 text-accent focus:ring-accent"
                          />
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={blog.coverImage}
                              alt={blog.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                              {blog.title}
                            </h3>
                            {blog.summary && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                                {blog.summary}
                              </p>
                            )}
                            {blog.category && (
                              <span className="inline-block bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs mt-2">
                                {blog.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <FiUser className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-gray-900 dark:text-white font-medium">
                              {blog.author}
                            </div>
                            {blog.authorEmail && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {blog.authorEmail}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={blog.status}
                          onChange={(e) =>
                            handleStatusChange(
                              blog.slug,
                              e.target.value as "draft" | "published"
                            )
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 appearance-none cursor-pointer focus:ring-2 focus:ring-accent ${
                            blog.status === "published"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                          }`}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FiCalendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/blogs/${blog.slug}`}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                            title="View Article"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/blogs/edit/${blog.slug}`}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                            title="Edit Article"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog.slug)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                            title="Delete Article"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

AdminBlogs.Layout = Layout;

export default withAdminAuth(AdminBlogs);
