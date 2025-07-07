import { ILFlag } from "@components/icons/ILFlag";
import { SAFlag } from "@components/icons/SAFlag";
import { CNFlag } from "@components/icons/CNFlag";
import { USFlag } from "@components/icons/USFlag";
import { DEFlag } from "@components/icons/DEFlag";
import { ESFlag } from "@components/icons/ESFlag";
import Nike from "public/assets/images/brands/megamenu/nike.png";
import Dior from "public/assets/images/brands/megamenu/dior.png";
import Gucci from "public/assets/images/brands/megamenu/gucci.png";
import Gucci1 from "public/assets/images/brands/megamenu/gucci1.png";
import Puma from "public/assets/images/brands/megamenu/puma.png";
import Levis from "public/assets/images/brands/megamenu/levis.png";
import Banner1 from "public/assets/images/banner/megamenu/banner-1.png";
import Banner2 from "public/assets/images/banner/megamenu/banner-2.png";

import { ThunderIcon } from "@components/icons/thunder-icon";
import { WomenIcon } from "@components/icons/women-icon";
import { MenIcon } from "@components/icons/men-icon";
import { WatchIcon } from "@components/icons/watch-icon";
import { WalletIcon } from "@components/icons/wallet-icon";
import { BagIcon } from "@components/icons/bag-icon";
import { JewelryIcon } from "@components/icons/jewelry-icon";
import { SunglassIcon } from "@components/icons/sunglass-icon";
import { SneakerIcon } from "@components/icons/sneaker-icon";

