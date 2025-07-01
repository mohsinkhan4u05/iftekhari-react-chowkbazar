import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { WishListSearchGridPagination } from "@components/product/wishlist-search-grid-pagination";
import Text from "@components/ui/text";

export default function MyWishlist() {
  return (
    <Container>
      <div className={`flex pt-8 pb-16 lg:pb-20`}>
        <div className="w-full ltr:lg:-ml-9 rtl:lg:-mr-9">
          {/* <SearchTopBar /> */}
          <Text
            variant="pageHeading"
            className="pb-6 text-3xl font-bold text-gray-800 dark:text-white"
          >
            My Wishlist
          </Text>
          <WishListSearchGridPagination />
        </div>
      </div>
      <Subscription />
    </Container>
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
