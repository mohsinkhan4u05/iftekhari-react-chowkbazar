import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">📝 Latest Blogs</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blogs/${blog.slug}`}>
            <div className="rounded-xl border shadow hover:shadow-md transition overflow-hidden bg-white dark:bg-gray-800">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                width={500}
                height={300}
                className="object-cover w-full h-48"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">{blog.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {blog.summary}
                </p>
                <span className="text-xs text-gray-500">
                  ✍️ {blog.author} · {new Date(blog.createdAt).toDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
