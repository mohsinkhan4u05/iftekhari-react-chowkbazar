import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import { BookGrid } from "@components/product/book-grid";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CategoryBannerBook from "@containers/category-banner-book";
import { GetServerSideProps } from "next";

export default function Category() {
  return (
    <div className="border-t-2 border-borderBottom">
      <Container>
        <CategoryBannerBook />
        <div className="pb-16 lg:pb-20">
          <BookGrid className="3xl:grid-cols-6" />
        </div>
        <Subscription />
      </Container>
    </div>
  );
}

Category.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
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
