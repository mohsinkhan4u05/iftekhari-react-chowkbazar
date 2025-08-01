import Link from "@components/ui/link";
import SearchIcon from "@components/icons/search-icon";
import UserIcon from "@components/icons/user-icon";
import MenuIcon from "@components/icons/menu-icon";
import HomeIcon from "@components/icons/home-icon";
import { useUI } from "@contexts/ui.context";
import { useRouter } from "next/router";
import { ROUTES } from "@utils/routes";
import dynamic from "next/dynamic";
import { Drawer } from "@components/common/drawer/drawer";
import { getDirection } from "@utils/get-direction";
import motionProps from "@components/common/drawer/motion";
import { signIn, signOut, useSession } from "next-auth/react";
import UserMenu from "@components/my-account/user-menu";
const CartButton = dynamic(() => import("@components/cart/cart-button"), {
  ssr: false,
});
const AuthMenu = dynamic(() => import("@components/layout/header/auth-menu"), {
  ssr: false,
});
const MobileMenu = dynamic(
  () => import("@components/layout/header/mobile-menu")
);

const BottomNavigation: React.FC = () => {
  const {
    openSidebar,
    closeSidebar,
    displaySidebar,
    // setDrawerView,
    openSearch,
    openModal,
    setModalView,
    isAuthorized,
  } = useUI();

  function handleLogin() {
    setModalView("LOGIN_VIEW");
    return openModal();
  }
  function handleMobileMenu() {
    return openSidebar();
  }

  const { locale } = useRouter();
  const dir = getDirection(locale);
  const contentWrapperCSS = dir === "ltr" ? { left: 0 } : { right: 0 };
  const { data: session } = useSession();

  return (
    <>
      <div className="lg:hidden fixed z-10 bottom-0 flex items-center justify-between shadow-bottomNavigation text-gray-700 body-font bg-white w-full h-14 sm:h-16 px-4 md:px-8">
        <button
          aria-label="Menu"
          className="menuBtn flex flex-col items-center justify-center flex-shrink-0 outline-none focus:outline-none"
          onClick={handleMobileMenu}
        >
          <MenuIcon />
        </button>
        <button
          className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none"
          onClick={openSearch}
          aria-label="search-button"
        >
          <SearchIcon />
        </button>
        <Link href="/" className="flex-shrink-0">
          <HomeIcon />
        </Link>
        {session && (
          <div>
            <UserMenu />
          </div>
        )}
        {!session && (
          <AuthMenu
            isAuthorized={isAuthorized}
            href={ROUTES.ACCOUNT}
            className="flex-shrink-0"
            btnProps={{
              className: "flex-shrink-0 focus:outline-none",
              children: <UserIcon />,
              onClick: handleLogin,
            }}
          >
            <UserIcon />
          </AuthMenu>
        )}
      </div>
      {/* TODO: need to use just one drawer component */}
      <Drawer
        placement={dir === "rtl" ? "right" : "left"}
        open={displaySidebar}
        onClose={closeSidebar}
        styles={{
          wrapper: contentWrapperCSS,
        }}
        {...motionProps}
      >
        <MobileMenu />
      </Drawer>
    </>
  );
};

export default BottomNavigation;
