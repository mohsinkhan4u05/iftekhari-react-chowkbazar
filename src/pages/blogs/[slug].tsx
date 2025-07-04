import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiUser, FiCalendar, FiClock, FiArrowLeft, FiShare2, FiEdit3, FiEye } from "react-icons/fi";
import Layout from "@components/layout/layout";
import Container from "@components/ui/container";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useViewTracker } from "../../hooks/useViewTracker";
import CommentsSection from "../../components/blog/CommentsSection";
import ShareModal from "../../components/blog/ShareModal";
import RecentPosts from "../../components/blog/RecentPosts";
import RelatedPosts from "../../components/blog/RelatedPosts";
import { makeContentResponsive } from "../../utils/makeVideosResponsive";
import { generateBlogSEO, optimizeImageForPlatform } from "../../utils/seoUtils";

export default function BlogDetail() {
  const { query } = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.email && session.user?.role === 'admin';

  useEffect(() => {
    if (query.slug) {
      fetch(`/api/blogs/${query.slug}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Blog not found');
          }
          return res.json();
        })
        .then((data) => {
          setBlog(data);
          // Calculate reading time (assuming 200 words per minute)
          if (data.content) {
            const wordCount = data.content.replace(/<[^>]*>/g, '').split(' ').length;
            setReadingTime(Math.ceil(wordCount / 200));
          }
          setLoading(false);
        })
        .catch(() => {
          setBlog(null);
          setLoading(false);
        });
    }
  }, [query.slug]);

  // Track view count
  useViewTracker({
    slug: query.slug as string,
    enabled: blog?.status === 'published',
  });

  const handleShare = () => {
    setShowShareModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The article you're looking for doesn't exist.</p>
          <Link href="/blogs" className="bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Generate full URL for sharing
  const fullUrl = typeof window !== 'undefined' ? window.location.href : `https://www.silsilaeiftekhari.in/blogs/${blog.slug}`;
  
  // Generate SEO data using utilities
  const seoData = generateBlogSEO(blog, fullUrl);
  
  // Optimize image for WhatsApp sharing
  const whatsappOptimizedImage = optimizeImageForPlatform(blog.coverImage, 'whatsapp');
  
  return (
    <>
      <NextSeo
        title={seoData.title}
        description={seoData.description}
        canonical={seoData.url}
        openGraph={{
          type: 'article',
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
          handle: '@iftekhari_silsila',
          site: '@iftekhari_silsila',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'author',
            content: blog.author || 'Iftekhari Silsila',
          },
          {
            property: 'article:published_time',
            content: blog.createdAt,
          },
          {
            property: 'article:modified_time',
            content: blog.updatedAt,
          },
          {
            property: 'article:author',
            content: blog.author || 'Iftekhari Silsila',
          },
          {
            property: 'article:section',
            content: blog.category || 'Blog',
          },
          {
            name: 'twitter:image',
            content: whatsappOptimizedImage,
          },
          {
            property: 'og:image:secure_url',
            content: whatsappOptimizedImage,
          },
        ]}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Container>
          <div className="py-3 px-4 sm:py-4 sm:px-6">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <Link 
                href="/blogs" 
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors text-sm sm:text-base"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
              
              {/* Draft indicator and admin actions */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {blog?.status === 'draft' && (
                  <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                    <FiEye className="w-3 h-3" />
                    Draft Preview
                  </span>
                )}
                
                {isAdmin && blog && (
                  <Link
                    href={`/admin/blogs/edit/${blog.slug}`}
                    className="inline-flex items-center gap-2 bg-accent text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-accent/90 transition-colors text-xs sm:text-sm font-medium"
                  >
                    <FiEdit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Edit Article</span>
                    <span className="sm:hidden">Edit</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Hero Section */}
      <div className="relative">
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
          
          {/* Article Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Container>
              <div className="max-w-4xl">
                <div className="flex items-center gap-3 mb-4">
                  {blog.category && (
                    <span className="inline-block bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                      {blog.category}
                    </span>
                  )}
                  {blog.status === 'draft' && (
                    <span className="inline-block bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Draft
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
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-gray-300">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-5 h-5" />
                    <span className="font-medium">{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-5 h-5" />
                    <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
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
      </div>

      {/* Article Content */}
      <Container>
        <div className="py-6 sm:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm gap-4 sm:gap-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
                >
                  <FiShare2 className="w-4 h-4" />
                  Share
                </button>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Published {new Date(blog.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Article Content */}
            <article className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-12">
                <div 
                  className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-accent prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-accent prose-pre:bg-gray-100 dark:prose-pre:bg-gray-700 prose-blockquote:border-accent prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-img:rounded-lg prose-video:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: makeContentResponsive(blog.content) }} 
                />
              </div>
            </article>

            {/* Author Bio Section (if available) */}
            {blog.authorBio && (
              <div className="mt-12 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About the Author</h3>
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
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{blog.author}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{blog.authorBio}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-12 text-center p-8 bg-gradient-to-br from-accent/10 to-purple-600/10 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Enjoyed this article?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Discover more insightful articles and stay updated with our latest content.
              </p>
              <Link 
                href="/blogs" 
                className="inline-block bg-accent text-white px-8 py-3 rounded-xl hover:bg-accent/90 transition-colors font-medium"
              >
                Read More Articles
              </Link>
            </div>

            {/* Comments Section */}
            <CommentsSection 
              blogSlug={query.slug as string} 
              commentCount={blog.commentCount || 0} 
            />
            
            {/* Related Posts Section (same category) */}
            {blog.category && (
              <RelatedPosts 
                currentPostSlug={blog.slug} 
                category={blog.category}
                limit={3}
              />
            )}
            
            {/* Recent Posts Section */}
            <RecentPosts currentPostSlug={blog.slug} limit={4} />
          </div>
        </div>
      </Container>
      
      {/* Share Modal */}
      {blog && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={blog.title}
          summary={blog.summary}
          url={typeof window !== 'undefined' ? window.location.href : ''}
        />
      )}
    </div>
    </>
  );
}

BlogDetail.Layout = Layout;
