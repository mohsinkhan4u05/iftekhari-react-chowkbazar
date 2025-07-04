import React from 'react';
import BlogFeedHome from '@components/blog/BlogFeedHome';
import FeaturedBlog from '@components/blog/FeaturedBlog';
import SectionHeader from '@components/common/section-header';

interface BlogSectionProps {
  className?: string;
  sectionHeading?: string;
  sectionSubHeading?: string;
  limit?: number;
  variant?: 'default' | 'minimal' | 'featured';
  showViewAll?: boolean;
  featuredBlogSlug?: string;
}

const BlogSection: React.FC<BlogSectionProps> = ({
  className = '',
  sectionHeading = 'Latest Articles',
  sectionSubHeading = 'Discover insights, knowledge, and inspiration from our latest blog posts',
  limit = 3,
  variant = 'default',
  showViewAll = true,
  featuredBlogSlug,
}) => {
  return (
    <div className={`blog-section ${className}`}>
      {variant === 'featured' ? (
        <>
          <FeaturedBlog
            sectionHeading="Featured Article"
            blogSlug={featuredBlogSlug}
            className="mb-12 lg:mb-16"
          />
          <BlogFeedHome
            limit={limit}
            sectionHeading="More Articles"
            showViewAll={showViewAll}
            className="w-full"
          />
        </>
      ) : variant === 'default' ? (
        <BlogFeedHome
          limit={limit}
          sectionHeading={sectionHeading}
          showViewAll={showViewAll}
          className="w-full"
        />
      ) : (
        <>
          <SectionHeader
            sectionHeading={sectionHeading}
            sectionSubHeading={sectionSubHeading}
            className="mb-8"
          />
          <BlogFeedHome
            limit={limit}
            showViewAll={showViewAll}
            sectionHeading="" // Empty heading to avoid duplication
            className="w-full"
          />
        </>
      )}
    </div>
  );
};

export default BlogSection;
