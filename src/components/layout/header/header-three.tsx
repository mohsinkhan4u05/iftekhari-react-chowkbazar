import React, { useRef } from "react";
import SearchIcon from "@components/icons/search-icon";
import { siteSettings } from "@settings/site-settings";
import HeaderMenu from "@components/layout/header/header-menu";
import Logo from "@components/ui/logo";
import { useUI } from "@contexts/ui.context";
import { ROUTES } from "@utils/routes";
import { useAddActiveScroll } from "@utils/use-add-active-scroll";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import LanguageSwitcher from "@components/ui/language-switcher";
import WishButton from "@components/ui/wish-button";
import { UserLineIcon } from "@components/icons/UserLineIcon";
import Link from "@components/ui/link";
import CategoryMenu from "@components/ui/category-menu";
const AuthMenu = dynamic(() => import("@components/layout/header/auth-menu"), {
  ssr: false,
});
const CartButton = dynamic(() => import("@components/cart/cart-button"), {
  ssr: false,
});

const { site_header } = siteSettings;
export default function Header() {
  const { openSidebar, setDrawerView, openModal, setModalView, isAuthorized } =
    useUI();
  const { t } = useTranslation();
  const siteHeaderRef = useRef<HTMLDivElement>(null);
  useAddActiveScroll(siteHeaderRef);
  function handleLogin() {
    setModalView("LOGIN_VIEW");
    return openModal();
  }
  function handleMobileMenu() {
    setDrawerView("MOBILE_MENU");
    return openSidebar();
  }
  return (
    <header
      id="siteHeader"
      ref={siteHeaderRef}
      className="relative z-20 w-full h-16 sm:h-20 lg:h-36 xl:h-40 headerThree"
    >
      <div className="fixed z-20 w-full h-16 px-4 text-gray-700 transition duration-200 ease-in-out bg-white innerSticky body-font sm:h-20 lg:h-36 xl:h-40 ltr:pl-4 rtl:pr-4 ltr:md:pl-0 rtl:md:pr-0 ltr:lg:pl-6 rtl:lg:pr-6 ltr:pr-4 ltr:lg:pr-6 rtl:pl-4 rtl:lg:pl-6 md:px-8 2xl:px-16">
        <div className="flex items-center justify-center mx-auto max-w-[1920px] h-full lg:h-20 xl:h-24 w-full relative before:absolute before:w-screen before:h-px before:bg-[#F1F1F1] before:bottom-0">
          <button
            aria-label="Menu"
            className="flex-col items-center justify-center flex-shrink-0 hidden h-full px-5 outline-none menuBtn md:flex lg:hidden 2xl:px-7 focus:outline-none"
            onClick={handleMobileMenu}
          >
            <span className="menuIcon">
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </span>
          </button>
          <div className="flex items-center ltr:2xl:mr-12 rtl:2xl:ml-12 ltr:3xl:mr-20 rtl:3xl:ml-20">
            <Logo />
            <div className="hidden transition-all duration-100 ease-in-out lg:flex ltr:ml-7 rtl:mr-7 ltr:xl:ml-9 rtl:xl:mr-9 ltr:pr-2 rtl:pl-2 headerTopMenu">
              {site_header.pagesMenu?.map((item: any) => (
                <Link
                  href={item.path}
                  className="relative flex items-center px-3 lg:px-2.5 py-0 text-sm font-normal xl:text-base text-heading xl:px-6 hover:text-black"
                  key={`pages-menu-${item.id}`}
                >
                  {t(`menu:${item.label}`)}
                  {item.icon && (
                    <span className="ltr:ml-1.5 rtl:mr-1.5 ltr:xl:ml-2 rtl:xl:mr-2">
                      {item.icon}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative hidden w-2/6 ltr:mr-auto rtl:ml-auto lg:block">
            <form
              className="relative w-full overflow-hidden rounded-md bg-borderBottom"
              noValidate
              role="search"
            >
              <label htmlFor="search" className="flex items-center">
                <span className="absolute top-0 left-0 flex items-center justify-center flex-shrink-0 w-12 h-full cursor-pointer md:w-14 focus:outline-none">
                  <SearchIcon
                    color="text-heading"
                    className="w-[18px] h-[18px]"
                  />
                </span>
                <input
                  id="search"
                  className="w-full text-sm placeholder-gray-400 bg-transparent rounded-md outline-none focus:border-2 focus:border-gray-600 ltr:pr-4 rtl:pl-4 ltr:pl-14 rtl:pr-14 h-14 text-heading lg:text-base"
                  placeholder={"Search Anything..."}
                  aria-label="Search"
                  autoComplete="off"
                />
              </label>
            </form>
          </div>
          <div className="flex flex-shrink-0 transition-all duration-200 ease-in-out transform ltr:ml-auto rtl:mr-auto ltr:mr-3 rtl:ml-3 ltr:lg:mr-5 rtl:lg:ml-5 ltr:xl:mr-8 rtl:xl:ml-8 ltr:2xl:mr-10 rtl:2xl:ml-10 languageSwitcher lg:hidden">
            <LanguageSwitcher />
          </div>
          <div className="flex items-center justify-end flex-shrink-0">
            <div className="flex items-center transition-all wishlistShopping gap-x-7 lg:gap-x-6 xl:gap-x-8 2xl:gap-x-10 ltr:pl-3 rtl:pr-3">
              <div className="flex md:gap-x-4 align-center ">
                <WishButton />
                <span className="hidden text-sm font-semibold transition-all duration-100 ease-in-out cursor-pointer lg:font-normal lg:block xl:text-base text-heading">
                  {t("menu:menu-wishlist")}
                </span>
              </div>
              <div className="hidden lg:flex md:gap-x-4 align-center">
                <CartButton />
                <span className="hidden text-sm font-semibold transition-all duration-100 ease-in-out cursor-pointer lg:font-normal lg:block xl:text-base text-heading">
                  {t("menu:menu-shopping")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="items-center hidden lg:flex lg:h-16 headerBottom mx-auto max-w-[1920px]">
          <div className="flex items-center">
            <CategoryMenu
              className="hidden lg:block"
              categoryMenu={site_header?.categoryMenu}
            />
            <HeaderMenu
              data={site_header.menu}
              className="hidden lg:flex ltr:pl-3.5 rtl:pr-3.5 ltr:xl:pl-5 rtl:xl:pr-5 "
            />
          </div>

          <div className="flex items-center flex-shrink-0 ltr:ml-auto rtl:mr-auto gap-x-7">
            <AuthMenu
              isAuthorized={isAuthorized}
              href={ROUTES.ACCOUNT}
              className="flex-shrink-0 hidden text-sm xl:text-base lg:flex focus:outline-none text-heading gap-x-3"
              btnProps={{
                children: (
                  <>
                    <UserLineIcon className="w-4 xl:w-[17px] h-auto text-black" />
                    {t("text-login")}
                  </>
                ),
                onClick: handleLogin,
              }}
            />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
