import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BlogDetail() {
  const { query } = useRouter();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    if (query.slug) {
      fetch(`/api/blogs/${query.slug}`)
        .then((res) => res.json())
        .then((data) => setBlog(data));
    }
  }, [query.slug]);

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        ✍️ {blog.author} · {new Date(blog.createdAt).toDateString()}
      </p>
      <img
        src={blog.coverImage}
        alt={blog.title}
        className="rounded-lg w-full mb-6"
      />
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
