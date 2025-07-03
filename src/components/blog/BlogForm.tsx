import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  FiSave,
  FiEye,
  FiArrowLeft,
  FiCamera,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiLoader,
  FiFileText,
  FiTag,
  FiUser,
  FiImage,
  FiType,
} from "react-icons/fi";
import DynamicTiptapEditor from "../admin/DynamicTiptapEditor";

interface BlogFormProps {
  initialData?: any;
}

interface FormErrors {
  title?: string;
  slug?: string;
  summary?: string;
  coverImage?: string;
  content?: string;
  author?: string;
  category?: string;
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    coverImage: "",
    content: "",
    author: "",
    authorEmail: "",
    category: "",
    tags: [] as string[],
    status: "draft" as "draft" | "published",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      // Parse tags if they come as a JSON string from the database
      let parsedTags = [];
      if (initialData.tags) {
        if (typeof initialData.tags === "string") {
          try {
            parsedTags = JSON.parse(initialData.tags);
          } catch (error) {
            console.warn("Failed to parse tags:", error);
            parsedTags = [];
          }
        } else if (Array.isArray(initialData.tags)) {
          parsedTags = initialData.tags;
        }
      }

      setForm({
        title: initialData.title || "",
        slug: initialData.slug || "",
        summary: initialData.summary || "",
        coverImage: initialData.coverImage || "",
        content: initialData.content || "",
        author: initialData.author || "",
        authorEmail: initialData.authorEmail || "",
        category: initialData.category || "",
        tags: parsedTags,
        status: initialData.status || "draft",
      });
    }
  }, [initialData]);

  // Auto-populate author and email from session
  useEffect(() => {
    if (session?.user && !initialData) {
      setForm((prev) => ({
        ...prev,
        author: session.user.name || session.user.email || "",
        authorEmail: session.user.email || "",
      }));
    }
  }, [session, initialData]);

  // Auto-generate slug from title
  useEffect(() => {
    if (form.title && !initialData) {
      const slug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setForm((prev) => ({ ...prev, slug }));
    }
  }, [form.title, initialData]);

  // Calculate word count and reading time
  useEffect(() => {
    if (form.content) {
      const text = form.content.replace(/<[^>]*>/g, "");
      const words = text.split(/\s+/).filter((word) => word.length > 0).length;
      setWordCount(words);
      setReadingTime(Math.ceil(words / 200)); // 200 words per minute
    }
  }, [form.content]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.slug.trim()) newErrors.slug = "Slug is required";
    if (!form.author.trim()) newErrors.author = "Author is required";
    if (!form.content.trim()) newErrors.content = "Content is required";
    if (!form.coverImage.trim())
      newErrors.coverImage = "Cover image is required";
    if (form.summary.length > 300)
      newErrors.summary = "Summary must be less than 300 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (res.ok) {
        const data = await res.json();
        setForm({ ...form, coverImage: data.url });
        setTimeout(() => setUploadProgress(0), 1000);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      setUploadProgress(0);
      alert("Failed to upload image");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));
    if (imageFile) {
      handleImageUpload(imageFile);
    }
  };

  const addTag = () => {
    const trimmedTag = currentTag.trim();
    
    if (trimmedTag && !form.tags.includes(trimmedTag)) {
      const newTags = [...form.tags, trimmedTag];
      setForm((prev) => ({ ...prev, tags: newTags }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Get the current form state at submission time to avoid stale closure
    setForm((currentForm) => {
      // Submit with current form state
      submitFormData(currentForm);
      return currentForm; // Don't change the state, just use it
    });
  };

  const submitFormData = async (formData: typeof form) => {
    try {
      const res = await fetch(`/api/blogs/${formData.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Success notification
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2";
        notification.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Blog ${initialData ? "updated" : "created"} successfully!
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);

        router.push("/blogs");
      } else {
        throw new Error("Failed to save blog");
      }
    } catch (error) {
      alert("❌ Failed to save blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Preview Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setPreviewMode(false)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Editor
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Preview Mode
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="max-w-4xl mx-auto p-6">
          {form.coverImage && (
            <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
              <Image
                src={form.coverImage}
                alt={form.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {form.category && (
            <span className="inline-block bg-accent text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
              {form.category}
            </span>
          )}

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {form.title || "Untitled Article"}
          </h1>

          {form.summary && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {form.summary}
            </p>
          )}

          <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <FiUser className="w-5 h-5" />
              <span>{form.author || "Anonymous"}</span>
            </div>
            {readingTime > 0 && (
              <div className="flex items-center gap-2">
                <FiFileText className="w-5 h-5" />
                <span>{readingTime} min read</span>
              </div>
            )}
          </div>

          <article className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: form.content || "<p>Start writing your content...</p>",
              }}
            />
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {initialData ? "Edit Article" : "Create New Article"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{wordCount} words</span>
                <span>{readingTime} min read</span>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={() => setPreviewMode(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
              >
                <FiEye className="w-4 h-4" />
                Preview
              </button>

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as "draft" | "published",
                  })
                }
                className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>

              <button
                type="submit"
                form="blog-form"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-accent text-black px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <FiLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <FiSave className="w-4 h-4" />
                )}
                {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form id="blog-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <FiType className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Article Title
                  </h2>
                </div>
                <input
                  name="title"
                  placeholder="Enter your article title..."
                  value={form.title}
                  onChange={handleChange}
                  className={`w-full p-4 text-2xl font-bold border-2 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 transition-colors ${
                    errors.title
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                  required
                />
                {errors.title && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.title}
                  </div>
                )}
              </div>

              {/* Slug */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <FiFileText className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    URL Slug
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    yoursite.com/blogs/
                  </span>
                  <input
                    name="slug"
                    placeholder="article-url-slug"
                    value={form.slug}
                    onChange={handleChange}
                    className={`flex-1 p-3 border-2 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 transition-colors ${
                      errors.slug
                        ? "border-red-500"
                        : "border-gray-200 dark:border-gray-600"
                    }`}
                    required
                  />
                </div>
                {errors.slug && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.slug}
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FiFileText className="w-5 h-5 text-accent" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Summary
                    </h2>
                  </div>
                  <span
                    className={`text-sm ${
                      form.summary.length > 300
                        ? "text-red-500"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {form.summary.length}/300
                  </span>
                </div>
                <textarea
                  name="summary"
                  placeholder="Write a brief summary of your article..."
                  value={form.summary}
                  onChange={handleChange}
                  className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 transition-colors resize-none ${
                    errors.summary
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                  rows={4}
                  maxLength={300}
                />
                {errors.summary && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.summary}
                  </div>
                )}
              </div>

              {/* Cover Image */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <FiImage className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Cover Image
                  </h2>
                </div>

                {form.coverImage ? (
                  <div className="relative">
                    <div className="relative h-48 rounded-xl overflow-hidden">
                      <Image
                        src={form.coverImage}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, coverImage: "" })}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={() => setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      isDragging
                        ? "border-accent bg-accent/10"
                        : errors.coverImage
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <FiCamera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Drag and drop an image here, or click to select
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 bg-accent dark:border-gray-600 dark:text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
                      >
                        <FiCamera className="w-4 h-4 text-gray" />
                        Choose File
                      </button>
                      <span className="text-gray-500 dark:text-gray-400">
                        or
                      </span>
                      <input
                        name="coverImage"
                        placeholder="Enter image URL"
                        value={form.coverImage}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-white placeholder-gray-500"
                      />
                    </div>

                    {uploadProgress > 0 && (
                      <div className="mt-4">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-accent h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                />

                {errors.coverImage && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.coverImage}
                  </div>
                )}
              </div>

              {/* Content Editor */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <FiFileText className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Content
                  </h2>
                  {wordCount > 0 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                      {wordCount} words • {readingTime} min read
                    </span>
                  )}
                </div>
                <div
                  className={
                    errors.content ? "ring-2 ring-red-500 rounded-lg" : ""
                  }
                >
                  <DynamicTiptapEditor
                    content={form.content}
                    onChange={(value) => {
                      setForm((prev) => ({ ...prev, content: value }));
                      if (errors.content) {
                        setErrors({ ...errors, content: undefined });
                      }
                    }}
                  />
                </div>
                {errors.content && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.content}
                  </div>
                )}
              </div>

              {/* Bottom Submit Button - Backup for accessibility */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Ready to {initialData ? "update" : "publish"} your article?
                  </div>
                  <button
                    type="submit"
                    form="blog-form"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isSubmitting ? (
                      <FiLoader className="w-5 h-5 animate-spin" />
                    ) : (
                      <FiSave className="w-5 h-5" />
                    )}
                    {isSubmitting
                      ? "Saving..."
                      : initialData
                      ? "Update Article"
                      : "Create Article"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author & Meta */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FiUser className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Author & Meta
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author
                  </label>
                  <input
                    name="author"
                    placeholder="Author name"
                    value={form.author}
                    onChange={handleChange}
                    className={`w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 transition-colors ${
                      errors.author
                        ? "border-red-500"
                        : "border-gray-200 dark:border-gray-600"
                    }`}
                    required
                  />
                  {errors.author && (
                    <div className="flex items-center gap-2 mt-1 text-red-500 text-sm">
                      <FiAlertCircle className="w-3 h-3" />
                      {errors.author}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    name="category"
                    placeholder="e.g. Technology, Business"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FiTag className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tags
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    placeholder="Add a tag"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="flex-1 p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="bg-accent text-white px-3 py-2 rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {form.tags.length === 0 && (
                  <div className="text-sm text-gray-500 italic">
                    No tags added yet. Type a tag above and press Enter or click Add.
                  </div>
                )}
              </div>
            </div>

            {/* Article Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Article Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Word count:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {wordCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Reading time:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {readingTime} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Characters:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {form.content.replace(/<[^>]*>/g, "").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Status:
                  </span>
                  <span
                    className={`font-medium capitalize ${
                      form.status === "published"
                        ? "text-green-600 dark:text-green-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {form.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
