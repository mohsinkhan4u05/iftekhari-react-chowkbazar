import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import { ShopFilters } from "@components/shop/filters";
import StickyBox from "react-sticky-box";
import { BookSearchGridPagination } from "@components/product/book-search-grid-pagination";
import SearchTopBar from "@components/shop/top-bar";
import ActiveLink from "@components/ui/active-link";
import { BreadcrumbItems } from "@components/common/breadcrumb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ROUTES } from "@utils/routes";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { BookCountProvider } from "@contexts/book/book-count.context";

export default function Books() {
  const { t } = useTranslation("common");

  return (
    <>
      {/* <ShopDiscount /> */}
      <BookCountProvider>
        <Container>
          <div className={`flex pt-8 pb-16 lg:pb-20`}>
            <div className="flex-shrink-0 ltr:pr-24 rtl:pl-24 hidden lg:block w-96">
              <StickyBox offsetTop={50} offsetBottom={20}>
                <div className="pb-7">
                  <BreadcrumbItems separator="/">
                    <ActiveLink
                      href={"/"}
                      activeClassName="font-semibold text-heading"
                    >
                      {t("breadcrumb-home")}
                    </ActiveLink>
                    <ActiveLink
                      href={ROUTES.BOOK}
                      activeClassName="font-semibold text-heading"
                      className="capitalize"
                    >
                      {t("breadcrumb-books")}
                    </ActiveLink>
                  </BreadcrumbItems>
                </div>
                <ShopFilters />
              </StickyBox>
            </div>

            <div className="w-full ltr:lg:-ml-9 rtl:lg:-mr-9">
              <SearchTopBar />
              <BookSearchGridPagination />
            </div>
          </div>
          <Subscription />
        </Container>
      </BookCountProvider>
    </>
  );
}

Books.Layout = Layout;

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
