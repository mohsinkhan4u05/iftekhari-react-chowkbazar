// components/admin/BlogForm.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TiptapEditor from "../admin/TiptapEditor";

interface BlogFormProps {
  initialData?: any;
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    coverImage: "",
    content: "",
    author: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/blogs/${form.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("✅ Blog saved!");
      router.push("/blogs");
    } else {
      alert("❌ Failed to save blog");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl shadow"
    >
      <h1 className="text-2xl font-bold">
        📝 {initialData ? "Edit" : "Create"} Blog
      </h1>

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full p-3 border rounded"
        required
      />

      <input
        name="slug"
        placeholder="Slug"
        value={form.slug}
        onChange={handleChange}
        className="w-full p-3 border rounded"
        required
      />

      <textarea
        name="summary"
        placeholder="Summary"
        value={form.summary}
        onChange={handleChange}
        className="w-full p-3 border rounded"
        rows={3}
      />

      <input
        name="coverImage"
        placeholder="Cover Image URL"
        value={form.coverImage}
        onChange={handleChange}
        className="w-full p-3 border rounded"
      />

      <div>
        <label className="block font-medium mb-2">Content</label>
        <TiptapEditor
          content={form.content}
          onChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
        />
      </div>

      <input
        name="author"
        placeholder="Author"
        value={form.author}
        onChange={handleChange}
        className="w-full p-3 border rounded"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {initialData ? "Update Blog" : "Create Blog"}
      </button>
    </form>
  );
}
