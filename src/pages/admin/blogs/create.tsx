import Layout from "@components/layout/layout";
import BlogForm from "@components/blog/BlogForm";

export default function CreateBlogPage() {
  return (
    <div className="py-10 px-4">
      <BlogForm />
    </div>
  );
}

CreateBlogPage.Layout = Layout;
