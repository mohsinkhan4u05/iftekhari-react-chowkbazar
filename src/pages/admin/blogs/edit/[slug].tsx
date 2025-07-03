import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]";
import Layout from "@components/layout/layout";
import BlogForm from "@components/blog/BlogForm";
import { FiArrowLeft, FiLoader } from "react-icons/fi";
import Link from "next/link";
import withAdminAuth from "@components/auth/withAdminAuth";
import Container from "@components/ui/container";

interface EditBlogPageProps {
  blogData?: any;
  error?: string;
}

function EditBlogPage({ blogData, error }: EditBlogPageProps) {
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState(!blogData && !error);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Blog Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Blog Management
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-accent mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading blog data...
          </p>
        </div>
      </div>
    );
  }

  // Parse tags if they're stored as JSON string
  const processedBlogData = blogData
    ? {
        ...blogData,
        tags: blogData.tags
          ? typeof blogData.tags === "string"
            ? JSON.parse(blogData.tags)
            : blogData.tags
          : [],
      }
    : null;

  return (
    <Container>
      <div className="py-8">
        <BlogForm initialData={processedBlogData} />
      </div>
    </Container>
  );
}

EditBlogPage.Layout = Layout;

export default withAdminAuth(EditBlogPage);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.email) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  const { slug } = context.params!;

  try {
    // We'll fetch the blog data on the server side
    const protocol = context.req.headers["x-forwarded-proto"] || "http";
    const host = context.req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      headers: {
        Cookie: context.req.headers.cookie || "",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          props: {
            error: `Blog with slug "${slug}" not found.`,
          },
        };
      }
      throw new Error(`Failed to fetch blog: ${response.status}`);
    }

    const blogData = await response.json();

    return {
      props: {
        blogData,
      },
    };
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return {
      props: {
        error: "Failed to load blog data. Please try again.",
      },
    };
  }
};
