import Link from "next/link";
import Layout from "@components/layout/layout";

export default function AdminBlogs() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">📚 Admin - Blogs</h1>

      <Link href="/admin/blogs/create">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          ➕ Create New Blog
        </button>
      </Link>
    </div>
  );
}

AdminBlogs.Layout = Layout;
