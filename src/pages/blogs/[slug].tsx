import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiArrowLeft,
  FiShare2,
  FiEdit3,
  FiEye,
} from "react-icons/fi";
import Layout from "@components/layout/layout";
import Container from "@components/ui/container";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useViewTracker } from "../../hooks/useViewTracker";
import CommentsSection from "../../components/blog/CommentsSection";
import ShareModal from "../../components/blog/ShareModal";
import RecentPosts from "../../components/blog/RecentPosts";
import RelatedPosts from "../../components/blog/RelatedPosts";
import { makeContentResponsive } from "../../utils/makeVideosResponsive";
import {
  generateBlogSEO,
  optimizeImageForPlatform,
} from "../../utils/seoUtils";

export default function BlogDetail({
  blog,
  fullUrl,
}: {
  blog: any;
  fullUrl: string;
}) {
  const [readingTime, setReadingTime] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.email && session.user?.role === "admin";
  const router = useRouter();

  // Track view count
  useViewTracker({
    slug: blog?.slug,
    enabled: blog?.status === "published",
  });

  useEffect(() => {
    if (blog?.content) {
      const wordCount = blog.content.replace(/<[^>]*>/g, "").split(" ").length;
      setReadingTime(Math.ceil(wordCount / 200));
    }
  }, [blog]);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Article not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The article you're looking for doesn't exist.
          </p>
          <Link
            href="/blogs"
            className="bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const seoData = generateBlogSEO(blog, fullUrl);
  const whatsappOptimizedImage = optimizeImageForPlatform(
    blog.coverImage,
    "whatsapp"
  );

  return (
    <>
      <NextSeo
        title={seoData.title}
        description={seoData.description}
        canonical={seoData.url}
        openGraph={{
          type: "article",
          url: seoData.url,
          title: blog.title,
          description: seoData.description,
          site_name: seoData.siteName,
          images: [
            {
              url: whatsappOptimizedImage,
              width: seoData.image.width,
              height: seoData.image.height,
              alt: seoData.image.alt,
              type: seoData.image.type,
            },
          ],
        }}
        twitter={{
          handle: "@iftekhari_silsila",
          site: "@iftekhari_silsila",
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[
          { name: "author", content: blog.author || "Iftekhari Silsila" },
          { property: "article:published_time", content: blog.createdAt },
          { property: "article:modified_time", content: blog.updatedAt },
          {
            property: "article:author",
            content: blog.author || "Iftekhari Silsila",
          },
          { property: "article:section", content: blog.category || "Blog" },
          { name: "twitter:image", content: whatsappOptimizedImage },
          { property: "og:image:secure_url", content: whatsappOptimizedImage },
        ]}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Image + Info */}
        <div className="relative h-96 lg:h-[500px] w-full">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Container>
              <div className="max-w-4xl">
                <div className="flex items-center gap-3 mb-4">
                  {blog.category && (
                    <span className="inline-block bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                      {blog.category}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {blog.title}
                </h1>
                {blog.summary && (
                  <p className="text-xl text-gray-200 mb-6 max-w-3xl">
                    {blog.summary}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-6 text-gray-300">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-5 h-5" />
                    <span className="font-medium">{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-5 h-5" />
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {readingTime > 0 && (
                    <div className="flex items-center gap-2">
                      <FiClock className="w-5 h-5" />
                      <span>{readingTime} min read</span>
                    </div>
                  )}
                  {blog.viewCount > 0 && (
                    <div className="flex items-center gap-2">
                      <FiEye className="w-5 h-5" />
                      <span>{blog.viewCount.toLocaleString()} views</span>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </div>
        </div>

        {/* Main Content */}
        <Container>
          <div className="py-6 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6">
            {/* Share Button */}
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>

              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
              >
                <FiShare2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Article */}
            <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 lg:p-12">
                <div
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: makeContentResponsive(blog.content),
                  }}
                />
              </div>
            </article>

            {/* Author Bio */}
            {blog.authorBio && (
              <div className="mt-12 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  About the Author
                </h3>
                <div className="flex items-start gap-4">
                  {blog.authorAvatar && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={blog.authorAvatar}
                        alt={blog.author}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {blog.author}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {blog.authorBio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Comments, Related Posts, Recent Posts */}
            <CommentsSection
              blogSlug={blog.slug}
              commentCount={blog.commentCount || 0}
            />
            {blog.category && (
              <RelatedPosts
                currentPostSlug={blog.slug}
                category={blog.category}
                limit={3}
              />
            )}
            <RecentPosts currentPostSlug={blog.slug} limit={4} />
          </div>
        </Container>

        {/* Share Modal */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={blog.title}
          summary={blog.summary}
          url={fullUrl}
        />
      </div>
    </>
  );
}

BlogDetail.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;

  try {
    const res = await fetch(
      `https://www.silsilaeiftekhari.in/api/blogs/${slug}`
    );
    if (!res.ok) return { notFound: true };

    const blog = await res.json();

    return {
      props: {
        blog,
        fullUrl: `https://www.silsilaeiftekhari.in/blogs/${slug}`,
      },
    };
  } catch (err) {
    return { notFound: true };
  }
};
