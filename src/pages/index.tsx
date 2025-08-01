import HeroSlider from "@containers/hero-slider";
import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import ProductsFeatured from "@containers/products-featured";
import BannerBlockAncient from "@containers/banner-block-ancient";
import BrandBlock from "@containers/brand-block";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { ancientHeroBanner } from "@framework/static/banner";
import NewArrivalsBookFeed from "@components/product/feeds/new-arrivals-book-feed";
import PopularProductFeed from "@components/product/feeds/popular-product-feed";
import TestimonialCarousel from "@containers/testimonial-carousel";
import Instagram from "@components/common/instagram";
import DownloadApps from "@components/common/download-apps";
import BrowseSection from "@containers/browse-section";
import CompactBookFeed from "@components/product/feeds/compact-book-feed";
import ProductsFlashSaleBlock from "@containers/product-flash-sale-block";
import HireDesignerAncient from "@containers/buy-designer-ancient";
import CategoryBlock from "@containers/category-block";
import BlogSection from "@containers/blog-section";

export default function Home() {
  const sectionCommonStyle = "mb-7 md:mb-10 lg:mb-12 xl:mb-14 2xl:mb-[75px]";

  return (
    <>
      {/* <HeroSlider
        data={ancientHeroBanner}
        variantRounded="default"
        variant="fullWidth"
        className={sectionCommonStyle}
        buttonGroupClassName="hidden"
      /> */}

      <Container>
        <BrowseSection
          sectionHeading="Browse Books"
          className={sectionCommonStyle}
        />
        {/* <CategoryBlockBook
          type="rounded"
          sectionHeading="Browse Categories"
          roundedItemCount={5}
          roundedSpaceBetween={8}
          imgSize="large"
          demoVariant="ancient"
          disableBorderRadius={true}
          className={`${sectionCommonStyle} lg:pb-1 xl:pb-0`}
        /> */}

        <CompactBookFeed
          type="popular"
          limit={20}
          sectionHeading="Popular Books"
          className={sectionCommonStyle}
          showViewAll={true}
        />

        <CompactBookFeed
          type="editor-choice"
          limit={20}
          sectionHeading="Editors Choice"
          className={sectionCommonStyle}
          showViewAll={true}
        />

        <CompactBookFeed
          type="new-arrival"
          limit={20}
          sectionHeading="New Arrivals"
          className={sectionCommonStyle}
          showViewAll={true}
        />

        {/* Blog Section */}
        <BlogSection
          sectionHeading="Latest Articles"
          sectionSubHeading="Explore our latest insights, knowledge, and inspiration"
          limit={3}
          variant="minimal"
          showViewAll={true}
          className={sectionCommonStyle}
        />

        {/* <BannerBlockAncient
          disableBorderRadius={true}
          largeFirst={true}
          dataVariant="two"
          demoVariant="ancient"
          className={sectionCommonStyle}
        /> */}

        {/* <ProductsFeatured
          sectionHeading="text-featured-products"
          limit={4}
          variant="modern"
          hideBanner={true}
          demoVariant="ancient"
          disableBorderRadius={true}
          className={sectionCommonStyle}
        />

        <BannerBlockAncient
          // className={`${sectionCommonStyle} lg:pb-1 xl:pb-0`}
          disableBorderRadius={true}
          demoVariant="ancient"
          spaceBetween={10}
          className={sectionCommonStyle}
        />

        <BrandBlock
          disableBorderRadius={true}
          sectionHeading="text-top-brands"
          showName={false}
          demoVariant="ancient"
          className={"mb-[14px] md:mb-6 lg:mb-7 xl:mb-8 2xl:mb-[45px]"}
        />

        <ProductsFlashSaleBlock
          itemVariant="listSmall"
          disableSectionBorder={true}
          disableSectionPadding={true}
          hideCountdown={true}
          limit={8}
          TwoXlCols={4}
          demoVariant="ancient"
          disableBorderRadius={true}
          className={sectionCommonStyle}
          bgGray={true}
        /> */}
      </Container>

      {/* <HireDesignerAncient /> */}

      {/* <Container>
        <PopularProductFeed
          disableBorderRadius={true}
          demoVariant="ancient"
          className={sectionCommonStyle}
        />

        <DownloadApps
          disableBorderRadius={true}
          className={`bg-app-pattern ${sectionCommonStyle}`}
          variant="ancient"
        />

        <TestimonialCarousel
          sectionHeading="text-testimonial"
          type="list"
          className="relative mb-12 md:mb-14 xl:mb-16"
          disableBoarderRadius={true}
          reduceCardSpacing={true}
          demoVariant="ancient"
        />

        <Instagram
          disableContainerBorderRadius={true}
          className={`mb-11 lg:mb-12 xl:mb-14 2xl:mb-[75px] md:gap-[7px]`}
        />

        <Subscription
          disableBorderRadius={true}
          className="bg-opacity-0 px-5 sm:px-16 xl:px-0 mb-12 md:mb-14 xl:mb-16 !py-0 !md:py-0 !lg:py-0"
        />
      </Container> */}
    </>
  );
}

Home.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        "common",
        "forms",
        "menu",
        "footer",
      ])),
    },
  };
};
