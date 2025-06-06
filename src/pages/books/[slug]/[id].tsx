import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Divider from "@components/ui/divider";
import Breadcrumb from "@components/common/breadcrumb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState, forwardRef, useRef } from "react";
import Head from "next/head";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styled from "styled-components";
import { signIn, useSession } from "next-auth/react";

const SlickWithRef = forwardRef<any>((props, ref) => {
  const Slider = require("react-slick").default;
  return <Slider ref={ref} {...props} />;
});

const Wrapper = styled.div`
  position: relative;
  height: 75vh;
  .slick-slider,
  .slick-list,
  .slick-track,
  .slick-slide > div {
    height: 100%; /* 👈 ensures all internal slider elements take full height */
  }
  .slick-prev,
  .slick-next {
    z-index: 10;
    width: 48px;
    height: 48px;
    display: flex !important;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;

    img {
      width: 24px;
      height: 24px;
      filter: invert(1); /* make arrow white */
    }
  }

  .slick-prev {
    left: 16px;

    @media (max-width: 768px) {
      left: 8px;
    }
  }

  .slick-next {
    right: 16px;

    @media (max-width: 768px) {
      right: 8px;
    }
  }

  @media (max-width: 768px) {
    .slick-prev img,
    .slick-next img {
      display: none;
    }
  }
`;

export default function BookPage() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook]: any = useState([]);
  const [infiniteState, setInfinite] = useState(false);
  const sliderRef = useRef<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const { data: session } = useSession();

  const settings: any = {
    dots: false,
    infinite: infiniteState,
    slidesToShow: 1,
    slidesToScroll: 1,
    lazyLoad: true,
    initialSlide: 0,
    focusOnSelect: true,
    adaptiveHeight: true,
    swipe: true,
    touchMove: true,
    swipeToSlide: true,
    arrows: true, // make sure it's not false
    afterChange: (index: number) => setCurrentSlide(index),
    beforeChange: (oldIndex: number, newIndex: number) => {
      setCurrentPage(newIndex); // update dropdown when slider changes
    },
  };

  const fetchBookInfo = async () => {
    try {
      const res = await fetch(`/api/books/info/${id}`);
      const data = await res.json();

      if (res.ok) {
        setInfinite(data?.Images?.length > 3);
        setBook(data);
      } else {
        console.error("Failed to fetch book info:", data.error);
      }
    } catch (error) {
      console.error("Error fetching book info:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBookInfo();
    }
  }, [id]);

  useEffect(() => {
    if (currentPage > 5 && !session) {
      signIn("google");
    }
  }, [currentPage]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = Number(e.target.value);
    setCurrentPage(selectedIndex);
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(selectedIndex);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden m-0 p-0">
      <Wrapper>
        {book && book.Images?.length > 0 && (
          <>
            <SlickWithRef ref={sliderRef} {...settings}>
              {book.Images.map((item: any, index: number) => (
                <div
                  key={index}
                  className="w-screen h-screen flex justify-center items-center"
                >
                  <TransformWrapper
                    pinch={{ disabled: false }}
                    doubleClick={{ disabled: false }}
                    wheel={{ disabled: false }}
                  >
                    <TransformComponent
                      contentStyle={{ width: "100%" }}
                      wrapperStyle={{ width: "100%" }}
                    >
                      <div className="h-[75vh] md:h-[75vh] w-full">
                        <img
                          className="w-full h-full object-contain"
                          src={item}
                          alt={`Page ${index + 1}`}
                        />
                      </div>
                    </TransformComponent>
                  </TransformWrapper>
                </div>
              ))}
            </SlickWithRef>
            {/* Move this into safe visible zone */}
            {/* Dropdown for pagination */}
            {book.Images && book.Images.length > 1 && (
              <div className="mt-4 px-4 flex justify-center">
                <select
                  value={currentPage}
                  onChange={handleSelectChange}
                  className="border border-gray-300 rounded-md px-3 py-2 text-base cursor-pointer max-w-xs w-full"
                  aria-label="Select page"
                >
                  {book.Images.map((_, index) => (
                    <option key={index} value={index}>
                      Page {index + 1} of {book.Images.length}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}
      </Wrapper>
    </div>
  );
}

BookPage.Layout = Layout;

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