export const siteSettings = {
  name: "Iftekhari Silsila",
  description:
    "Sufi Books , Sufi Music, Sufi Videos, Sufi Poetry, Sufi Quotes, Sufi Articles",
  author: {
    name: "IFTEKHARI SILSILA",
    websiteUrl: "http://www.silsilaeiftekhari.in/",
    address: "",
  },
  logo: {
    url: "/assets/images/logo.png",
    alt: "Iftekhari Silsila",
    href: "/",
    width: 200,
    height: 60,
  },
  defaultLanguage: "en",
  currencyCode: "USD",
  site_header: {
    menu: [
      {
        id: 1,
        path: "/",
        label: "menu-home",
      },
      {
        id: 2,
        path: "/books",
        label: "menu-book",
      },
      {
        id: 3,
        path: "/blogs",
        label: "menu-blogs",
      },
      {
        id: 4,
        path: "/my-library",
        label: "menu-my-library",
      },
    ],
    mobileMenu: [
      {
        id: 1,
        path: "/",
        label: "menu-home",
      },
      {
        id: 2,
        path: "/books",
        label: "menu-book",
      },
      {
        id: 3,
        path: "/blogs",
        label: "menu-blogs",
      },
      {
        id: 4,
        path: "/my-library",
        label: "menu-my-library",
      },
    ],
    languageMenu: [
      {
        id: "ar",
        name: "عربى - AR",
        value: "ar",
        icon: <SAFlag width="20px" height="15px" />,
      },
      {
        id: "zh",
        name: "中国人 - ZH",
        value: "zh",
        icon: <CNFlag width="20px" height="15px" />,
      },
      {
        id: "en",
        name: "English - EN",
        value: "en",
        icon: <USFlag width="20px" height="15px" />,
      },
      {
        id: "de",
        name: "Deutsch - DE",
        value: "de",
        icon: <DEFlag width="20px" height="15px" />,
      },
      {
        id: "he",
        name: "rעברית - HE",
        value: "he",
        icon: <ILFlag width="20px" height="15px" />,
      },
      {
        id: "es",
        name: "Español - ES",
        value: "es",
        icon: <ESFlag width="20px" height="15px" />,
      },
    ],
    categoryMenu: [
      {
        id: 1,
        path: "/",
        label: "menu-womens-fashion",
        icon: <WomenIcon />,
        columns: [
          {
            id: 1,
            columnItems: [
              {
                id: 1,
                path: "/search?q=top-wear",
                label: "menu-top-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=t-shit-shirtrt",
                    label: "menu-t-shirt",
                  },
                  {
                    id: 2,
                    path: "/search?q=casual-shirts",
                    label: "menu-casual-shirts",
                  },
                  {
                    id: 3,
                    path: "/search?q=formal-shirts",
                    label: "menu-formal-shirts",
                  },
                  {
                    id: 4,
                    path: "/search?q=blazwers-coats",
                    label: "menu-blazwers-coats",
                  },
                  {
                    id: 5,
                    path: "/search?q=suits",
                    label: "menu-suits",
                  },
                  {
                    id: 6,
                    path: "/search?q=jackets",
                    label: "menu-jackets",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=belt-scarves",
                label: "menu-belt-scarves",
              },
              {
                id: 3,
                path: "/search?q=watches-wearables",
                label: "menu-watches-wearables",
              },
            ],
          },
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/search?q=western-wear",
                label: "menu-western-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=dresses",
                    label: "menu-dresses",
                  },
                  {
                    id: 2,
                    path: "/search?q=jumpsuits",
                    label: "menu-jumpsuits",
                  },
                  {
                    id: 3,
                    path: "/search?q=tops-t-shirt",
                    label: "menu-tops-shirts",
                  },
                  {
                    id: 4,
                    path: "/search?q=shorts-skirts",
                    label: "menu-shorts-skirts",
                  },
                  {
                    id: 5,
                    path: "/search?q=shurgs",
                    label: "menu-shurgs",
                  },
                  {
                    id: 6,
                    path: "/search?q=blazers",
                    label: "menu-blazers",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=plus-size",
                label: "menu-plus-size",
              },
              {
                id: 3,
                path: "/search?q=sunglasses-frames",
                label: "menu-sunglasses-frames",
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/search?q=footwear",
                label: "menu-footwear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=flats",
                    label: "menu-flats",
                  },
                  {
                    id: 2,
                    path: "/search?q=casual-shoes",
                    label: "menu-casual-shoes",
                  },
                  {
                    id: 3,
                    path: "/search?q=heels",
                    label: "menu-heels",
                  },
                  {
                    id: 4,
                    path: "/search?q=boots",
                    label: "menu-boots",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=sports-active-wear",
                label: "menu-sports-active-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=clothing",
                    label: "menu-clothing",
                  },
                  {
                    id: 2,
                    path: "/search?q=footwear",
                    label: "menu-footwear",
                  },
                  {
                    id: 3,
                    path: "/search?q=sports-accessories",
                    label: "menu-sports-accessories",
                  },
                ],
              },
            ],
          },
        ],
        brands: [
          {
            id: 1,
            path: "/search?q=nike",
            label: "nike",
            icon: Nike,
          },
          {
            id: 2,
            path: "/search?q=dior",
            label: "dior",
            icon: Dior,
          },
          {
            id: 3,
            path: "/search?q=gucci",
            label: "gucci",
            icon: Gucci,
          },
          {
            id: 4,
            path: "/search?q=gucci1",
            label: "gucci1",
            icon: Gucci1,
          },
          {
            id: 5,
            path: "/search?q=puma",
            label: "puma",
            icon: Puma,
          },
          {
            id: 6,
            path: "/search?q=levis",
            label: "levis",
            icon: Levis,
          },
        ],
        banners: [
          {
            id: 1,
            path: "/search?q=winter",
            label: "winter",
            image: Banner1,
          },
          {
            id: 2,
            path: "/search?q=summer",
            label: "summer",
            image: Banner2,
          },
        ],
      },
      {
        id: 2,
        path: "/",
        label: "menu-mens-fashion",
        icon: <MenIcon />,
        columns: [
          {
            id: 1,
            columnItems: [
              {
                id: 1,
                path: "/search?q=top-wear",
                label: "menu-top-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=t-shit-shirtrt",
                    label: "menu-t-shirt",
                  },
                  {
                    id: 2,
                    path: "/search?q=casual-shirts",
                    label: "menu-casual-shirts",
                  },
                  {
                    id: 3,
                    path: "/search?q=formal-shirts",
                    label: "menu-formal-shirts",
                  },
                  {
                    id: 4,
                    path: "/search?q=blazwers-coats",
                    label: "menu-blazwers-coats",
                  },
                  {
                    id: 5,
                    path: "/search?q=suits",
                    label: "menu-suits",
                  },
                  {
                    id: 6,
                    path: "/search?q=jackets",
                    label: "menu-jackets",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=belt-scarves",
                label: "menu-belt-scarves",
              },
              {
                id: 3,
                path: "/search?q=watches-wearables",
                label: "menu-watches-wearables",
              },
            ],
          },
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/search?q=western-wear",
                label: "menu-western-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=dresses",
                    label: "menu-dresses",
                  },
                  {
                    id: 2,
                    path: "/search?q=jumpsuits",
                    label: "menu-jumpsuits",
                  },
                  {
                    id: 3,
                    path: "/search?q=tops-t-shirt",
                    label: "menu-tops-shirts",
                  },
                  {
                    id: 4,
                    path: "/search?q=shorts-skirts",
                    label: "menu-shorts-skirts",
                  },
                  {
                    id: 5,
                    path: "/search?q=shurgs",
                    label: "menu-shurgs",
                  },
                  {
                    id: 6,
                    path: "/search?q=blazers",
                    label: "menu-blazers",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=plus-size",
                label: "menu-plus-size",
              },
              {
                id: 3,
                path: "/search?q=sunglasses-frames",
                label: "menu-sunglasses-frames",
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/search?q=footwear",
                label: "menu-footwear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=flats",
                    label: "menu-flats",
                  },
                  {
                    id: 2,
                    path: "/search?q=casual-shoes",
                    label: "menu-casual-shoes",
                  },
                  {
                    id: 3,
                    path: "/search?q=heels",
                    label: "menu-heels",
                  },
                  {
                    id: 4,
                    path: "/search?q=boots",
                    label: "menu-boots",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=sports-active-wear",
                label: "menu-sports-active-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=clothing",
                    label: "menu-clothing",
                  },
                  {
                    id: 2,
                    path: "/search?q=footwear",
                    label: "menu-footwear",
                  },
                  {
                    id: 3,
                    path: "/search?q=sports-accessories",
                    label: "menu-sports-accessories",
                  },
                ],
              },
            ],
          },
        ],
        brands: [
          {
            id: 1,
            path: "/search?q=nike",
            label: "nike",
            icon: Nike,
          },
          {
            id: 2,
            path: "/search?q=dior",
            label: "dior",
            icon: Dior,
          },
          {
            id: 3,
            path: "/search?q=gucci",
            label: "gucci",
            icon: Gucci,
          },
          {
            id: 4,
            path: "/search?q=gucci1",
            label: "gucci1",
            icon: Gucci1,
          },
          {
            id: 5,
            path: "/search?q=puma",
            label: "puma",
            icon: Puma,
          },
          {
            id: 6,
            path: "/search?q=levis",
            label: "levis",
            icon: Levis,
          },
        ],
        banners: [
          {
            id: 1,
            path: "/search?q=winter",
            label: "winter",
            image: Banner1,
          },
          {
            id: 2,
            path: "/search?q=summer",
            label: "summer",
            image: Banner2,
          },
        ],
      },
      {
        id: 3,
        path: "/",
        label: "menu-watches",
        icon: <WatchIcon />,
        columns: [
          {
            id: 1,
            columnItems: [
              {
                id: 1,
                path: "/search?q=top-wear",
                label: "menu-top-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=t-shit-shirtrt",
                    label: "menu-t-shirt",
                  },
                  {
                    id: 2,
                    path: "/search?q=casual-shirts",
                    label: "menu-casual-shirts",
                  },
                  {
                    id: 3,
                    path: "/search?q=formal-shirts",
                    label: "menu-formal-shirts",
                  },
                  {
                    id: 4,
                    path: "/search?q=blazwers-coats",
                    label: "menu-blazwers-coats",
                  },
                  {
                    id: 5,
                    path: "/search?q=suits",
                    label: "menu-suits",
                  },
                  {
                    id: 6,
                    path: "/search?q=jackets",
                    label: "menu-jackets",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=belt-scarves",
                label: "menu-belt-scarves",
              },
              {
                id: 3,
                path: "/search?q=watches-wearables",
                label: "menu-watches-wearables",
              },
            ],
          },
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/search?q=western-wear",
                label: "menu-western-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=dresses",
                    label: "menu-dresses",
                  },
                  {
                    id: 2,
                    path: "/search?q=jumpsuits",
                    label: "menu-jumpsuits",
                  },
                  {
                    id: 3,
                    path: "/search?q=tops-t-shirt",
                    label: "menu-tops-shirts",
                  },
                  {
                    id: 4,
                    path: "/search?q=shorts-skirts",
                    label: "menu-shorts-skirts",
                  },
                  {
                    id: 5,
                    path: "/search?q=shurgs",
                    label: "menu-shurgs",
                  },
                  {
                    id: 6,
                    path: "/search?q=blazers",
                    label: "menu-blazers",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=plus-size",
                label: "menu-plus-size",
              },
              {
                id: 3,
                path: "/search?q=sunglasses-frames",
                label: "menu-sunglasses-frames",
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/search?q=footwear",
                label: "menu-footwear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=flats",
                    label: "menu-flats",
                  },
                  {
                    id: 2,
                    path: "/search?q=casual-shoes",
                    label: "menu-casual-shoes",
                  },
                  {
                    id: 3,
                    path: "/search?q=heels",
                    label: "menu-heels",
                  },
                  {
                    id: 4,
                    path: "/search?q=boots",
                    label: "menu-boots",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=sports-active-wear",
                label: "menu-sports-active-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=clothing",
                    label: "menu-clothing",
                  },
                  {
                    id: 2,
                    path: "/search?q=footwear",
                    label: "menu-footwear",
                  },
                  {
                    id: 3,
                    path: "/search?q=sports-accessories",
                    label: "menu-sports-accessories",
                  },
                ],
              },
            ],
          },
        ],
        brands: [
          {
            id: 1,
            path: "/search?q=nike",
            label: "nike",
            icon: Nike,
          },
          {
            id: 2,
            path: "/search?q=dior",
            label: "dior",
            icon: Dior,
          },
          {
            id: 3,
            path: "/search?q=gucci",
            label: "gucci",
            icon: Gucci,
          },
          {
            id: 4,
            path: "/search?q=gucci1",
            label: "gucci1",
            icon: Gucci1,
          },
          {
            id: 5,
            path: "/search?q=puma",
            label: "puma",
            icon: Puma,
          },
          {
            id: 6,
            path: "/search?q=levis",
            label: "levis",
            icon: Levis,
          },
        ],
        banners: [
          {
            id: 1,
            path: "/search?q=winter",
            label: "winter",
            image: Banner1,
          },
          {
            id: 2,
            path: "/search?q=summer",
            label: "summer",
            image: Banner2,
          },
        ],
      },
      {
        id: 4,
        path: "/",
        label: "menu-wallets",
        icon: <WalletIcon />,
        columns: [
          {
            id: 1,
            columnItems: [
              {
                id: 1,
                path: "/search?q=top-wear",
                label: "menu-top-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=t-shit-shirtrt",
                    label: "menu-t-shirt",
                  },
                  {
                    id: 2,
                    path: "/search?q=casual-shirts",
                    label: "menu-casual-shirts",
                  },
                  {
                    id: 3,
                    path: "/search?q=formal-shirts",
                    label: "menu-formal-shirts",
                  },
                  {
                    id: 4,
                    path: "/search?q=blazwers-coats",
                    label: "menu-blazwers-coats",
                  },
                  {
                    id: 5,
                    path: "/search?q=suits",
                    label: "menu-suits",
                  },
                  {
                    id: 6,
                    path: "/search?q=jackets",
                    label: "menu-jackets",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=belt-scarves",
                label: "menu-belt-scarves",
              },
              {
                id: 3,
                path: "/search?q=watches-wearables",
                label: "menu-watches-wearables",
              },
            ],
          },
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/search?q=western-wear",
                label: "menu-western-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=dresses",
                    label: "menu-dresses",
                  },
                  {
                    id: 2,
                    path: "/search?q=jumpsuits",
                    label: "menu-jumpsuits",
                  },
                  {
                    id: 3,
                    path: "/search?q=tops-t-shirt",
                    label: "menu-tops-shirts",
                  },
                  {
                    id: 4,
                    path: "/search?q=shorts-skirts",
                    label: "menu-shorts-skirts",
                  },
                  {
                    id: 5,
                    path: "/search?q=shurgs",
                    label: "menu-shurgs",
                  },
                  {
                    id: 6,
                    path: "/search?q=blazers",
                    label: "menu-blazers",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=plus-size",
                label: "menu-plus-size",
              },
              {
                id: 3,
                path: "/search?q=sunglasses-frames",
                label: "menu-sunglasses-frames",
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/search?q=footwear",
                label: "menu-footwear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=flats",
                    label: "menu-flats",
                  },
                  {
                    id: 2,
                    path: "/search?q=casual-shoes",
                    label: "menu-casual-shoes",
                  },
                  {
                    id: 3,
                    path: "/search?q=heels",
                    label: "menu-heels",
                  },
                  {
                    id: 4,
                    path: "/search?q=boots",
                    label: "menu-boots",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=sports-active-wear",
                label: "menu-sports-active-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=clothing",
                    label: "menu-clothing",
                  },
                  {
                    id: 2,
                    path: "/search?q=footwear",
                    label: "menu-footwear",
                  },
                  {
                    id: 3,
                    path: "/search?q=sports-accessories",
                    label: "menu-sports-accessories",
                  },
                ],
              },
            ],
          },
        ],
        brands: [
          {
            id: 1,
            path: "/search?q=nike",
            label: "nike",
            icon: Nike,
          },
          {
            id: 2,
            path: "/search?q=dior",
            label: "dior",
            icon: Dior,
          },
          {
            id: 3,
            path: "/search?q=gucci",
            label: "gucci",
            icon: Gucci,
          },
          {
            id: 4,
            path: "/search?q=gucci1",
            label: "gucci1",
            icon: Gucci1,
          },
          {
            id: 5,
            path: "/search?q=puma",
            label: "puma",
            icon: Puma,
          },
          {
            id: 6,
            path: "/search?q=levis",
            label: "levis",
            icon: Levis,
          },
        ],
        banners: [
          {
            id: 1,
            path: "/search?q=winter",
            label: "winter",
            image: Banner1,
          },
          {
            id: 2,
            path: "/search?q=summer",
            label: "summer",
            image: Banner2,
          },
        ],
      },
      {
        id: 5,
        path: "/",
        label: "menu-bags",
        icon: <BagIcon />,
        columns: [
          {
            id: 1,
            columnItems: [
              {
                id: 1,
                path: "/search?q=top-wear",
                label: "menu-top-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=t-shit-shirtrt",
                    label: "menu-t-shirt",
                  },
                  {
                    id: 2,
                    path: "/search?q=casual-shirts",
                    label: "menu-casual-shirts",
                  },
                  {
                    id: 3,
                    path: "/search?q=formal-shirts",
                    label: "menu-formal-shirts",
                  },
                  {
                    id: 4,
                    path: "/search?q=blazwers-coats",
                    label: "menu-blazwers-coats",
                  },
                  {
                    id: 5,
                    path: "/search?q=suits",
                    label: "menu-suits",
                  },
                  {
                    id: 6,
                    path: "/search?q=jackets",
                    label: "menu-jackets",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=belt-scarves",
                label: "menu-belt-scarves",
              },
              {
                id: 3,
                path: "/search?q=watches-wearables",
                label: "menu-watches-wearables",
              },
            ],
          },
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/search?q=western-wear",
                label: "menu-western-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=dresses",
                    label: "menu-dresses",
                  },
                  {
                    id: 2,
                    path: "/search?q=jumpsuits",
                    label: "menu-jumpsuits",
                  },
                  {
                    id: 3,
                    path: "/search?q=tops-t-shirt",
                    label: "menu-tops-shirts",
                  },
                  {
                    id: 4,
                    path: "/search?q=shorts-skirts",
                    label: "menu-shorts-skirts",
                  },
                  {
                    id: 5,
                    path: "/search?q=shurgs",
                    label: "menu-shurgs",
                  },
                  {
                    id: 6,
                    path: "/search?q=blazers",
                    label: "menu-blazers",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=plus-size",
                label: "menu-plus-size",
              },
              {
                id: 3,
                path: "/search?q=sunglasses-frames",
                label: "menu-sunglasses-frames",
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/search?q=footwear",
                label: "menu-footwear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=flats",
                    label: "menu-flats",
                  },
                  {
                    id: 2,
                    path: "/search?q=casual-shoes",
                    label: "menu-casual-shoes",
                  },
                  {
                    id: 3,
                    path: "/search?q=heels",
                    label: "menu-heels",
                  },
                  {
                    id: 4,
                    path: "/search?q=boots",
                    label: "menu-boots",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=sports-active-wear",
                label: "menu-sports-active-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=clothing",
                    label: "menu-clothing",
                  },
                  {
                    id: 2,
                    path: "/search?q=footwear",
                    label: "menu-footwear",
                  },
                  {
                    id: 3,
                    path: "/search?q=sports-accessories",
                    label: "menu-sports-accessories",
                  },
                ],
              },
            ],
          },
        ],
        brands: [
          {
            id: 1,
            path: "/search?q=nike",
            label: "nike",
            icon: Nike,
          },
          {
            id: 2,
            path: "/search?q=dior",
            label: "dior",
            icon: Dior,
          },
          {
            id: 3,
            path: "/search?q=gucci",
            label: "gucci",
            icon: Gucci,
          },
          {
            id: 4,
            path: "/search?q=gucci1",
            label: "gucci1",
            icon: Gucci1,
          },
          {
            id: 5,
            path: "/search?q=puma",
            label: "puma",
            icon: Puma,
          },
          {
            id: 6,
            path: "/search?q=levis",
            label: "levis",
            icon: Levis,
          },
        ],
        banners: [
          {
            id: 1,
            path: "/search?q=winter",
            label: "winter",
            image: Banner1,
          },
          {
            id: 2,
            path: "/search?q=summer",
            label: "summer",
            image: Banner2,
          },
        ],
      },
      {
        id: 6,
        path: "/",
        label: "menu-jewelry",
        icon: <JewelryIcon />,
        columns: [
          {
            id: 1,
            columnItems: [
              {
                id: 1,
                path: "/search?q=top-wear",
                label: "menu-top-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=t-shit-shirtrt",
                    label: "menu-t-shirt",
                  },
                  {
                    id: 2,
                    path: "/search?q=casual-shirts",
                    label: "menu-casual-shirts",
                  },
                  {
                    id: 3,
                    path: "/search?q=formal-shirts",
                    label: "menu-formal-shirts",
                  },
                  {
                    id: 4,
                    path: "/search?q=blazwers-coats",
                    label: "menu-blazwers-coats",
                  },
                  {
                    id: 5,
                    path: "/search?q=suits",
                    label: "menu-suits",
                  },
                  {
                    id: 6,
                    path: "/search?q=jackets",
                    label: "menu-jackets",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=belt-scarves",
                label: "menu-belt-scarves",
              },
              {
                id: 3,
                path: "/search?q=watches-wearables",
                label: "menu-watches-wearables",
              },
            ],
          },
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/search?q=western-wear",
                label: "menu-western-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=dresses",
                    label: "menu-dresses",
                  },
                  {
                    id: 2,
                    path: "/search?q=jumpsuits",
                    label: "menu-jumpsuits",
                  },
                  {
                    id: 3,
                    path: "/search?q=tops-t-shirt",
                    label: "menu-tops-shirts",
                  },
                  {
                    id: 4,
                    path: "/search?q=shorts-skirts",
                    label: "menu-shorts-skirts",
                  },
                  {
                    id: 5,
                    path: "/search?q=shurgs",
                    label: "menu-shurgs",
                  },
                  {
                    id: 6,
                    path: "/search?q=blazers",
                    label: "menu-blazers",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=plus-size",
                label: "menu-plus-size",
              },
              {
                id: 3,
                path: "/search?q=sunglasses-frames",
                label: "menu-sunglasses-frames",
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/search?q=footwear",
                label: "menu-footwear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=flats",
                    label: "menu-flats",
                  },
                  {
                    id: 2,
                    path: "/search?q=casual-shoes",
                    label: "menu-casual-shoes",
                  },
                  {
                    id: 3,
                    path: "/search?q=heels",
                    label: "menu-heels",
                  },
                  {
                    id: 4,
                    path: "/search?q=boots",
                    label: "menu-boots",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=sports-active-wear",
                label: "menu-sports-active-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=clothing",
                    label: "menu-clothing",
                  },
                  {
                    id: 2,
                    path: "/search?q=footwear",
                    label: "menu-footwear",
                  },
                  {
                    id: 3,
                    path: "/search?q=sports-accessories",
                    label: "menu-sports-accessories",
                  },
                ],
              },
            ],
          },
        ],
        brands: [
          {
            id: 1,
            path: "/search?q=nike",
            label: "nike",
            icon: Nike,
          },
          {
            id: 2,
            path: "/search?q=dior",
            label: "dior",
            icon: Dior,
          },
          {
            id: 3,
            path: "/search?q=gucci",
            label: "gucci",
            icon: Gucci,
          },
          {
            id: 4,
            path: "/search?q=gucci1",
            label: "gucci1",
            icon: Gucci1,
          },
          {
            id: 5,
            path: "/search?q=puma",
            label: "puma",
            icon: Puma,
          },
          {
            id: 6,
            path: "/search?q=levis",
            label: "levis",
            icon: Levis,
          },
        ],
        banners: [
          {
            id: 1,
            path: "/search?q=winter",
            label: "winter",
            image: Banner1,
          },
          {
            id: 2,
            path: "/search?q=summer",
            label: "summer",
            image: Banner2,
          },
        ],
      },
      {
        id: 7,
        path: "/",
        label: "menu-sunglasses",
        icon: <SunglassIcon />,
        columns: [
          {
            id: 1,
            columnItems: [
              {
                id: 1,
                path: "/search?q=top-wear",
                label: "menu-top-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=t-shit-shirtrt",
                    label: "menu-t-shirt",
                  },
                  {
                    id: 2,
                    path: "/search?q=casual-shirts",
                    label: "menu-casual-shirts",
                  },
                  {
                    id: 3,
                    path: "/search?q=formal-shirts",
                    label: "menu-formal-shirts",
                  },
                  {
                    id: 4,
                    path: "/search?q=blazwers-coats",
                    label: "menu-blazwers-coats",
                  },
                  {
                    id: 5,
                    path: "/search?q=suits",
                    label: "menu-suits",
                  },
                  {
                    id: 6,
                    path: "/search?q=jackets",
                    label: "menu-jackets",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=belt-scarves",
                label: "menu-belt-scarves",
              },
              {
                id: 3,
                path: "/search?q=watches-wearables",
                label: "menu-watches-wearables",
              },
            ],
          },
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/search?q=western-wear",
                label: "menu-western-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=dresses",
                    label: "menu-dresses",
                  },
                  {
                    id: 2,
                    path: "/search?q=jumpsuits",
                    label: "menu-jumpsuits",
                  },
                  {
                    id: 3,
                    path: "/search?q=tops-t-shirt",
                    label: "menu-tops-shirts",
                  },
                  {
                    id: 4,
                    path: "/search?q=shorts-skirts",
                    label: "menu-shorts-skirts",
                  },
                  {
                    id: 5,
                    path: "/search?q=shurgs",
                    label: "menu-shurgs",
                  },
                  {
                    id: 6,
                    path: "/search?q=blazers",
                    label: "menu-blazers",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=plus-size",
                label: "menu-plus-size",
              },
              {
                id: 3,
                path: "/search?q=sunglasses-frames",
                label: "menu-sunglasses-frames",
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/search?q=footwear",
                label: "menu-footwear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=flats",
                    label: "menu-flats",
                  },
                  {
                    id: 2,
                    path: "/search?q=casual-shoes",
                    label: "menu-casual-shoes",
                  },
                  {
                    id: 3,
                    path: "/search?q=heels",
                    label: "menu-heels",
                  },
                  {
                    id: 4,
                    path: "/search?q=boots",
                    label: "menu-boots",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=sports-active-wear",
                label: "menu-sports-active-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=clothing",
                    label: "menu-clothing",
                  },
                  {
                    id: 2,
                    path: "/search?q=footwear",
                    label: "menu-footwear",
                  },
                  {
                    id: 3,
                    path: "/search?q=sports-accessories",
                    label: "menu-sports-accessories",
                  },
                ],
              },
            ],
          },
        ],
        brands: [
          {
            id: 1,
            path: "/search?q=nike",
            label: "nike",
            icon: Nike,
          },
          {
            id: 2,
            path: "/search?q=dior",
            label: "dior",
            icon: Dior,
          },
          {
            id: 3,
            path: "/search?q=gucci",
            label: "gucci",
            icon: Gucci,
          },
          {
            id: 4,
            path: "/search?q=gucci1",
            label: "gucci1",
            icon: Gucci1,
          },
          {
            id: 5,
            path: "/search?q=puma",
            label: "puma",
            icon: Puma,
          },
          {
            id: 6,
            path: "/search?q=levis",
            label: "levis",
            icon: Levis,
          },
        ],
        banners: [
          {
            id: 1,
            path: "/search?q=winter",
            label: "winter",
            image: Banner1,
          },
          {
            id: 2,
            path: "/search?q=summer",
            label: "summer",
            image: Banner2,
          },
        ],
      },
      {
        id: 8,
        path: "/",
        label: "menu-sneakers",
        icon: <SneakerIcon />,
        columns: [
          {
            id: 1,
            columnItems: [
              {
                id: 1,
                path: "/search?q=top-wear",
                label: "menu-top-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=t-shit-shirtrt",
                    label: "menu-t-shirt",
                  },
                  {
                    id: 2,
                    path: "/search?q=casual-shirts",
                    label: "menu-casual-shirts",
                  },
                  {
                    id: 3,
                    path: "/search?q=formal-shirts",
                    label: "menu-formal-shirts",
                  },
                  {
                    id: 4,
                    path: "/search?q=blazwers-coats",
                    label: "menu-blazwers-coats",
                  },
                  {
                    id: 5,
                    path: "/search?q=suits",
                    label: "menu-suits",
                  },
                  {
                    id: 6,
                    path: "/search?q=jackets",
                    label: "menu-jackets",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=belt-scarves",
                label: "menu-belt-scarves",
              },
              {
                id: 3,
                path: "/search?q=watches-wearables",
                label: "menu-watches-wearables",
              },
            ],
          },
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/search?q=western-wear",
                label: "menu-western-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=dresses",
                    label: "menu-dresses",
                  },
                  {
                    id: 2,
                    path: "/search?q=jumpsuits",
                    label: "menu-jumpsuits",
                  },
                  {
                    id: 3,
                    path: "/search?q=tops-t-shirt",
                    label: "menu-tops-shirts",
                  },
                  {
                    id: 4,
                    path: "/search?q=shorts-skirts",
                    label: "menu-shorts-skirts",
                  },
                  {
                    id: 5,
                    path: "/search?q=shurgs",
                    label: "menu-shurgs",
                  },
                  {
                    id: 6,
                    path: "/search?q=blazers",
                    label: "menu-blazers",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=plus-size",
                label: "menu-plus-size",
              },
              {
                id: 3,
                path: "/search?q=sunglasses-frames",
                label: "menu-sunglasses-frames",
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/search?q=footwear",
                label: "menu-footwear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=flats",
                    label: "menu-flats",
                  },
                  {
                    id: 2,
                    path: "/search?q=casual-shoes",
                    label: "menu-casual-shoes",
                  },
                  {
                    id: 3,
                    path: "/search?q=heels",
                    label: "menu-heels",
                  },
                  {
                    id: 4,
                    path: "/search?q=boots",
                    label: "menu-boots",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=sports-active-wear",
                label: "menu-sports-active-wear",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=clothing",
                    label: "menu-clothing",
                  },
                  {
                    id: 2,
                    path: "/search?q=footwear",
                    label: "menu-footwear",
                  },
                  {
                    id: 3,
                    path: "/search?q=sports-accessories",
                    label: "menu-sports-accessories",
                  },
                ],
              },
            ],
          },
        ],
        brands: [
          {
            id: 1,
            path: "/search?q=nike",
            label: "nike",
            icon: Nike,
          },
          {
            id: 2,
            path: "/search?q=dior",
            label: "dior",
            icon: Dior,
          },
          {
            id: 3,
            path: "/search?q=gucci",
            label: "gucci",
            icon: Gucci,
          },
          {
            id: 4,
            path: "/search?q=gucci1",
            label: "gucci1",
            icon: Gucci1,
          },
          {
            id: 5,
            path: "/search?q=puma",
            label: "puma",
            icon: Puma,
          },
          {
            id: 6,
            path: "/search?q=levis",
            label: "levis",
            icon: Levis,
          },
        ],
        banners: [
          {
            id: 1,
            path: "/search?q=winter",
            label: "winter",
            image: Banner1,
          },
          {
            id: 2,
            path: "/search?q=summer",
            label: "summer",
            image: Banner2,
          },
        ],
      },
    ],
    pagesMenu: [
      {
        id: 1,
        path: "/search",
        label: "menu-deals-today",
        icon: <ThunderIcon className="w-3 h-auto" />,
      },
      {
        id: 2,
        path: "/",
        label: "menu-offers",
      },
      {
        id: 3,
        path: "/faq",
        label: "menu-faq",
      },
      {
        id: 4,
        path: "/contact-us",
        label: "menu-contact",
      },
    ],
  },
};
