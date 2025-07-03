import { useState } from "react";
import Link from "@components/ui/link";
import { siteSettings } from "@settings/site-settings";
import Scrollbar from "@components/common/scrollbar";
import { IoIosArrowDown } from "react-icons/io";
import Logo from "@components/ui/logo";
import { useUI } from "@contexts/ui.context";
import {
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoYoutube,
  IoClose,
} from "react-icons/io5";
import { useTranslation } from "next-i18next";
import { useSession } from "next-auth/react";
import { 
  FiSettings, 
  FiEdit3, 
  FiPlus, 
  FiList,
  FiFileText,
  FiChevronRight
} from "react-icons/fi";

const social = [
  {
    id: 0,
    link: "https://www.facebook.com/bismil.iftekhari/",
    icon: <IoLogoFacebook />,
    className: "facebook",
    title: "text-facebook",
  },
  {
    id: 1,
    link: "https://www.youtube.com/user/silsilaiftekhari",
    icon: <IoLogoYoutube />,
    className: "youtube",
    title: "text-youtube",
  },
  {
    id: 2,
    link: "https://www.instagram.com/iftekhari.silsila/",
    icon: <IoLogoInstagram />,
    className: "instagram",
    title: "text-instagram",
  },
];

export default function MobileMenu() {
  const [activeMenus, setActiveMenus] = useState<any>([]);
  const { site_header } = siteSettings;
  const { closeSidebar } = useUI();
  const { t } = useTranslation("menu");
  const { data: session } = useSession();
  const handleArrowClick = (menuName: string) => {
    let newActiveMenus = [...activeMenus];

    if (newActiveMenus.includes(menuName)) {
      var index = newActiveMenus.indexOf(menuName);
      if (index > -1) {
        newActiveMenus.splice(index, 1);
      }
    } else {
      newActiveMenus.push(menuName);
    }

    setActiveMenus(newActiveMenus);
  };

  const ListMenu = ({
    dept,
    data,
    hasSubMenu,
    menuName,
    menuIndex,
    className = "",
  }: any) =>
    data.label && (
      <li className={`mb-0.5 ${className}`}>
        <div className="relative flex items-center justify-between">
          <Link
            href={data.path}
            className="w-full text-[15px] menu-item relative py-3 ltr:pl-5 rtl:pr-5 ltr:md:pl-6 rtl:md:pr-6 ltr:pr-4 rtl:pl-4 transition duration-300 ease-in-out"
          >
            <span className="block w-full" onClick={closeSidebar}>
              {t(`${data.label}`)}
            </span>
          </Link>
          {hasSubMenu && (
            <div
              className="absolute top-0 flex items-center justify-end w-full h-full text-lg cursor-pointer ltr:left-0 rtl:right-0 ltr:pr-5 rtl:pl-5"
              onClick={() => handleArrowClick(menuName)}
            >
              <IoIosArrowDown
                className={`transition duration-200 ease-in-out transform text-heading ${
                  activeMenus.includes(menuName) ? "-rotate-180" : "rotate-0"
                }`}
              />
            </div>
          )}
        </div>
        {hasSubMenu && (
          <SubMenu
            dept={dept}
            data={data.subMenu}
            toggle={activeMenus.includes(menuName)}
            menuIndex={menuIndex}
          />
        )}
      </li>
    );

  const SubMenu = ({ dept, data, toggle, menuIndex }: any) => {
    if (!toggle) {
      return null;
    }

    dept = dept + 1;

    return (
      <ul className="pt-0.5">
        {data?.map((menu: any, index: number) => {
          const menuName: string = `sidebar-submenu-${dept}-${menuIndex}-${index}`;

          return (
            <ListMenu
              dept={dept}
              data={menu}
              hasSubMenu={menu.subMenu}
              menuName={menuName}
              key={menuName}
              menuIndex={index}
              className={dept > 1 && "ltr:pl-4 rtl:pr-4"}
            />
          );
        })}
      </ul>
    );
  };

  return (
    <>
      <div className="flex flex-col justify-between w-full h-full">
        <div className="w-full border-b border-gray-100 flex justify-between items-center relative ltr:pl-5 rtl:pr-5 ltr:md:pl-7 rtl:md:pr-7 flex-shrink-0 py-0.5">
          <Logo />

          <button
            className="flex items-center justify-center px-4 py-6 text-2xl text-gray-500 transition-opacity md:px-6 lg:py-8 focus:outline-none hover:opacity-60"
            onClick={closeSidebar}
            aria-label="close"
          >
            <IoClose className="text-black mt-1 md:mt-0.5" />
          </button>
        </div>

        <Scrollbar className="flex-grow mb-auto menu-scrollbar">
          <div className="flex flex-col px-0 py-7 lg:px-2 text-heading">
            <ul className="mobileMenu">
              {site_header.mobileMenu.map((menu, index) => {
                const dept: number = 1;
                const menuName: string = `sidebar-menu-${dept}-${index}`;

                return (
                  <ListMenu
                    dept={dept}
                    data={menu}
                    hasSubMenu={menu.subMenu}
                    menuName={menuName}
                    key={menuName}
                    menuIndex={index}
                  />
                );
              })}
              
              {/* Admin Menu Section - Only show for admin users */}
              {session?.user?.email && session.user?.role === 'admin' && (
                <>
                  {/* Divider */}
                  <li className="border-t border-gray-200 dark:border-gray-600 my-3 mx-5"></li>
                  
                  {/* Admin Section Header */}
                  <li className="mb-0.5">
                    <div className="flex items-center gap-3 py-3 ltr:pl-5 rtl:pr-5 ltr:md:pl-6 rtl:md:pr-6">
                      <FiSettings className="w-5 h-5 text-accent" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Admin Panel
                      </span>
                    </div>
                  </li>
                  
                  {/* Manage Blogs */}
                  <li className="mb-0.5">
                    <Link
                      href="/admin/blogs"
                      className="flex items-center justify-between py-3 ltr:pl-8 rtl:pr-8 ltr:md:pl-10 rtl:md:pr-10 ltr:pr-4 rtl:pl-4 text-[15px] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FiList className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Manage Blogs</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">View, edit & delete</div>
                        </div>
                      </div>
                      <FiChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </li>
                  
                  {/* Create New Blog */}
                  <li className="mb-0.5">
                    <Link
                      href="/admin/blogs/create"
                      className="flex items-center justify-between py-3 ltr:pl-8 rtl:pr-8 ltr:md:pl-10 rtl:md:pr-10 ltr:pr-4 rtl:pl-4 text-[15px] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FiPlus className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Create New Blog</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Write an article</div>
                        </div>
                      </div>
                      <FiChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </li>
                  
                  {/* View Public Blogs */}
                  <li className="mb-0.5">
                    <Link
                      href="/blogs"
                      className="flex items-center justify-between py-3 ltr:pl-8 rtl:pr-8 ltr:md:pl-10 rtl:md:pr-10 ltr:pr-4 rtl:pl-4 text-[15px] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FiFileText className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">View Public Blogs</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">See visitor view</div>
                        </div>
                      </div>
                      <FiChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </Scrollbar>

        <div className="flex items-center justify-center flex-shrink-0 bg-white border-t border-gray-100 px-7 gap-x-1">
          {social?.map((item, index) => (
            <a
              href={item.link}
              className={`text-heading p-5 opacity-60 ltr:first:-ml-4 rtl:first:-mr-4 transition duration-300 ease-in hover:opacity-100 ${item.className}`}
              target="_blank"
              key={index}
            >
              <span className="sr-only">{t(`${item.title}`)}</span>
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
