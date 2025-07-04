import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { WishListSearchGridPagination } from "@components/product/wishlist-search-grid-pagination";
import Text from "@components/ui/text";
import { BookmarkProvider } from "@contexts/bookmark/bookmark.context";

export default function MyWishlist() {
  return (
    <BookmarkProvider>
      <Container>
        <div className="flex pt-8 pb-16 lg:pb-20">
          <div className="w-full">
            <Text
              variant="pageHeading"
              className="pb-6 text-3xl font-bold text-gray-800 dark:text-white"
            >
              My Wishlist
            </Text>

            {/* Wishlist Grid */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <WishListSearchGridPagination />
            </div>
          </div>
        </div>
        <Subscription />
      </Container>
    </BookmarkProvider>
  );
}

MyWishlist.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
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
